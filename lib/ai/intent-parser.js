import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function parseFinanceIntent(question) {

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
You are an intent parser for a finance app.

Return ONLY valid JSON.
Do NOT wrap the JSON in markdown.
Do NOT include explanations.

Allowed intents:
category_spending
total_spending
total_income
subscription_count
debt_total

Examples:

Question: "How much did I spend on food?"
{
 "intent":"category_spending",
 "category":"Food"
}

Question: "What is my total spending?"
{
 "intent":"total_spending"
}

Now parse this question:

"${question}"
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text();

  console.log("Gemini RAW RESPONSE:", text);

  // Remove markdown formatting if Gemini adds it
  text = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Extract JSON safely
  const jsonMatch = text.match(/\{[\s\S]*?\}/);

  if (!jsonMatch) {
    return { intent: "unknown" };
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Intent parse error:", error);
    return { intent: "unknown" };
  }
}