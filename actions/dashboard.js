"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

  // Helpers

const serializeTransaction = (obj) => {
  const serialized = { ...obj };

  if (obj.balance) serialized.balance = obj.balance.toNumber();
  if (obj.amount) serialized.amount = obj.amount.toNumber();

  return serialized;
};

/* Ensure user exists in DB */
async function getOrCreateUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const clerkUser = await currentUser();

  const user = await db.user.upsert({
    where: { clerkUserId: userId },
    update: {},
    create: {
      clerkUserId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: clerkUser.firstName || "",
      imageUrl: clerkUser.imageUrl,
    },
  });

  return user;
}

  // Get User Accounts


export async function getUserAccounts() {
  try {
    const user = await getOrCreateUser();

    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    return accounts.map(serializeTransaction);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch accounts");
  }
}

  // Create Account

export async function createAccount(data) {
  try {
    const user = await getOrCreateUser();

    const req = await request();

    const decision = await aj.protect(req, {
      userId: user.clerkUserId,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw new Error("Too many requests. Please try again later.");
      }
      throw new Error("Request blocked");
    }

    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) throw new Error("Invalid balance amount");

    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: serializeTransaction(account),
    };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

  //Dashboard Data


export async function getDashboardData() {
  try {
    const user = await getOrCreateUser();

    const transactions = await db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    return transactions.map(serializeTransaction);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch dashboard data");
  }
}