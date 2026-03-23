"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export function ProductSort({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const sortOptions = [
    { value: "newest", label_en: "Newest Arrivals", label_ar: "أحدث المنتجات" },
    { value: "price_asc", label_en: "Price: Low to High", label_ar: "السعر: من الأقل للأعلى" },
    { value: "price_desc", label_en: "Price: High to Low", label_ar: "السعر: من الأعلى للأقل" },
    { value: "best_sellers", label_en: "Best Sellers", label_ar: "الأكثر مبيعاً" },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-nss-text-secondary hidden sm:inline">
        {isAr ? "ترتيب حسب:" : "Sort by:"}
      </span>
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="appearance-none bg-white border border-nss-border rounded-xl px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-nss-primary/10 transition-all cursor-pointer hover:border-nss-primary/30"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {isAr ? option.label_ar : option.label_en}
            </option>
          ))}
        </select>
        <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nss-text-secondary pointer-events-none" />
      </div>
    </div>
  );
}
