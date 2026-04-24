import { getUpcomingBills } from "@/actions/bills";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function UpcomingBills({ bills }) {

  if (!bills?.length) return null;

  return (
    <div className="bg-white border rounded-xl p-6">

      <h2 className="text-lg font-semibold mb-4">
        Upcoming Bills
      </h2>

      <div className="space-y-3">

        {bills.map((bill) => (
          <div
            key={bill.id}
            className="flex justify-between text-sm"
          >
            <div>
              <p className="font-medium">{bill.name}</p>
              <p className="text-muted-foreground text-xs">
                {new Date(bill.dueDate).toLocaleDateString()}
              </p>
            </div>

            <span className="font-medium">
              ${bill.amount}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}