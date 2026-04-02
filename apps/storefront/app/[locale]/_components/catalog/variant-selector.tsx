"use client";

import { Button } from "@/components/ui";
import type { ProductVariant } from "@nss/db/types";
import type { Locale } from "@/lib/i18n";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
  locale: Locale;
}

export function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
  locale,
}: VariantSelectorProps) {
  const isAr = locale === "ar";

  // Group variants by name (e.g., size or color)
  // For now, let's assume a simple list if we only have one type of variant
  // In a more complex setup, we'd group by option type.

  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          {isAr ? "اختر" : "Select Option"}
        </h3>
        {selectedVariant && (
          <span className="text-xs text-muted-foreground">
            {isAr ? "المختار:" : "Selected:"} {isAr ? selectedVariant.name_ar : selectedVariant.name_en}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const isOutOfStock = variant.stock_quantity <= 0;

          return (
            <Button
              key={variant.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`h-10 px-4 rounded-xl border-2 transition-all ${
                isSelected 
                  ? "bg-primary text-white border-primary" 
                  : "border-border/50 hover:border-primary/30"
              } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => !isOutOfStock && onSelect(variant)}
              disabled={isOutOfStock}
            >
              <span className="text-sm font-medium">
                {isAr ? variant.name_ar : variant.name_en}
              </span>
              {isOutOfStock && (
                <span className="ms-2 text-[10px] opacity-70">
                  ({isAr ? "نفذ" : "Out"})
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
