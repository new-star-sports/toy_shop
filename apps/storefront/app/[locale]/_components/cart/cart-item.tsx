"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, type CartItem as CartItemType } from "@/store/cart-store";
import type { Locale } from "@/lib/i18n";

interface CartItemProps {
  item: CartItemType;
  locale: Locale;
}

export function CartItem({ item, locale }: CartItemProps) {
  const isAr = locale === "ar";
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      {/* Image */}
      <div className="relative h-20 w-20 flex-shrink-0 bg-muted/30 rounded-xl border border-border overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={isAr ? item.nameAr : item.nameEn}
            fill
            className="object-contain p-1"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            <span className="text-[10px]">No image</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h4 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">
              {isAr ? item.nameAr : item.nameEn}
            </h4>
            <button
              onClick={() => removeItem(item.variantId)}
              className="text-muted-foreground hover:text-red-500 transition-colors p-1 -m-1"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {isAr ? item.brandAr : item.brandEn}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center border border-border rounded-lg bg-muted/30 overflow-hidden">
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              className="p-1 px-2 hover:bg-muted transition-colors disabled:opacity-30"
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-xs font-bold w-6 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              className="p-1 px-2 hover:bg-muted transition-colors disabled:opacity-30"
              disabled={item.quantity >= item.stockQuantity}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm font-bold text-primary">
              {(item.price * item.quantity).toFixed(3)} {isAr ? "د.ك" : "KWD"}
            </p>
            {item.quantity > 1 && (
              <p className="text-[10px] text-muted-foreground line-through">
                {item.price.toFixed(3)} {isAr ? "د.ك" : "KWD"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
