"use client";

import { useState } from "react";
import { deleteUserAccount } from "@/actions/delete-user";
import { Button } from "@/components/ui/button";

export default function DeleteAccountButton() {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure? This will permanently delete your account and all data."
    );

    if (!confirmDelete) return;

    setLoading(true);

    await deleteUserAccount();

    window.location.href = "/";
  };

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "Deleting..." : "Delete Account"}
    </Button>
  );
}