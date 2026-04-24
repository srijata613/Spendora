"use client";

import CreateBudgetDrawer from "@/components/create-budget-drawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil } from "lucide-react";

export function BudgetProgress({ initialBudget, currentExpenses }) {

  const budget = Number(initialBudget || 0);
  const spent = Number(currentExpenses || 0);

  const percentage =
    budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  return (
    <Card>

      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Monthly Budget (Default Account)
        </CardTitle>

        {budget > 0 && (
          <CreateBudgetDrawer>
            <Pencil className="h-4 w-4 cursor-pointer" />
          </CreateBudgetDrawer>
        )}
      </CardHeader>

      <CardContent>

        {budget === 0 ? (
          <CreateBudgetDrawer>
            <p className="text-sm text-muted-foreground cursor-pointer">
              Set monthly budget
            </p>
          </CreateBudgetDrawer>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              ${spent.toFixed(2)} of ${budget.toFixed(2)} spent
            </p>

            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </>
        )}

      </CardContent>
    </Card>
  );
}