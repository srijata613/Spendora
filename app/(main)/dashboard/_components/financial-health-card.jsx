"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FinancialHealthCard({ score }) {

  let color = "text-red-500";

  if (score >= 80) {
    color = "text-green-500";
  } else if (score >= 60) {
    color = "text-yellow-500";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Health</CardTitle>
      </CardHeader>

      <CardContent className="flex items-center justify-between">

        <div>
          <p className="text-sm text-muted-foreground">
            Overall financial score
          </p>
        </div>

        <div className={`text-3xl font-bold ${color}`}>
          {score}/100
        </div>

      </CardContent>
    </Card>
  );
}