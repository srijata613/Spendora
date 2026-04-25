"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SpendingInsightsCard({ insights }) {

  const items =
    insights && insights.length > 0
      ? insights
      : ["Your spending patterns look stable this month"];

  return (
    <Card>

      <CardHeader>
        <CardTitle>Insights</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">

        {items.map((insight, index) => (
          <p key={index} className="text-sm text-muted-foreground">
            • {insight}
          </p>
        ))}

      </CardContent>

    </Card>
  );
}