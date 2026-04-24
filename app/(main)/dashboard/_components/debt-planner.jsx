"use client";

import { deleteDebt } from "@/actions/debt";
import { useRouter } from "next/navigation";
import CreateDebtDrawer from "@/components/create-debt-drawer";
import { Button } from "@/components/ui/button";

export default function DebtPlanner({ debts }) {

  const router = useRouter();

  const totalDebt =
    debts?.reduce((sum, debt) => sum + debt.balance, 0) || 0;

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Delete this debt?");
    if (!confirmDelete) return;

    await deleteDebt(id);
    router.refresh();
  };

  return (
    <div className="bg-white border rounded-xl p-6">

      {/* Updated Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Debt Paydown Planner
        </h2>

        <CreateDebtDrawer>
          <Button variant="outline" size="sm">
            + Add Debt
          </Button>
        </CreateDebtDrawer>
      </div>

      {!debts?.length ? (
        <div className="text-sm text-muted-foreground">
          No debts added yet.
        </div>
      ) : (
        <>
          <div className="space-y-3">

            {debts.map((debt) => (
              <div
                key={debt.id}
                className="flex justify-between items-center text-sm"
              >
                <div>
                  <p className="font-medium">{debt.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {debt.interestRate}% interest
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-medium">
                    ${debt.balance.toFixed(2)}
                  </span>

                  <button
                    onClick={() => handleDelete(debt.id)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

          </div>

          <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
            <span>Total Debt</span>
            <span className="text-red-500">
              ${totalDebt.toFixed(2)}
            </span>
          </div>
        </>
      )}

    </div>
  );
}