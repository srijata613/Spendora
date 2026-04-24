"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import EditCategoryBudgetDrawer from "@/components/edit-category-budget-drawer";

export default function CategoryBudgetCard({ budget, spent, limit, rollover }) {

  const percent = limit ? Math.min((spent / limit) * 100, 100) : 0;
// determine bar color
let barColor = "bg-green-500";

if (percent >= 90) barColor = "bg-red-500";
else if (percent >= 70) barColor = "bg-yellow-500";

  return (
    <Card>
      <CardContent className="pt-5 space-y-3">

        <div className="flex justify-between items-center">

          <span className="font-medium">{budget.category}</span>

          <EditCategoryBudgetDrawer budget={budget}>
            <Pencil className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-black" />
          </EditCategoryBudgetDrawer>

        </div>

        {/* spent / limit */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${spent}</span>
          <span>${limit}</span>
        </div>

        {/* rollover indicator */}
        {rollover > 0 && (
          <div className="text-xs text-green-600 font-medium">
            +${rollover} rollover
          </div>
        )}

        {/* progress bar */}
        <div className="w-full bg-gray-200 rounded h-2">
          <div
            className={`${barColor} h-2 rounded transition-all`}
            style={{ width: `${percent}%` }}
          />
        </div>

      </CardContent>
    </Card>
  );
}