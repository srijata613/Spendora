"use client";

import { useState } from "react";
import { inviteMember } from "@/actions/account-members";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "sonner";

export default function InviteMemberDrawer({ accountId }) {

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const handleInvite = async () => {

    const res = await inviteMember(accountId, email);

    if (res.success) {
      toast.success("Member invited");
      setOpen(false);
      setEmail("");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>

      <DrawerTrigger asChild>
        <Button size="sm">Invite Member</Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Invite Member</DrawerTitle>
        </DrawerHeader>

        <div className="p-4 space-y-4">

          <Input
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button onClick={handleInvite} className="w-full">
            Send Invite
          </Button>

        </div>

      </DrawerContent>
    </Drawer>
  );
}