"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getCategoryBudgets() {
  const { userId } = await auth();

  const user = await db.user.findUnique({
    where: { clerkUserId: userId }
  });

  if (!user) return [];

  const budgets = await db.categoryBudget.findMany({
    where: { userId: user.id }
  });

  return budgets.map(b => ({
    ...b,
    amount: Number(b.amount)
  }));
}
export async function updateCategoryBudget(id, amount) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return db.categoryBudget.update({
    where: { id },
    data: { amount },
  });
}

export async function createCategoryBudget({ category, amount }) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return db.categoryBudget.create({
    data: {
      category,
      amount,
      userId: user.id,
    },
  });
}