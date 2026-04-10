"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = initialBudget
    ? Math.min((currentExpenses / initialBudget.amount) * 100, 100)
    : 0;

  // progress color logic
  const progressColor =
    percentUsed > 85
      ? "[&>div]:bg-red-500"
      : percentUsed > 60
      ? "[&>div]:bg-yellow-500"
      : "[&>div]:bg-green-500";

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <CardTitle className="text-lg font-semibold">
          Monthly Budget (Default Account)
        </CardTitle>

        {!isEditing && initialBudget && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-7 w-7"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="w-40"
              placeholder="Enter amount"
              autoFocus
              disabled={isLoading}
            />

            <Button
              variant="outline"
              size="icon"
              onClick={handleUpdateBudget}
              disabled={isLoading}
            >
              <Check className="h-4 w-4 text-green-500" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {initialBudget
              ? `$${currentExpenses.toFixed(2)} of $${initialBudget.amount.toFixed(
                  2
                )} spent`
              : "No budget set"}
          </p>
        )}

        {initialBudget && (
          <>
            <Progress
              value={percentUsed}
              className={`h-3 ${progressColor}`}
            />

            <div className="flex justify-end text-xs text-muted-foreground">
              {percentUsed.toFixed(1)}% used
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
