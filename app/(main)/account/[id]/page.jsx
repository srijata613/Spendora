import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";
import InviteMemberDrawer from "@/components/invite-member-drawer";

export default async function AccountPage({ params }) {
  const { id } = await params;

  const accountData = await getAccountWithTransactions(id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-8 px-5">

      {/* Header */}
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
            {account.name}
          </h1>

          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            {account.currency || "USD"} {parseFloat(account.balance).toFixed(2)}
          </div>

          <p className="text-sm text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>

      {/* Members Section (safe addition) */}
      {account.members?.length > 0 && (
        <div className="border rounded-xl p-4 space-y-3">
          
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Members</h3>
            <InviteMemberDrawer accountId={account.id} />
            </div>
            
            {account.members.map((m) => (
              <div key={m.id} className="flex justify-between text-sm">
                <span>{m.user.email}</span>
                <span className="text-muted-foreground">{m.role}</span>
                </div>
              ))}
              

        </div>
      )}

      { /* Account Members */}
      {account.members?.length > 1 && (
        <div className="border rounded-xl p-4">
          <h3 className="font-semibold mb-2">Members</h3>

          {account.members.map((m) => (
            <div key={m.id} className="flex justify-between text-sm">
              <span>{m.user.email}</span>
              <span className="text-muted-foreground">{m.role}</span>
              </div>
          ))}
          </div>
      )}

      {/* Chart Section */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <AccountChart transactions={transactions} />
      </Suspense>

      {/* Transactions Table */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <TransactionTable transactions={transactions} />
      </Suspense>

    </div>
  );
}