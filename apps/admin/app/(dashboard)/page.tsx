import { Button } from "@nss/ui/components/button";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Revenue Today", value: "0.000 KD", change: "+0%", icon: "💰" },
          { label: "Orders Today", value: "0", change: "+0", icon: "🛒" },
          { label: "Low Stock Items", value: "0", change: "", icon: "⚠️" },
          { label: "New Customers", value: "0", change: "+0", icon: "👤" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl bg-nss-card border border-nss-border p-5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-nss-text-secondary">{kpi.label}</span>
              <span className="text-xl">{kpi.icon}</span>
            </div>
            <p className="text-2xl font-semibold text-nss-text-primary font-mono">
              {kpi.value}
            </p>
            {kpi.change && (
              <p className="text-xs text-nss-success">{kpi.change}</p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl bg-nss-card border border-nss-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-nss-border">
          <h3 className="font-semibold text-nss-text-primary">Recent Orders</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="p-8 text-center text-nss-text-secondary">
          <p className="text-sm">No orders yet. Orders will appear here in real time.</p>
        </div>
      </div>

      {/* Status */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-nss-success/10 px-4 py-2 text-sm text-nss-success">
          <span className="w-2 h-2 rounded-full bg-nss-success animate-pulse" />
          Admin Dashboard — Phase 0 Complete
        </div>
      </div>
    </div>
  );
}
