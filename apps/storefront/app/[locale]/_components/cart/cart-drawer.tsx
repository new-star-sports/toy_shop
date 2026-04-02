"use client";

import { useEffect, useState } from "react";
import { X, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { CartItem } from "./cart-item";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";

export function CartDrawer({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const { items, isOpen, toggleDrawer, getTotalPrice, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => toggleDrawer(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 bottom-0 z-[70] w-full max-w-md bg-background border-border shadow-2xl transition-transform duration-500 ease-in-out ${
          isOpen 
            ? "translate-x-0" 
            : (isAr ? "-translate-x-full" : "translate-x-full")
        } ${isAr ? "left-0 border-r" : "right-0 border-l"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                {isAr ? "سلة التسوق" : "Shopping Cart"}
              </h2>
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                {getTotalItems()}
              </span>
            </div>
            <button
              onClick={() => toggleDrawer(false)}
              className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-foreground">
                    {isAr ? "سلتك فارغة" : "Your cart is empty"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isAr ? "ابحث عن ألعاب رائعة لإضافتها هنا!" : "Find some awesome toys to add here!"}
                  </p>
                </div>
                <Button 
                  onClick={() => toggleDrawer(false)}
                  className="rounded-full px-8"
                >
                  {isAr ? "ابدأ التسوق" : "Start Shopping"}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <CartItem key={item.variantId} item={item} locale={locale} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border bg-muted/20 space-y-4">
              <div className="flex items-center justify-between text-foreground">
                <span className="text-base font-medium">{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                <span className="text-xl font-bold">{getTotalPrice().toFixed(3)} {isAr ? "د.ك" : "KWD"}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isAr 
                  ? "سيتم حساب تكلفة الشحن والضرائب عند الدفع" 
                  : "Shipping & taxes calculated at checkout"}
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  asChild
                  className="w-full h-12 rounded-full font-bold"
                  onClick={() => toggleDrawer(false)}
                >
                  <Link href={`/${locale}/checkout`}>
                    {isAr ? "إتمام الطلب" : "Checkout"}
                    {isAr ? <ArrowLeft className="ms-2 h-5 w-5" /> : <ArrowRight className="ms-2 h-5 w-5" />}
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  asChild
                  className="w-full h-12 rounded-2xl border-2"
                  onClick={() => toggleDrawer(false)}
                >
                  <Link href={`/${locale}/cart`}>
                    {isAr ? "عرض السلة" : "View Cart"}
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
