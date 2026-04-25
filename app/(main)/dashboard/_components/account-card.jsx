"use client";

import { ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { updateDefaultAccount } from "@/actions/account";
import { deleteAccount } from "@/actions/delete-account";
import { toast } from "sonner";

export function AccountCard({ account, currentUserId }) {
  const { name, type, balance, currency, id, isDefault, userId, members } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const {
    loading: deleteLoading,
    fn: deleteAccountFn,
    data: deletedAccount,
    error: deleteError,
  } = useFetch(deleteAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isDefault) {
      toast.warning("You need at least 1 default account");
      return;
    }

    await updateDefaultFn(id);
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const confirmDelete = confirm(
      "Delete this account and all associated transactions?"
    );

    if (!confirmDelete) return;

    await deleteAccountFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  useEffect(() => {
    if (deletedAccount?.success) {
      toast.success("Account deleted successfully");
    }
  }, [deletedAccount]);

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError.message || "Failed to delete account");
    }
  }, [deleteError]);

  return (
    <Card className="hover:shadow-md transition-shadow group relative">

      {/* Delete button */}
      <Trash2
        onClick={handleDelete}
        className="absolute top-3 right-3 h-4 w-4 cursor-pointer text-red-500 opacity-0 group-hover:opacity-100 transition"
      />

      <Link href={`/account/${id}`} className="block">

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pr-8">

          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium capitalize">
              {name}
            </CardTitle>

            {/* Shared badge */}
            {userId !== currentUserId && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                Shared
              </span>
            )}
          </div>

          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading}
          />

        </CardHeader>

        <CardContent>

          <div className="text-2xl font-bold">
            {currency || "USD"} {parseFloat(balance).toFixed(2)}
          </div>

          <p className="text-xs text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>

          {/* Member avatars */}
          {members?.length > 1 && (
            <div className="flex mt-3 -space-x-2">
              {members.slice(0, 4).map((m) => (
                <img
                  key={m.id}
                  src={m.user.imageUrl || "/avatar.png"}
                  className="w-6 h-6 rounded-full border"
                  title={m.user.email}
                />
              ))}
            </div>
          )}

        </CardContent>

        <CardFooter className="flex justify-between text-sm text-muted-foreground">

          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>

          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>

        </CardFooter>

      </Link>

    </Card>
  );
}