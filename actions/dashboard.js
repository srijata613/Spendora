"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/* ------------------ Helpers ------------------ */

const serializeTransaction = (obj) => {
  const serialized = { ...obj };

  if (obj?.balance && typeof obj.balance.toNumber === "function") {
    serialized.balance = obj.balance.toNumber();
  }

  if (obj?.amount && typeof obj.amount.toNumber === "function") {
    serialized.amount = obj.amount.toNumber();
  }

  return serialized;
};

/* ------------------ Ensure user exists ------------------ */

async function getOrCreateUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("User not found in Clerk");
  }

  const email =
    clerkUser.emailAddresses?.[0]?.emailAddress || "unknown@email.com";

  const user = await db.user.upsert({
    where: { clerkUserId: userId },
    update: {},
    create: {
      clerkUserId: userId,
      email: email,
      name: clerkUser.firstName || "",
      imageUrl: clerkUser.imageUrl || "",
    },
  });

  return user;
}

/* ------------------ Get User Accounts ------------------ */

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
    console.error("Account fetch error:", error);

    // return safe fallback instead of crashing page
    return [];
  }
}

/* ------------------ Create Account ------------------ */

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

    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

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
    console.error("Create account error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
}

/* ------------------ Dashboard Data ------------------ */

export async function getDashboardData() {
  try {
    const user = await getOrCreateUser();

    const transactions = await db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    return transactions.map(serializeTransaction);
  } catch (error) {
    console.error("Dashboard fetch error:", error);

    return [];
  }
}
