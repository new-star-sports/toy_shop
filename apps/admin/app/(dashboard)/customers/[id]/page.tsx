import { getAdminCustomerById } from "@nss/db/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getAdminCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6 text-start" dir="ltr">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/customers">← Back</Link>
        </Button>
        <h1 className="text-2xl font-bold text-nss-text-primary">Customer Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Info */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-nss-primary/10 flex items-center justify-center text-nss-primary text-2xl font-bold">
                {customer.full_name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-nss-text-primary truncate" title={customer.full_name || "Guest User"}>
                  {customer.full_name || "Guest User"}
                </h2>
                <p className="text-xs text-nss-text-secondary font-mono truncate">
                  ID: {customer.id}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-nss-text-secondary uppercase font-bold tracking-wider">Email</label>
                <p className="text-sm text-nss-text-primary">{customer.email || "—"}</p>
              </div>
              <div>
                <label className="text-[10px] text-nss-text-secondary uppercase font-bold tracking-wider">Phone</label>
                <p className="text-sm text-nss-text-primary">{customer.phone || "—"}</p>
              </div>
              <div>
                <label className="text-[10px] text-nss-text-secondary uppercase font-bold tracking-wider">Joined</label>
                <p className="text-sm text-nss-text-primary">
                  {new Date(customer.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="pt-4 border-t border-nss-border grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-nss-text-secondary uppercase font-bold tracking-wider">Orders</label>
                  <p className="text-xl font-bold text-nss-text-primary">{customer.total_orders}</p>
                </div>
                <div>
                  <label className="text-[10px] text-nss-text-secondary uppercase font-bold tracking-wider">Spent</label>
                  <p className="text-xl font-bold text-nss-text-primary">{customer.total_spent_kwd.toFixed(3)} KD</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader className="px-6 py-4 border-b border-nss-border bg-nss-surface">
              <CardTitle className="text-sm font-bold uppercase tracking-wide">Address Book</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {customer.addresses?.length === 0 ? (
                <p className="text-sm text-nss-text-secondary italic">No addresses saved.</p>
              ) : (
                customer.addresses?.map((addr) => (
                  <div key={addr.id} className="p-3 rounded-lg border border-nss-border bg-nss-surface/50 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold flex items-center gap-2 uppercase text-[10px]">
                        {addr.address_type}
                        {addr.is_default && <Badge variant="default" className="text-[8px] h-4">Default</Badge>}
                      </span>
                    </div>
                    <p className="text-nss-text-primary font-medium">{addr.recipient_name}</p>
                    <p className="text-nss-text-secondary text-xs leading-relaxed">
                      {addr.block}, {addr.street}, {addr.building}
                      {addr.floor && `, Floor ${addr.floor}`}{addr.apartment && `, Apt ${addr.apartment}`}
                    </p>
                    <p className="text-nss-text-secondary text-[10px] mt-1 font-mono">{addr.recipient_phone}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden">
            <CardHeader className="px-6 py-4 border-b border-nss-border bg-nss-surface flex items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wide">Order History</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-start">
                <thead className="bg-nss-surface text-nss-text-secondary border-b border-nss-border font-mono text-[10px] uppercase">
                  <tr>
                    <th className="px-6 py-3 font-bold text-start tracking-wider">Order #</th>
                    <th className="px-6 py-3 font-bold text-start tracking-wider">Date</th>
                    <th className="px-6 py-3 font-bold text-start tracking-wider">Status</th>
                    <th className="px-6 py-3 font-bold text-start tracking-wider">Total</th>
                    <th className="px-6 py-3 font-bold text-end tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nss-border text-sm">
                  {customer.orders?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-nss-text-secondary italic">
                        No orders placed yet.
                      </td>
                    </tr>
                  ) : (
                    customer.orders?.map((order) => (
                      <tr key={order.id} className="hover:bg-nss-surface/50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-nss-primary">
                          #{order.order_number}
                        </td>
                        <td className="px-6 py-4 text-nss-text-secondary">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="capitalize text-[10px] font-bold">
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 font-mono font-semibold">
                          {Number(order.total_kwd).toFixed(3)} KD
                        </td>
                        <td className="px-6 py-4 text-end">
                          <Button variant="ghost" size="sm" asChild className="h-8 text-xs">
                            <Link href={`/orders/${order.id}`}>View</Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
