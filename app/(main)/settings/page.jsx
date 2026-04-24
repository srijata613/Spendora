"use client";

import { UserProfile } from "@clerk/nextjs";
import DeleteAccountButton from "@/components/delete-account-button";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">

      <UserProfile routing="hash" />

      <div className="border rounded-lg p-6 space-y-4">

        <h2 className="text-lg font-semibold text-red-600">
          Danger Zone
        </h2>

        <p className="text-sm text-muted-foreground">
          Permanently delete your Spendora account and all associated data.
        </p>

        <DeleteAccountButton />

      </div>

    </div>
  );
}