import { getAdminCustomers } from "@nss/db/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui";
import Link from "next/link";
import { IconSearch, IconEye } from "@tabler/icons-react";

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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and view your customer base ({count} total)
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="rounded-2xl border-border/50">
        <CardContent className="p-3 sm:p-4">
          <div className="relative w-full sm:max-w-md">
            <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" stroke={1.5} />
            <Input
              placeholder="Search by name, phone, email..."
              defaultValue={query}
              className="pl-10 rounded-xl h-10 w-full"
            />
          </div>
        </CardContent>
      </Card>

      {customers.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground italic text-sm rounded-2xl border border-dashed border-border/60">
          No customers found matching your criteria.
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <Card className="hidden md:block rounded-2xl border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-start">
                <thead className="bg-muted/30 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-start">Customer</th>
                    <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-start">Contact</th>
                    <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-start">Joined</th>
                    <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-start">Orders</th>
                    <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-start">Total Spent</th>
                    <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                            {c.full_name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{c.full_name || "Guest User"}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{c.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-foreground text-sm">{c.email || "—"}</p>
                        <p className="text-xs text-muted-foreground">{c.phone || "—"}</p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="outline" className="font-bold">{c.total_orders}</Badge>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-sm">
                        {c.total_spent_kwd.toFixed(3)} KD
                      </td>
                      <td className="px-6 py-4 text-end">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted/80 transition-colors" asChild>
                          <Link href={`/customers/${c.id}`}>
                            <IconEye size={18} stroke={1.5} />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile card list */}
          <div className="md:hidden space-y-3">
            {customers.map((c) => (
              <Card key={c.id} className="rounded-2xl border-border/40 overflow-hidden bg-card">
                <div className="p-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                    {c.full_name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{c.full_name || "Guest User"}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{c.email || c.phone || "No contact"}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[11px] text-muted-foreground">
                        {c.total_orders} order{c.total_orders !== 1 ? "s" : ""}
                      </span>
                      <span className="text-[11px] font-bold text-foreground">
                        {c.total_spent_kwd.toFixed(3)} KD
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full shrink-0 hover:bg-muted/80 transition-colors" asChild>
                    <Link href={`/customers/${c.id}`}>
                      <IconEye size={18} stroke={1.5} />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
