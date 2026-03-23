"use client";

import { ShoppingBag } from "lucide-react";
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
      className="relative p-2 rounded-lg text-nss-text-secondary hover:bg-nss-surface transition-colors min-h-0 min-w-0"
      aria-label={isAr ? "السلة" : "Cart"}
    >
      <ShoppingBag className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 rtl:-left-0.5 rtl:right-auto w-4 h-4 rounded-full bg-nss-accent text-white text-[10px] flex items-center justify-center font-bold animate-in zoom-in duration-300">
          {totalItems}
        </span>
      )}
    </button>
  );
}

import { useState, useEffect } from "react";
