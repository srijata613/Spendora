import { billReminder } from "./bill-reminder";
import { checkBudgetAlerts } from "./check-budget-alerts";
import { generateMonthlyReport } from "./generate-monthly-report";
import { processRecurringTransaction } from "./process-recurring-transaction";
import { triggerRecurringTransactions } from "./trigger-recurring-transactions";

export const functions = [
  billReminder,
  checkBudgetAlerts,
  generateMonthlyReport,
  processRecurringTransaction,
  triggerRecurringTransactions,
];