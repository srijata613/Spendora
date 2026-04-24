"use client";

import { useState } from "react";
import { createBill } from "@/actions/bills";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateBillDrawer({ children }) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    await createBill({
      name,
      amount,
      dueDate,
    });

    setOpen(false);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Bill Reminder</DrawerTitle>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <Input
            placeholder="Bill name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />

          <Button type="submit" className="w-full">
            Save Bill
          </Button>

        </form>
      </DrawerContent>
    </Drawer>
  );
}