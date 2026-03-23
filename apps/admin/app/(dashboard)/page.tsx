import Link from "next/link";
import { Button } from "@nss/ui/components/button";
import { Badge } from "@nss/ui/components/badge";
import { getDashboardStats, getAdminOrders } from "@nss/db/queries";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const { data: recentOrders } = await getAdminOrders({ page: 1, perPage: 5 });

  const kpis = [
    { label: "Revenue Today", value: `${stats.revenueToday.toFixed(3)} KD`, change: "+0%", icon: "💰" },
    { label: "Orders Today", value: stats.orderCountToday.toString(), change: "+0", icon: "🛒" },
    { label: "Low Stock Items", value: stats.lowStockCount.toString(), change: stats.lowStockCount > 0 ? "Action Required" : "", icon: "⚠️", color: stats.lowStockCount > 0 ? "text-nss-danger" : "" },
    { label: "New Customers", value: stats.customerCount.toString(), change: `+${stats.customerCount}`, icon: "👤" },
  ];

  return (
    <div className="space-y-6 text-start">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl bg-nss-card border border-nss-border p-5 space-y-2 hover:border-nss-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-nss-text-secondary">{kpi.label}</span>
              <span className="text-xl">{kpi.icon}</span>
            </div>
            <p className={`text-2xl font-bold font-mono ${kpi.color || "text-nss-text-primary"}`}>
              {kpi.value}
            </p>
            {kpi.change && (
              <p className={`text-[10px] font-bold ${kpi.color?.includes('danger') ? 'text-nss-danger' : 'text-nss-success'}`}>
                {kpi.change}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl bg-nss-card border border-nss-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-nss-border bg-nss-surface/30">
          <h3 className="font-bold text-nss-text-primary uppercase tracking-wide text-sm">Recent Orders</h3>
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders">View All</Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <tbody className="divide-y divide-nss-border">
              {recentOrders.length === 0 ? (
                <tr>
                  <td className="px-6 py-10 text-center text-nss-text-secondary italic">
                    No orders today.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-nss-surface/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-nss-primary">
                      #{order.order_number}
                    </td>
                    <td className="px-6 py-4 text-nss-text-primary">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="capitalize text-[10px]">
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold">
                      {Number(order.total_kwd).toFixed(3)} KD
                    </td>
                    <td className="px-6 py-4 text-end">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/orders/${order.id}`}>Details</Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
