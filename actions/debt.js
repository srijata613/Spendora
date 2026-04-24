"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getUserDebts() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) return [];

    const debts = await db.debt.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return debts.map((d) => ({
      ...d,
      balance: Number(d.balance),
      minimumPayment: Number(d.minimumPayment),
    }));
  } catch (error) {
    console.error("Debt fetch error:", error);
    return [];
  }
}

export async function createDebt(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const debt = await db.debt.create({
      data: {
        name: data.name,
        balance: parseFloat(data.balance),
        interestRate: parseFloat(data.interestRate),
        minimumPayment: parseFloat(data.minimumPayment),
        userId: user.id,
      },
    });

    return {
      success: true,
      data: {
        ...debt,
        balance: Number(debt.balance),
        minimumPayment: Number(debt.minimumPayment),
      },
    };
  } catch (error) {
    console.error("Create debt error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
}

export async function deleteDebt(id) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    await db.debt.delete({
      where: {
        id,
        userId: user.id,
      },
    });

    return { success: true };

  } catch (error) {
    console.error("Debt delete error:", error);
    return { success: false, message: error.message };
  }
}