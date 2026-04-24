"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getCategorySpending() {

  const { userId } = await auth();

  const user = await db.user.findUnique({
    where: { clerkUserId: userId }
  });

  if (!user) return [];

  const startOfMonth = new Date();
  startOfMonth.setDate(1);

  const previousMonth = new Date(startOfMonth);
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  const spending = await db.transaction.groupBy({
    by: ["category"],
    where: {
      userId: user.id,
      type: "EXPENSE",
      date: { gte: startOfMonth }
    },
    _sum: {
      amount: true
    }
  });

  const previousSpending = await db.transaction.groupBy({
    by: ["category"],
    where: {
      userId: user.id,
      type: "EXPENSE",
      date: {
        gte: previousMonth,
        lt: startOfMonth
      }
    },
    _sum: {
      amount: true
    }
  });

  return {
    current: spending.map(s => ({
      category: s.category,
      amount: Number(s._sum.amount)
    })),
    previous: previousSpending.map(s => ({
      category: s.category,
      amount: Number(s._sum.amount)
    }))
  };
}