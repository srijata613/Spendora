import React from "react";
import { inngest } from "./client";
import { db } from "../prisma";
import { sendEmail } from "@/actions/send-email";
import EmailTemplate from "@/emails/templates";
import { GoogleGenerativeAI } from "@google/generative-ai";


/* =========================
   BUDGET ALERTS
========================= */

export const checkBudgetAlerts = inngest.createFunction(
  {
    id: "check-budget-alerts",
    triggers: [{ cron: "0 9 * * *" }],
  },
  async ({ step }) => {
    const budgets = await step.run("fetch-user-budgets", async () => {
      return db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: { isDefault: true },
              },
            },
          },
        },
      });
    });

    for (const budget of budgets) {
      const defaultAccount = budget.user.accounts[0];
      if (!defaultAccount) continue;

      await step.run(`check-budget-${budget.id}`, async () => {

        const now = new Date();

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccount.id,
            type: "EXPENSE",
            date: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          _sum: { amount: true },
        });

        const totalExpenses = Number(expenses._sum.amount || 0);
        const budgetAmount = Number(budget.amount || 0);

        if (!budgetAmount) return;

        const percentageUsed = (totalExpenses / budgetAmount) * 100;

        if (
          percentageUsed >= 80 &&
          (!budget.lastAlertSent ||
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
        ) {

          await sendEmail({
            to: budget.user.email,
            subject: "Budget Alert: You're nearing your monthly limit",
            react: (
              <EmailTemplate
                userName={budget.user.name || "User"}
                type="budgetAlert"
                data={{
                  percentageUsed: percentageUsed.toFixed(1),
                  budgetAmount: budgetAmount.toFixed(2),
                  totalExpenses: totalExpenses.toFixed(2),
                  accountName: defaultAccount.name,
                }}
              />
            ),
          });

          await db.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: new Date() },
          });
        }
      });
    }
  }
);


function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}


/* =========================
   RECURRING TRANSACTIONS
========================= */

export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: "trigger-recurring-transactions",
    name: "Trigger Recurring Transactions",
    triggers: [{ cron: "0 0 * * *" }],
  },
  async ({ step }) => {

    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return db.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProcessed: null },
              { nextRecurringDate: { lte: new Date() } },
            ],
          },
        });
      }
    );

    if (!recurringTransactions.length) {
      return { triggered: 0 };
    }

    const events = recurringTransactions.map((t) => ({
      name: "transaction.recurring.process",
      data: { transactionId: t.id, userId: t.userId },
    }));

    await inngest.send(events);

    return { triggered: recurringTransactions.length };
  }
);


export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    triggers: [{ event: "transaction.recurring.process" }],
    throttle: {
      limit: 10,
      period: "1m",
      key: "event.data.userId",
    },
  },
  async ({ event, step }) => {

    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data", event);
      return;
    }

    await step.run("process-transaction", async () => {

      const transaction = await db.transaction.findFirst({
        where: {
          id: event.data.transactionId,
          userId: event.data.userId,
        },
        include: { account: true },
      });

      if (!transaction || !isTransactionDue(transaction)) return;

      await db.$transaction(async (tx) => {

        await tx.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.description} (Recurring)`,
            date: new Date(),
            category: transaction.category,
            userId: transaction.userId,
            accountId: transaction.accountId,
            isRecurring: false,
          },
        });

        const balanceChange =
          transaction.type === "EXPENSE"
            ? -Number(transaction.amount)
            : Number(transaction.amount);

        await tx.account.update({
          where: { id: transaction.accountId },
          data: {
            balance: { increment: balanceChange },
          },
        });

        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: new Date(),
            nextRecurringDate: calculateNextRecurringDate(
              transaction.nextRecurringDate,
              transaction.recurringInterval
            ),
          },
        });
      });
    });
  }
);


function isTransactionDue(transaction) {
  if (!transaction.nextRecurringDate) return true;
  return new Date(transaction.nextRecurringDate) <= new Date();
}


function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
}


/* =========================
   MONTHLY REPORT
========================= */

export const generateMonthlyReport = inngest.createFunction(
  {
    id: "generate-monthly-report",
    name: "Generate Monthly Report",
    triggers: [{ cron: "0 1 1 * *" }], // keep for testing
  },
  async () => {

    const users = await db.user.findMany({
      include: { accounts: true },
    });

    console.log("Users fetched:", users);

    for (const user of users) {
      console.log("Processing user:", user.email);

      try {

        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const stats = await getMonthlyStats(user.id, lastMonth);

        const monthName = lastMonth.toLocaleString("default", {
          month: "long",
        });

        const insights = await generateFinancialInsights(stats, monthName);

        console.log("Sending monthly report to:", user.email);

        await sendEmail({
          to: user.email,
          subject: `Your Monthly Financial Report - ${monthName}`,
          react: (
            <EmailTemplate
              userName={user.name || "User"}
              type="monthly-report"
              data={{
                stats,
                month: monthName,
                insights,
              }}
            />
          ),
        });

      } catch (err) {
        console.error("Monthly report failed:", err);
      }
    }

    return { processed: users.length };
  }
);


/* =========================
   AI INSIGHTS
========================= */

async function generateFinancialInsights(stats, month) {

  if (!process.env.GEMINI_API_KEY) {
    return [
      "Review your largest expense category this month.",
      "Setting a spending limit could help improve savings.",
      "Track recurring payments to find optimization opportunities."
    ];
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
Analyze this financial data and give 3 concise insights.

Month: ${month}

Income: ${stats.totalIncome}
Expenses: ${stats.totalExpenses}

Categories:
${Object.entries(stats.byCategory)
  .map(([c,a]) => `${c}: ${a}`)
  .join(", ")}

Return JSON array.
`;

  try {

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g,"").trim();

    return JSON.parse(cleaned);

  } catch (error) {

    console.error("AI insights error", error);

    return [
      "Review your largest expense category this month.",
      "Setting a spending limit could help improve savings.",
      "Track recurring payments to find optimization opportunities."
    ];
  }
}


/* =========================
   MONTHLY STATS
========================= */

const getMonthlyStats = async (userId, month) => {

  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return transactions.reduce(
    (stats, t) => {

      const amount = Number(t.amount);

      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
        stats.byCategory[t.category] =
          (stats.byCategory[t.category] || 0) + amount;
      } else {
        stats.totalIncome += amount;
      }

      return stats;

    },
    {
      totalIncome: 0,
      totalExpenses: 0,
      byCategory: {},
      transactionCount: transactions.length,
    }
  );
};