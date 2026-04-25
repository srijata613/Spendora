"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function inviteMember(accountId, email) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const invitedUser = await db.user.findUnique({
    where: { email },
  });

  if (!invitedUser) {
    throw new Error("User with this email does not exist");
  }

  const exists = await db.accountMember.findFirst({
    where: {
      accountId,
      userId: invitedUser.id,
    },
  });

  if (exists) {
    throw new Error("User already a member");
  }

  await db.accountMember.create({
    data: {
      accountId,
      userId: invitedUser.id,
      role: "MEMBER",
    },
  });

  revalidatePath(`/account/${accountId}`);

  return { success: true };
}