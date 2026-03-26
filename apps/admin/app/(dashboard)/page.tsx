import { Suspense } from "react";
import Link from "next/link";
import { 
  getDashboardStats, 
  getAdminOrders 
} from "@nss/db/queries";
import { 
  Button, 
  Badge, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@nss/ui";
import {
  IconCoin,
  IconShoppingCart,
  IconAlertTriangle,
  IconUsers,
  IconArrowUpRight,
  IconPlus,
  IconBox,
} from "@tabler/icons-react";

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back to your administration panel.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            Download Report
          </Button>
          <Button className="flex items-center gap-2 uppercase font-bold text-xs" asChild>
             <Link href="/products/new">
               <IconPlus size={16} stroke={2.5} />
               Add Product
             </Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<KPIsSkeleton />}>
        <KPISection />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Suspense fallback={<OrdersSkeleton />}>
          <RecentOrdersSection />
        </Suspense>

        <Card className="rounded-2xl border-border/50 shadow-card">
          <CardHeader className="px-6 py-5 border-b border-border/50 bg-muted/20">
            <CardTitle className="text-base font-semibold">Administration</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { label: "Manage Inventory", href: "/inventory", icon: IconBox },
                { label: "View Customers", href: "/customers", icon: IconUsers },
                { label: "Marketing Banners", href: "/banners", icon: IconPlus },
              ].map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/30 hover:border-border transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <link.icon size={16} stroke={1.5} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-sm font-medium">{link.label}</span>
                  </div>
                  <IconArrowUpRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
            
            <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">System Status</h4>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span>All systems operational</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

async function KPISection() {
  const stats = await getDashboardStats();
  const kpis = [
    { 
      label: "Revenue Today", 
      value: `${stats.revenueToday.toFixed(3)} KD`, 
      change: "+12%", 
      icon: IconCoin,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    { 
      label: "Orders Today", 
      value: stats.orderCountToday.toString(), 
      change: "+5", 
      icon: IconShoppingCart,
      color: "text-accent",
      bg: "bg-accent/10"
    },
    { 
      label: "Low Stock Items", 
      value: stats.lowStockCount.toString(), 
      change: stats.lowStockCount > 0 ? "Action Required" : "All Good", 
      icon: IconAlertTriangle, 
      color: stats.lowStockCount > 0 ? "text-destructive" : "text-success",
      bg: stats.lowStockCount > 0 ? "bg-destructive/10" : "bg-success/10"
    },
    { 
      label: "New Customers", 
      value: stats.customerCount.toString(), 
      change: `+${stats.customerCount}`, 
      icon: IconUsers,
      color: "text-purple-mid",
      bg: "bg-purple-mid/10"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="rounded-2xl border-border/50 shadow-card hover:shadow-card-hover transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">{kpi.label}</span>
              <div className={`h-10 w-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon size={20} className={kpi.color} stroke={1.5} />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold tracking-tight">{kpi.value}</h3>
              <p className="text-xs font-medium flex items-center gap-1">
                <span className={kpi.color}>{kpi.change}</span>
                <span className="text-muted-foreground font-normal">from yesterday</span>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function RecentOrdersSection() {
  const { data: recentOrders } = await getAdminOrders({ page: 1, perPage: 5 });

  return (
    <Card className="lg:col-span-2 rounded-2xl border-border/50 shadow-card overflow-hidden">
      <CardHeader className="px-6 py-5 border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
        <Button variant="ghost" size="sm" className="text-xs h-8 gap-1.5" asChild>
          <Link href="/orders">
            View All <IconArrowUpRight size={14} />
          </Link>
        </Button>
      </CardHeader>
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-border/50">
            <TableHead className="w-[100px] font-medium text-xs uppercase tracking-wide">Order</TableHead>
            <TableHead className="font-medium text-xs uppercase tracking-wide">Customer</TableHead>
            <TableHead className="font-medium text-xs uppercase tracking-wide">Status</TableHead>
            <TableHead className="font-medium text-xs uppercase tracking-wide text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                No orders today.
              </TableCell>
            </TableRow>
          ) : (
            recentOrders.map((order) => (
              <TableRow key={order.id} className="border-border/30 hover:bg-muted/10 transition-colors">
                <TableCell className="font-medium text-primary">
                  #{order.order_number}
                </TableCell>
                <TableCell className="font-medium">
                  {order.customer_name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-full px-2.5 py-0.5 font-normal capitalize">
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {Number(order.total_kwd).toFixed(3)} KD
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

function KPIsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-muted/20 rounded-2xl border border-border/40" />
      ))}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="lg:col-span-2 h-64 bg-muted/10 rounded-2xl border border-border/40 animate-pulse" />
  );
}
