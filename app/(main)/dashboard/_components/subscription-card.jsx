export function SubscriptionCard({ subscriptions, total }) {
  if (!subscriptions.length) return null;

  return (
    <div className="bg-white border rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">
        Active Subscriptions ({subscriptions.length})
        </h2>

      <div className="space-y-3">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="flex justify-between text-sm">
            <span>{sub.name}</span>
            <span className="text-muted-foreground">
              ${sub.monthlyCost.toFixed(2)} / month
            </span>
          </div>
        ))}
      </div>

      <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
        <span>Total Monthly</span>
        <span className="text-red-500 font-semibold">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}