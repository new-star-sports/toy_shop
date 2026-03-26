"use client";


import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@nss/ui/lib/utils";
import { Button } from "@nss/ui/components/button";
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
  IconX,
  IconLogout,
} from "@tabler/icons-react";
import { Suspense, use } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@nss/ui/components/avatar";
import type { AdminUser } from "./dashboard-shell";

const navItems = [
  { label: "Dashboard", href: "/", icon: IconLayoutDashboard },
  // Catalog
  { label: "Categories", href: "/categories", icon: IconCategory },
  { label: "Brands", href: "/brands", icon: IconBuildingStore },
  { label: "Products", href: "/products", icon: IconPackage },
  // Marketing
  { label: "Banners", href: "/banners", icon: IconPhoto },
  { label: "Coupons", href: "/coupons", icon: IconTicket },
  { label: "Blog", href: "/blogs", icon: IconArticle },
  // Sales
  { label: "Orders", href: "/orders", icon: IconShoppingCart },
  { label: "Customers", href: "/customers", icon: IconUsers },
  // Operations
  { label: "Inventory", href: "/inventory", icon: IconBox },
  { label: "Shipping", href: "/shipping", icon: IconTruck },
  { label: "Returns", href: "/returns", icon: IconArrowBackUp },
  // Insights
  { label: "Analytics", href: "/analytics", icon: IconChartBar },
  { label: "Reviews", href: "/reviews", icon: IconStar },
  // Settings
  { label: "Settings", href: "/settings", icon: IconSettings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  onSignOut: () => void;
  userPromise: Promise<AdminUser>;
}

function SidebarUser({ userPromise }: { userPromise: Promise<AdminUser> }) {
  const user = use(userPromise);
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <Avatar className="h-10 w-10 border border-primary/20 bg-primary/5">
        <AvatarImage src="" />
        <AvatarFallback className="bg-primary/10 text-primary font-bold">
          {user.initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{user.fullName}</p>
        <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium">
          {user.role}
        </p>
      </div>
    </div>
  );
}

function NavContent({
  pathname,
  userPromise,
  onLinkClick,
  onSignOutClick,
}: {
  pathname: string;
  userPromise: Promise<AdminUser>;
  onLinkClick?: () => void;
  onSignOutClick: () => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border/50 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-sm text-white font-bold">★</span>
        </div>
        <span className="font-semibold text-primary">NSS Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              )}
            >
              <item.icon
                size={20}
                stroke={1.5}
                className={cn(isActive ? "text-primary" : "text-muted-foreground")}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile & Sign out */}
      <div className="px-3 py-4 border-t border-border/50 shrink-0 space-y-3">
        <Suspense fallback={
          <div className="flex items-center gap-3 px-3 py-2 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 bg-muted rounded" />
              <div className="h-2 w-12 bg-muted rounded" />
            </div>
          </div>
        }>
          <SidebarUser userPromise={userPromise} />
        </Suspense>

        <Button
          variant="ghost"
          className="w-full justify-start items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive flex transition-colors"
          onClick={onSignOutClick}
        >
          <IconLogout size={20} stroke={1.5} className="shrink-0" />
          <span>Sign Out</span>
        </Button>
      </div>
    </>
  );
}

export function Sidebar({ mobileOpen, onCloseMobile, userPromise, onSignOut }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border/50 bg-card shrink-0 h-screen sticky top-0">
        <NavContent pathname={pathname} userPromise={userPromise} onSignOutClick={onSignOut} />
      </aside>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-card border-r border-border/50 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button */}
        <button
          onClick={onCloseMobile}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted/50 transition-colors"
        >
          <IconX size={18} stroke={2} className="text-muted-foreground" />
        </button>
        <NavContent 
          pathname={pathname} 
          userPromise={userPromise} 
          onLinkClick={onCloseMobile} 
          onSignOutClick={onSignOut} 
        />
      </aside>
    </>
  );
}
