"use client";

import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

export function CartButton({ locale, scrolled }: { locale: Locale; scrolled?: boolean }) {
  const isAr = locale === "ar";
  const { toggleDrawer, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  return (
    <button
      onClick={() => toggleDrawer(true)}
      className={cn(
        "relative h-9 w-9 flex items-center justify-center rounded-full transition-all duration-200",
        scrolled
          ? "text-foreground/70 hover:text-primary hover:bg-primary/5"
          : "text-white/80 hover:text-white hover:bg-white/10"
      )}
      aria-label={isAr ? "السلة" : "Cart"}
    >
      <ShoppingBag size={20} />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 rtl:-left-0.5 rtl:right-auto min-w-[16px] h-4 px-1 rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold border-2 border-background">
          {totalItems}
        </span>
      )}
    </button>
  );
}

