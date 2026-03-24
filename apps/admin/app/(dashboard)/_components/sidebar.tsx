"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@nss/ui/lib/utils";
import {
  IconLayoutDashboard,
  IconPackage,
  IconCategory,
  IconBuildingStore,
  IconPhoto,
  IconArticle,
  IconTicket,
  IconUsers,
  IconShoppingCart,
  IconStar,
  IconBox,
  IconSettings,
  IconChartBar,
  IconTruck,
  IconArrowBackUp,
} from "@tabler/icons-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: IconLayoutDashboard },
  { label: "Products", href: "/products", icon: IconPackage },
  { label: "Categories", href: "/categories", icon: IconCategory },
  { label: "Brands", href: "/brands", icon: IconBuildingStore },
  { label: "Banners", href: "/banners", icon: IconPhoto },
  { label: "Blogs", href: "/blog", icon: IconArticle },
  { label: "Coupons", href: "/coupons", icon: IconTicket },
  { label: "Customers", href: "/customers", icon: IconUsers },
  { label: "Orders", href: "/orders", icon: IconShoppingCart },
  { label: "Reviews", href: "/reviews", icon: IconStar },
  { label: "Inventory", href: "/inventory", icon: IconBox },
  { label: "Analytics", href: "/analytics", icon: IconChartBar },
  { label: "Shipping", href: "/shipping", icon: IconTruck },
  { label: "Returns", href: "/returns", icon: IconArrowBackUp },
  { label: "Settings", href: "/settings", icon: IconSettings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border/50 bg-card">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border/50">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-sm text-white font-bold">★</span>
        </div>
        <span className="font-semibold text-primary">NSS Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              )}
            >
              <item.icon size={20} stroke={1.5} className={cn(isActive ? "text-primary" : "text-muted-foreground")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
