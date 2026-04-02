"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductFilters } from "./product-filters";
import type { Locale } from "@/lib/i18n";

interface MobileFilterDrawerProps {
  locale: Locale;
  brands: any[];
}

export function MobileFilterDrawer({ locale, brands }: MobileFilterDrawerProps) {
  const isAr = locale === "ar";
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="lg:hidden flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black bg-clay-lavender text-clay-lavender-deep clay-shadow-lavender transition-all hover:scale-105 active:scale-95">
          <SlidersHorizontal size={13} />
          {isAr ? "تصفية" : "Filter"}
        </button>
      </SheetTrigger>
      <SheetContent
        side={isAr ? "right" : "left"}
        className="w-[85vw] max-w-sm p-0 border-none rounded-r-[2rem] rtl:rounded-r-none rtl:rounded-l-[2rem] overflow-hidden"
      >
        <div className="h-full flex flex-col bg-white">
          <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/20">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-black text-foreground flex items-center gap-2">
                <SlidersHorizontal size={16} />
                {isAr ? "الفلاتر" : "Filters"}
              </SheetTitle>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
            <ProductFilters locale={locale} brands={brands} />
          </div>
          <div className="p-4 border-t border-border/20">
            <button
              onClick={() => setOpen(false)}
              className="w-full py-3 rounded-full bg-primary text-white font-black clay-shadow-sky active:scale-[0.98] transition-all"
            >
              {isAr ? "عرض النتائج" : "Show Results"}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
