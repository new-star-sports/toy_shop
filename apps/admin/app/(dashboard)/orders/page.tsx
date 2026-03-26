import Link from "next/link";
import { getAdminOrders } from "@nss/db/queries";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@nss/ui";
import {
  IconSearch,
  IconFilter,
  IconEye,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { cn } from "@nss/ui/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  delivered: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50",
  cancelled: "bg-red-50 text-red-600 ring-1 ring-red-200/50",
  refunded: "bg-red-50 text-red-600 ring-1 ring-red-200/50",
  pending: "bg-amber-50 text-amber-600 ring-1 ring-amber-200/50",
  confirmed: "bg-blue-50 text-blue-600 ring-1 ring-blue-200/50",
  processing: "bg-violet-50 text-violet-600 ring-1 ring-violet-200/50",
  shipped: "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200/50",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; payment?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const status = params.status as any;
  const payment = params.payment as any;
  const page = parseInt(params.page || "1");

  const { data: orders, count } = await getAdminOrders({
    search: query,
    orderStatus: status === "all" ? undefined : status,
    paymentStatus: payment && payment !== "all" ? payment : undefined,
    page,
    perPage: 20,
  });

  const statuses = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage customer orders and fulfillment ({count} total)
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border-border/50 shadow-card">
        <CardContent className="p-3 sm:p-4 flex flex-col gap-3">
          <div className="relative w-full">
            <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" stroke={1.5} />
            <Input
              placeholder="Search by order #, name, email..."
              defaultValue={query}
              className="pl-10 rounded-xl h-10 border-border/40 w-full"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <div className="flex bg-muted/30 p-1 rounded-full border border-border/50 min-w-max">
              {statuses.map((s) => (
                <Button
                  key={s}
                  variant={status === s || (!status && s === "all") ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-full px-3 h-7 text-[10px] capitalize whitespace-nowrap font-bold",
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full h-9 px-3 gap-2 border-border/50 min-w-max text-xs font-bold">
                  <IconFilter size={14} stroke={1.5} />
                  <span className="hidden sm:inline">More Filters</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Payment Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[
                  { value: "all", label: "All Payments" },
                  { value: "pending", label: "Pending" },
                  { value: "confirmed", label: "Confirmed" },
                  { value: "failed", label: "Failed" },
                  { value: "refunded", label: "Refunded" },
                ].map((p) => (
                  <DropdownMenuItem key={p.value} asChild>
                    <Link
                      href={`/orders?${new URLSearchParams({
                        ...(status ? { status } : {}),
                        ...(query ? { q: query } : {}),
                        ...(p.value !== "all" ? { payment: p.value } : {}),
                      }).toString()}`}
                      className={cn(
                        "w-full",
                        (payment === p.value || (!payment && p.value === "all")) && "font-bold"
                      )}
                    >
                      {p.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table */}
      <Card className="hidden md:block rounded-2xl border-border/50 shadow-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="px-6 font-bold text-[11px] uppercase tracking-widest text-muted-foreground">Order</TableHead>
              <TableHead className="px-6 font-bold text-[11px] uppercase tracking-widest text-muted-foreground">Date</TableHead>
              <TableHead className="px-6 font-bold text-[11px] uppercase tracking-widest text-muted-foreground">Customer</TableHead>
              <TableHead className="px-6 font-bold text-[11px] uppercase tracking-widest text-muted-foreground">Total</TableHead>
              <TableHead className="px-6 font-bold text-[11px] uppercase tracking-widest text-muted-foreground">Payment</TableHead>
              <TableHead className="px-6 font-bold text-[11px] uppercase tracking-widest text-muted-foreground">Status</TableHead>
              <TableHead className="px-6 font-bold text-[11px] uppercase tracking-widest text-muted-foreground text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center text-muted-foreground italic text-sm">
                  No orders found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="border-border/30 hover:bg-muted/5 transition-colors">
                  <TableCell className="px-6 py-4">
                    <span className="font-mono font-bold text-primary">#{order.order_number}</span>
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
                        <span className="font-semibold text-foreground text-sm leading-tight">{order.customer_name}</span>
                        <span className="text-[10px] text-muted-foreground">{order.customer_email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 font-semibold text-sm">{order.total_kwd.toFixed(3)} KD</TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <Badge variant={order.payment_status === "confirmed" ? "default" : "secondary"} className="text-[9px] w-fit rounded-full px-2 py-0 h-4 font-bold">
                        {order.payment_status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground opacity-70 italic">{order.payment_method}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className={cn("rounded-full px-3 py-0.5 font-bold text-[10px] capitalize border-none", STATUS_STYLES[order.status] || "bg-muted text-muted-foreground")}>
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

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground italic text-sm rounded-2xl border border-dashed border-border/60">
            No orders found.
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="rounded-2xl border-border/40 shadow-sm overflow-hidden bg-card">
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="font-mono font-bold text-primary text-base">#{order.order_number}</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {format(new Date(order.created_at), "MMM d, yyyy · HH:mm")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 font-bold text-[10px] capitalize border-none", STATUS_STYLES[order.status] || "bg-muted text-muted-foreground")}>
                      {order.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shrink-0" asChild>
                      <Link href={`/orders/${order.id}`}>
                        <IconEye size={16} stroke={1.5} />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-border/30">
                  <Avatar className="h-8 w-8 rounded-full border border-border/40 shrink-0">
                    <AvatarFallback className="bg-muted text-[10px] font-bold text-muted-foreground">
                      {order.customer_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{order.customer_name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{order.customer_email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-foreground text-sm">{order.total_kwd.toFixed(3)} KD</p>
                    <Badge variant={order.payment_status === "confirmed" ? "default" : "secondary"} className="text-[9px] rounded-full px-2 py-0 h-4 font-bold">
                      {order.payment_status}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
