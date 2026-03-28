"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px] rounded-xl border-nss-border bg-white text-sm font-medium hover:border-nss-primary/30 focus:ring-2 focus:ring-nss-primary/10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-[180px]">
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {isAr ? option.label_ar : option.label_en}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
