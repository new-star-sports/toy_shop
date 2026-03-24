import Link from "next/link";
import { getAdminOrders } from "@nss/db/queries";
import { createServerClient } from "@nss/db/client";
import { cookies } from "next/headers";
import { 
  Button, 
  Input, 
  Badge, 
  Card, 
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Avatar,
  AvatarFallback,
} from "@nss/ui";
import { 
  IconSearch, 
  IconFilter, 
  IconEye,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { cn } from "@nss/ui/lib/utils";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const status = params.status as any;
  const page = parseInt(params.page || "1");

  const { data: orders, count } = await getAdminOrders({
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
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage customer orders and fulfillment ({count} total)
          </p>
        </div>
      </div>

      {/* Filters & Actions Bar */}
      <Card className="rounded-2xl border-border/50 shadow-card">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" stroke={1.5} />
            <Input
              placeholder="Search by order #, name, email..."
              defaultValue={query}
              className="pl-10 rounded-full h-10 border-border/40 focus:bg-background/50"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <div className="flex bg-muted/30 p-1 rounded-full border border-border/50">
              {statuses.map((s) => (
                <Button
                  key={s}
                  variant={status === s || (!status && s === "all") ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-full px-4 h-8 text-xs capitalize whitespace-nowrap",
                    (status === s || (!status && s === "all")) && "bg-background shadow-sm"
                  )}
                  asChild
                >
                  <Link href={`/orders?status=${s}${query ? `&q=${query}` : ""}`}>
                    {s}
                  </Link>
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="rounded-full h-10 px-4 gap-2 border-border/50">
              <IconFilter size={16} stroke={1.5} />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="px-6 font-medium text-xs uppercase tracking-wide">Order</TableHead>
              <TableHead className="px-6 font-medium text-xs uppercase tracking-wide">Date</TableHead>
              <TableHead className="px-6 font-medium text-xs uppercase tracking-wide">Customer</TableHead>
              <TableHead className="px-6 font-medium text-xs uppercase tracking-wide">Total</TableHead>
              <TableHead className="px-6 font-medium text-xs uppercase tracking-wide">Payment</TableHead>
              <TableHead className="px-6 font-medium text-xs uppercase tracking-wide">Status</TableHead>
              <TableHead className="px-6 font-medium text-xs uppercase tracking-wide text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center text-muted-foreground italic">
                  No orders found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="border-border/30 hover:bg-muted/5 transition-colors">
                  <TableCell className="px-6 py-4">
                    <span className="font-mono font-bold text-primary">
                      #{order.order_number}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-muted-foreground text-xs">
                    {format(new Date(order.created_at), "MMM d, HH:mm")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 rounded-full border border-border/40">
                        <AvatarFallback className="bg-muted text-[10px] font-bold text-muted-foreground">
                          {order.customer_name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground leading-none mb-1 text-sm">
                          {order.customer_name}
                        </span>
                        <span className="text-[10px] text-muted-foreground leading-none">
                          {order.customer_email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 font-semibold text-sm">
                    {order.total_kwd.toFixed(3)} KD
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <Badge 
                        variant={order.payment_status === "confirmed" ? "default" : "secondary"} 
                        className="text-[9px] w-fit rounded-full px-2 py-0 h-4 font-bold"
                      >
                        {order.payment_status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground opacity-70 italic">{order.payment_method}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant={
                        order.status === "delivered"
                          ? "default"
                          : order.status === "cancelled" || order.status === "refunded"
                          ? "destructive"
                          : "outline"
                      }
                      className="rounded-full px-3 py-0.5 font-normal text-xs capitalize"
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" asChild>
                      <Link href={`/orders/${order.id}`}>
                        <IconEye size={18} stroke={1.5} />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
