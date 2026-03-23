import { getAdminCustomers } from "@nss/db/queries";
import { Button } from "@nss/ui/components/button";
import { Input } from "@nss/ui/components/input";
import { Badge } from "@nss/ui/components/badge";
import Link from "next/link";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const page = parseInt(params.page || "1");

  const { data: customers, count } = await getAdminCustomers({
    search: query,
    page,
    perPage: 10,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nss-text-primary">Customers</h1>
          <p className="text-sm text-nss-text-secondary">
            Manage and view your customer base ({count} total)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-nss-card p-4 rounded-xl border border-nss-border">
        <div className="flex-1">
          <Input
            placeholder="Search by name, phone..."
            defaultValue={query}
            className="max-w-md"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-nss-card rounded-xl border border-nss-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-nss-surface text-nss-text-secondary border-b border-nss-border">
              <tr>
                <th className="px-6 py-3 font-semibold text-start">Customer</th>
                <th className="px-6 py-3 font-semibold text-start">Contact</th>
                <th className="px-6 py-3 font-semibold text-start">Joined</th>
                <th className="px-6 py-3 font-semibold text-start">Orders</th>
                <th className="px-6 py-3 font-semibold text-start">Total Spent</th>
                <th className="px-6 py-3 font-semibold text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nss-border">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-nss-text-secondary">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-nss-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-nss-primary/10 flex items-center justify-center text-nss-primary font-bold">
                          {c.full_name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-nss-text-primary">
                            {c.full_name || "Guest User"}
                          </p>
                          <p className="text-[10px] text-nss-text-secondary font-mono">
                            {c.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-nss-text-primary">{c.email || "—"}</p>
                      <p className="text-xs text-nss-text-secondary">{c.phone || "—"}</p>
                    </td>
                    <td className="px-6 py-4 text-nss-text-secondary">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline">{c.total_orders}</Badge>
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {c.total_spent_kwd.toFixed(3)} KD
                    </td>
                    <td className="px-6 py-4 text-end">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/customers/${c.id}`}>View Details</Link>
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
