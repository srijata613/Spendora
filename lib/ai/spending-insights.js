export function generateSpendingInsights({
  currentMonthExpenses,
  previousMonthExpenses,
  categorySpending,
  categoryBudgets,
}) {

  const insights = [];

  // Monthly spending comparison
  if (previousMonthExpenses > 0) {
    const change =
      ((currentMonthExpenses - previousMonthExpenses) /
        previousMonthExpenses) *
      100;

    if (change > 20) {
      insights.push(
        `Your spending increased by ${change.toFixed(
          0
        )}% compared to last month`
      );
    } else if (change < -20) {
      insights.push(
        `Great job! Spending decreased by ${Math.abs(change).toFixed(
          0
        )}% compared to last month`
      );
    }
  }

  // Category budget warnings
  for (const budget of categoryBudgets) {
    const spent =
      categorySpending.find(
        (c) =>
          c.category?.toLowerCase() ===
          budget.category?.toLowerCase()
      )?.amount || 0;

    const limit = Number(budget.amount);

    if (spent > limit * 0.8) {
      insights.push(
        `${budget.category} spending is close to its budget`
      );
    }
  }

  return insights;
}