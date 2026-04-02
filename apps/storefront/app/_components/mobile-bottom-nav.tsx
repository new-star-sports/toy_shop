"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { type Locale } from "@/lib/i18n";
import { Home, LayoutGrid, ShoppingBag, Heart, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  locale: Locale;
}

export default function MobileBottomNav({ locale }: MobileBottomNavProps) {
  const isAr = locale === "ar";
  const cartItemCount = useCartStore().getTotalItems();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const links = [
    { href: `/${locale}`, icon: Home, en: "Home", ar: "الرئيسية" },
    { href: `/${locale}/products`, icon: LayoutGrid, en: "Shop", ar: "المتجر" },
    { href: `/${locale}/account/wishlist`, icon: Heart, en: "Wishlist", ar: "المفضلة" },
    { href: `/${locale}/account/profile`, icon: User, en: "Account", ar: "حسابي" },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {links.map(({ href, icon: Icon, en, ar }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{isAr ? ar : en}</span>
            </Link>
          );
        })}

        {/* Cart with badge */}
        <button
          onClick={() => useCartStore.getState().toggleDrawer(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-muted-foreground hover:text-foreground transition-colors relative"
          aria-label={isAr ? "السلة" : "Cart"}
        >
          <ShoppingBag size={22} strokeWidth={1.5} />
          {mounted && cartItemCount > 0 && (
            <span className="absolute top-0.5 right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold border-2 border-background">
              {cartItemCount}
            </span>
          )}
          <span className="text-[10px] font-medium">{isAr ? "السلة" : "Cart"}</span>
        </button>
      </div>
    </nav>
  );
}
