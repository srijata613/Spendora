"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/* ---------------- Helpers ---------------- */

const serializeDecimal = (obj) => {
  const serialized = { ...obj };

  if (obj?.balance && typeof obj.balance.toNumber === "function") {
    serialized.balance = obj.balance.toNumber();
  }

  if (obj?.amount && typeof obj.amount.toNumber === "function") {
    serialized.amount = obj.amount.toNumber();
  }

  return serialized;
};

/* -------- Normalize recurring to monthly -------- */

function normalizeToMonthly(amount, interval) {
  switch (interval) {
    case "DAILY":
      return amount * 30;
    case "WEEKLY":
      return amount * 4;
    case "MONTHLY":
      return amount;
    case "YEARLY":
      return amount / 12;
    default:
      return amount;
  }
}

/* ---------------- Ensure user exists ---------------- */

async function getOrCreateUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Clerk user not found");
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

/* ---------------- Get User Accounts ---------------- */

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

    return accounts.map(serializeDecimal);
  } catch (error) {
    console.error("Account fetch error:", error);
    return [];
  }
}

/* ---------------- Create Account ---------------- */

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
        name: data.name,
        type: data.type || "CURRENT",
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: serializeDecimal(account),
    };
  } catch (error) {
    console.error("Create account error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
}

/* ---------------- Dashboard Data ---------------- */

export async function getDashboardData() {
  try {
    const user = await getOrCreateUser();

    /* ---- Transactions ---- */

    const transactionsRaw = await db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    const transactions = transactionsRaw.map(serializeDecimal);

    /* ---- Recurring Subscriptions ---- */

    const recurring = transactionsRaw.filter((t) => t.isRecurring);

    const subscriptions = recurring.map((sub) => {
      const amount = Number(sub.amount);

      const monthlyCost = normalizeToMonthly(
        amount,
        sub.recurringInterval
      );

      return {
        id: sub.id,
        name: sub.description || "Subscription",
        monthlyCost,
      };
    });

    const totalMonthlySubscriptions = subscriptions.reduce(
      (sum, sub) => sum + sub.monthlyCost,
      0
    );

    return {
      transactions,
      subscriptions,
      totalMonthlySubscriptions,
    };
  } catch (error) {
    console.error("Dashboard fetch error:", error);

    return {
      transactions: [],
      subscriptions: [],
      totalMonthlySubscriptions: 0,
    };
  }
}