"use server";

import { getDashboardData } from "@/actions/dashboard";
import { getCategoryBudgets } from "@/actions/category-budget";
import { getCategorySpending } from "@/actions/category-spending";
import { generateSpendingInsights } from "@/lib/ai/spending-insights";

export async function getSpendingInsights() {

  const dashboardData = await getDashboardData();
  const categoryBudgets = await getCategoryBudgets();
  const categorySpending = await getCategorySpending();

  const transactions = dashboardData?.transactions || [];

  let currentMonthExpenses = 0;
  let previousMonthExpenses = 0;

  const now = new Date();
  const currentMonth = now.getMonth();
  const previousMonth = currentMonth - 1;

  for (const t of transactions) {
    if (t.type !== "EXPENSE") continue;

    const date = new Date(t.date);
    const month = date.getMonth();

    if (month === currentMonth) {
      currentMonthExpenses += Number(t.amount);
    }

    if (month === previousMonth) {
      previousMonthExpenses += Number(t.amount);
    }
  }

  return generateSpendingInsights({
    currentMonthExpenses,
    previousMonthExpenses,
    categorySpending: categorySpending.current || [],
    categoryBudgets: categoryBudgets || [],
  });
}