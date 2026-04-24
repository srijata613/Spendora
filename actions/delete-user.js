"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function deleteUserAccount() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // find user in database
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // delete all related data
  await db.transaction.deleteMany({
    where: { userId: user.id },
  });

  await db.account.deleteMany({
    where: { userId: user.id },
  });

  await db.categoryBudget.deleteMany({
    where: { userId: user.id },
  });

  await db.budget.deleteMany({
    where: { userId: user.id },
  });

  await db.user.delete({
    where: { id: user.id },
  });

  // delete user from Clerk
  const clerk = await clerkClient();
  await clerk.users.deleteUser(userId);

  return { success: true };
}