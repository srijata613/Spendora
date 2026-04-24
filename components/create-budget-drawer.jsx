"use client";

import { useState } from "react";
import { updateBudget } from "@/actions/budget";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateBudgetDrawer({ children, accountId }) {
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    await updateBudget({
      amount,
      accountId,
    });

    setOpen(false);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Set Monthly Budget</DrawerTitle>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <Input
            type="number"
            placeholder="Budget amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <Button type="submit" className="w-full">
            Save Budget
          </Button>

        </form>
      </DrawerContent>
    </Drawer>
  );
}