"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { parseFinanceIntent } from "@/lib/ai/intent-parser";

export async function askFinanceAI(question) {

  const { userId } = await auth();
  if (!userId) return "Unauthorized";

  const user = await db.user.findUnique({
    where: { clerkUserId: userId }
  });

  if (!user) return "User not found";

  const intent = await parseFinanceIntent(question);

  switch (intent.intent) {

    case "category_spending": {

      const tx = await db.transaction.findMany({
        where: {
          userId: user.id,
          type: "EXPENSE",
          category:{
            equals: intent.category,
            mode: "insensitive"
          }
        }
      });

      const total = tx.reduce(
        (sum, t) => sum + Number(t.amount),
        0
      );

      return `You spent $${total} on ${intent.category}`;
    }

    case "total_spending": {

      const tx = await db.transaction.findMany({
        where: {
          userId: user.id,
          type: "EXPENSE"
        }
      });

      const total = tx.reduce(
        (sum, t) => sum + Number(t.amount),
        0
      );

      return `Your total spending is $${total}`;
    }

    case "subscription_count": {

      const subs = await db.transaction.findMany({
        where: {
          userId: user.id,
          isRecurring: true
        }
      });

      return `You have ${subs.length} active subscriptions`;
    }

    case "debt_total": {

      const debts = await db.debt.findMany({
        where: { userId: user.id }
      });

      const total = debts.reduce(
        (sum, d) => sum + Number(d.balance),
        0
      );

      return `Your total debt is $${total}`;
    }

    default:
      return "I couldn't understand that yet.";
  }
}