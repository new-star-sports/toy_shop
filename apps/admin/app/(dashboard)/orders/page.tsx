import Link from "next/link";
import { getAdminOrders } from "@nss/db/queries";
import { createServerClient } from "@nss/db/client";
import { cookies } from "next/headers";
import { Button } from "@nss/ui/components/button";
import { Input } from "@nss/ui/components/input";
import { Badge } from "@nss/ui/components/badge";
import { format } from "date-fns";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const status = params.status as any;
  const page = parseInt(params.page || "1");

  const supabase = createServerClient(await cookies());
  const { data: orders, count } = await getAdminOrders(supabase as any, {
    search: query,
    orderStatus: status === "all" ? undefined : status,
    page,
    perPage: 20,
  });

  const statuses = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nss-text-primary">Orders</h1>
          <p className="text-sm text-nss-text-secondary">
            Manage customer orders and fulfillment ({count} total)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-nss-card p-4 rounded-xl border border-nss-border">
        <div className="flex-1">
          <Input
            placeholder="Search by order #, name, email..."
            defaultValue={query}
            className="max-w-md"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {statuses.map((s) => (
            <Button
              key={s}
              variant={status === s || (!status && s === "all") ? "default" : "outline"}
              size="sm"
              className="capitalize whitespace-nowrap"
              asChild
            >
               <Link href={`/orders?status=${s}${query ? `&q=${query}` : ""}`}>
                  {s}
               </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-nss-card rounded-xl border border-nss-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-nss-surface text-nss-text-secondary border-b border-nss-border">
              <tr>
                <th className="px-6 py-3 font-semibold text-start">Order</th>
                <th className="px-6 py-3 font-semibold text-start">Date</th>
                <th className="px-6 py-3 font-semibold text-start">Customer</th>
                <th className="px-6 py-3 font-semibold text-start">Total</th>
                <th className="px-6 py-3 font-semibold text-start">Payment</th>
                <th className="px-6 py-3 font-semibold text-start">Status</th>
                <th className="px-6 py-3 font-semibold text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nss-border">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-nss-text-secondary">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-nss-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-nss-primary">
                        #{order.order_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-nss-text-secondary">
                      {format(new Date(order.created_at), "MMM d, HH:mm")}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-nss-text-primary">{order.customer_name}</p>
                      <p className="text-xs text-nss-text-secondary">{order.customer_email}</p>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium">
                      {order.total_kwd.toFixed(3)} KD
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant={order.payment_status === "confirmed" ? "default" : "secondary"} className="text-[10px]">
                          {order.payment_status}
                       </Badge>
                       <p className="text-[10px] text-nss-text-secondary mt-1">{order.payment_method}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "default"
                            : order.status === "cancelled" || order.status === "refunded"
                            ? "destructive"
                            : "outline"
                        }
                        className="capitalize"
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/orders/${order.id}`}>View Details</Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
