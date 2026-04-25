"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AnomalyCard({ anomalies }) {

  const items =
    anomalies?.length > 0
      ? anomalies
      : ["No unusual spending detected"];

  return (
    <Card>

      <CardHeader>
        <CardTitle>Spending Alerts</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">

        {items.map((a, i) => (
          <p key={i} className="text-sm text-muted-foreground">
            ⚠ {a}
          </p>
        ))}

      </CardContent>

    </Card>
  );
}