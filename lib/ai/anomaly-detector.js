export function detectSpendingAnomalies(transactions = []) {

  const categoryTotals = {};
  const categoryCounts = {};

  for (const t of transactions) {
    if (t.type !== "EXPENSE") continue;

    const cat = t.category;

    if (!categoryTotals[cat]) {
      categoryTotals[cat] = 0;
      categoryCounts[cat] = 0;
    }

    categoryTotals[cat] += Number(t.amount);
    categoryCounts[cat] += 1;
  }

  const averages = {};

  for (const cat in categoryTotals) {
    averages[cat] = categoryTotals[cat] / categoryCounts[cat];
  }

  const anomalies = [];

  for (const t of transactions) {

    if (t.type !== "EXPENSE") continue;

    const avg = averages[t.category];

    if (!avg) continue;

    if (Number(t.amount) > avg * 2.5) {
      anomalies.push(
        `Unusual ${t.category} expense: $${t.amount}`
      );
    }
  }

  return anomalies;
}