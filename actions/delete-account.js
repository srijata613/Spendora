"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteAccount(accountId) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const account = await db.account.findUnique({
    where: { id: accountId },
  });

  if (!account) {
    throw new Error("Account not found");
  }

  await db.account.delete({
    where: { id: accountId },
  });

  revalidatePath("/dashboard");

  return { success: true };
}