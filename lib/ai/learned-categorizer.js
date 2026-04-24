import { db } from "@/lib/prisma";

export async function getLearnedCategory(userId, description = "") {
  if (!description) return null;

  const text = description.toLowerCase();

  // find similar past transactions from same user
  const pastTransactions = await db.transaction.findMany({
    where: {
      userId,
      description: {
        contains: text.split(" ")[0], // simple similarity
        mode: "insensitive",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  if (!pastTransactions.length) return null;

  // return the most common category
  const counts = {};

  for (const t of pastTransactions) {
    if (!t.category) continue;

    counts[t.category] = (counts[t.category] || 0) + 1;
  }

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return sorted.length ? sorted[0][0] : null;
}