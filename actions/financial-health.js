"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { calculateFinancialHealth } from "@/lib/ai/financial-health";

export async function getFinancialHealthScore() {

  const { userId } = await auth();
  if (!userId) return 0;

  const user = await db.user.findUnique({
    where: { clerkUserId: userId }
  });

  if (!user) return 0;

  const transactions = await db.transaction.findMany({
    where: { userId: user.id }
  });

  const debts = await db.debt.findMany({
    where: { userId: user.id }
  });

  const budget = await db.budget.findUnique({
    where: { userId: user.id }
  });

  let income = 0;
  let expenses = 0;

  for (const t of transactions) {
    const amount = Number(t.amount);

    if (t.type === "INCOME") income += amount;
    else expenses += amount;
  }

  let totalDebt = 0;

  for (const d of debts) {
    totalDebt += Number(d.balance);
  }

  return calculateFinancialHealth({
    income,
    expenses,
    debt: totalDebt,
    budget: Number(budget?.amount || 0),
  });
}