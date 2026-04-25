export function calculateFinancialHealth({
  income = 0,
  expenses = 0,
  debt = 0,
  budget = 0,
}) {

  let score = 100;

  // Budget discipline
  if (budget > 0 && expenses > budget) {
    score -= 20;
  }

  // Savings rate
  const savings = income - expenses;

  if (income > 0) {
    const savingsRate = savings / income;

    if (savingsRate < 0) score -= 30;
    else if (savingsRate < 0.2) score -= 10;
  }

  // Debt ratio
  if (income > 0) {
    const debtRatio = debt / income;

    if (debtRatio > 1) score -= 30;
    else if (debtRatio > 0.5) score -= 15;
  }

  return Math.max(score, 0);
}