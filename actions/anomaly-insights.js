"use server";

import { getDashboardData } from "@/actions/dashboard";
import { detectSpendingAnomalies } from "@/lib/ai/anomaly-detector";

export async function getAnomalyInsights() {

  const dashboardData = await getDashboardData();

  const transactions = dashboardData?.transactions || [];

  return detectSpendingAnomalies(transactions);
}