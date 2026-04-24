export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";

import { getCategoryBudgets } from "@/actions/category-budget";
import { getCategorySpending } from "@/actions/category-spending";

import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { DashboardOverview } from "./_components/transaction-overview";
import { SubscriptionCard } from "./_components/subscription-card";
import CategoryBudgetCard from "./_components/category-budget-card";
import CreateCategoryBudgetDrawer from "@/components/create-category-budget-drawer";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function DashboardPage() {

  const [accounts, dashboardData, categoryBudgets, categorySpending] =
    await Promise.all([
      getUserAccounts(),
      getDashboardData(),
      getCategoryBudgets(),
      getCategorySpending(),
    ]);

  const { transactions, subscriptions, totalMonthlySubscriptions } =
    dashboardData || {};

  const defaultAccount = accounts?.find((account) => account.isDefault);

  // Get budget for default account
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  return (
    <div className="space-y-8">

      {/* Budget Progress */}
      <BudgetProgress
        initialBudget={budgetData?.budget}
        currentExpenses={budgetData?.currentExpenses || 0}
      />

      {/* Category Budgets */}
      <div className="space-y-4">

        {/* Add Category Budget Button */}
        <CreateCategoryBudgetDrawer>
          <Button variant="outline" size="sm">
            + Add Category Budget
          </Button>
        </CreateCategoryBudgetDrawer>

        {categoryBudgets?.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {categoryBudgets.map((budget) => {

              const currentSpent =
              categorySpending.current.find(
                (s) =>
                  s.category?.toLowerCase() ===
                budget.category?.toLowerCase()
              )?.amount || 0;
              
              const previousSpent =
              categorySpending.previous.find(
                (s) =>
                  s.category?.toLowerCase() ===
                budget.category?.toLowerCase()
              )?.amount || 0;
              
              const rollover =
              budget.rollover
              ? Math.max(Number(budget.amount) - previousSpent, 0)
              : 0;
              
              const spent = currentSpent;
              const limit = Number(budget.amount) + rollover;

              return (
                <CategoryBudgetCard
                  key={budget.id}
                  budget={budget}
                  spent={spent}
                  limit={limit}
                  rollover={rollover}
                />
              );
            })}

          </div>
        )}

      </div>

      {/* Subscriptions Tracker */}
      <SubscriptionCard
        subscriptions={subscriptions || []}
        total={totalMonthlySubscriptions || 0}
      />

      {/* Dashboard Overview */}
      <DashboardOverview
        accounts={accounts}
        transactions={transactions || []}
      />

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {accounts.length > 0 &&
          accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}

      </div>

    </div>
  );
}