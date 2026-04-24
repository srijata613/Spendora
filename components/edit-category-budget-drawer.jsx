"use client";

import { useState } from "react";
import { updateCategoryBudget } from "@/actions/category-budget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditCategoryBudgetDrawer({ budget, children }) {
  const [amount, setAmount] = useState(budget.amount);

  const handleSave = async () => {
    await updateCategoryBudget(budget.id, Number(amount));
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">

      {children}

      <div className="flex gap-2">
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-24"
        />

        <Button size="sm" onClick={handleSave}>
          Save
        </Button>
      </div>

    </div>
  );
}