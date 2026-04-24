"use client";

import { useState } from "react";
import { createDebt } from "@/actions/debt";
import { useRouter } from "next/navigation";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateDebtDrawer({ children }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [minimumPayment, setMinimumPayment] = useState("");

  const handleCreate = async () => {
    if (!name || !balance) return;

    await createDebt({
      name,
      balance,
      interestRate,
      minimumPayment,
    });

    router.refresh();

    setName("");
    setBalance("");
    setInterestRate("");
    setMinimumPayment("");
  };

  return (
    <Drawer>
      {children}

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Debt</DrawerTitle>
        </DrawerHeader>

        <div className="p-4 space-y-3">

          <Input
            placeholder="Debt name (Credit Card, Loan...)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Balance"
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />

          <Input
            placeholder="Interest Rate (%)"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />

          <Input
            placeholder="Minimum Payment"
            type="number"
            value={minimumPayment}
            onChange={(e) => setMinimumPayment(e.target.value)}
          />

        </div>

        <DrawerFooter>
          <Button onClick={handleCreate}>Create Debt</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}