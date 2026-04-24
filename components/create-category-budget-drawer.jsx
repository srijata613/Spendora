"use client";

import { useState } from "react";
import { createCategoryBudget } from "@/actions/category-budget";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateCategoryBudgetDrawer({ children }) {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const handleCreate = async () => {
    if (!category || !amount) return;

    await createCategoryBudget({
      category,
      amount: Number(amount),
    });

    window.location.reload();
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create Category Budget</DrawerTitle>
        </DrawerHeader>

        <div className="p-4 space-y-4">

          <Input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Budget Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

        </div>

        <DrawerFooter>
          <Button onClick={handleCreate}>
            Create Budget
          </Button>
        </DrawerFooter>

      </DrawerContent>
    </Drawer>
  );
}