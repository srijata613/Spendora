"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function getUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return user;
}

export async function createBill(data) {
  try {
    const user = await getUser();

    const bill = await db.bill.create({
      data: {
        name: data.name,
        amount: Number(data.amount),
        dueDate: new Date(data.dueDate),
        recurringInterval: data.recurringInterval || null,
        user: {
          connect: { id: user.id },
        },
      },
    });

    revalidatePath("/dashboard");

    return { success: true, data: bill };
  } catch (error) {
    console.error("Error creating bill:", error);
    return { success: false, error: error.message };
  }
}

export async function getUpcomingBills() {
  try {
    const user = await getUser();

    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const bills = await db.bill.findMany({
      where: {
        userId: user.id,
        dueDate: {
          gte: today,
          lte: next30Days,
        },
        isActive: true,
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    return bills.map((b) => ({
      ...b,
      amount: Number(b.amount),
    }));
  } catch (error) {
    console.error("Error fetching bills:", error);
    return [];
  }
}