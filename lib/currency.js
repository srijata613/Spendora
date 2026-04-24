const rates = {
  USD: 1,
  INR: 94.07,
  EUR: 0.92,
  GBP: 0.79,
};

export function convertToUSD(amount, currency) {
  const rate = rates[currency] || 1;
  return amount / rate;
}