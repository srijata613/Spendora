const RULES = {
  food: [
    "restaurant",
    "cafe",
    "coffee",
    "pizza",
    "burger",
    "swiggy",
    "zomato",
    "starbucks"
  ],

  shopping: [
    "amazon",
    "flipkart",
    "mall",
    "shopping",
    "myntra"
  ],

  transport: [
    "uber",
    "ola",
    "metro",
    "taxi",
    "bus",
    "train"
  ],

  subscription: [
    "netflix",
    "spotify",
    "prime",
    "youtube"
  ],

  salary: [
    "salary",
    "payroll",
    "company"
  ]
};

export function categorizeTransaction(description = "") {

  const text = description.toLowerCase();

  for (const category in RULES) {

    const keywords = RULES[category];

    for (const word of keywords) {

      if (text.includes(word)) {
        return category;
      }

    }

  }

  return null;
}