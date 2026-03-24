"use client";

import { useState, useEffect } from "react";
import { IconShoppingBag } from "@tabler/icons-react";
import { useCartStore } from "@/store/cart-store";
import type { Locale } from "@/lib/i18n";

export function CartButton({ locale }: { locale: Locale }) {
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
      className="relative h-10 w-10 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent hover:border-border/40 transition-all duration-200"
      aria-label={isAr ? "السلة" : "Cart"}
    >
      <IconShoppingBag size={22} stroke={1.5} />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 rtl:-left-0.5 rtl:right-auto min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-black animate-in zoom-in duration-300 shadow-sm border-2 border-background">
          {totalItems}
        </span>
      )}
    </button>
  );
}

