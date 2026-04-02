"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { useState } from "react";

interface ProductFiltersProps {
  locale: Locale;
  brands: any[];
}

export function ProductFilters({ locale, brands }: ProductFiltersProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "0");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "100");

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-8 p-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Filter className="h-4 w-4" />
          {isAr ? "الفلاتر" : "Filters"}
        </h3>
        <button 
          onClick={() => router.push(pathname)}
          className="text-xs text-primary font-medium hover:underline"
        >
          {isAr ? "مسح الكل" : "Clear All"}
        </button>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground">
          {isAr ? "السعر (د.ك)" : "Price (KWD)"}
        </h4>
        <div className="grid grid-cols-2 gap-3 pb-2">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase text-muted-foreground">{isAr ? "من" : "Min"}</Label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={() => updateFilters("minPrice", minPrice)}
              className="w-full h-9 px-3 text-sm border border-border rounded-lg focus:ring-1 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase text-muted-foreground">{isAr ? "إلى" : "Max"}</Label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={() => updateFilters("maxPrice", maxPrice)}
              className="w-full h-9 px-3 text-sm border border-border rounded-lg focus:ring-1 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-4 border-t border-border pt-6">
        <h4 className="text-sm font-semibold text-foreground">
          {isAr ? "العلامات التجارية" : "Brands"}
        </h4>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
          {brands.map((brand) => {
            const isChecked = searchParams.getAll("brand").includes(brand.slug);
            return (
              <div key={brand.id} className="flex items-center space-x-2 space-x-reverse group">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    const currentBrands = searchParams.getAll("brand");
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("brand");
                    if (checked) {
                      [...currentBrands, brand.slug].forEach(b => params.append("brand", b));
                    } else {
                      currentBrands.filter(b => b !== brand.slug).forEach(b => params.append("brand", b));
                    }
                    router.push(`${pathname}?${params.toString()}`, { scroll: false });
                  }}
                />
                <Label
                  htmlFor={`brand-${brand.id}`}
                  className="text-sm font-normal cursor-pointer select-none group-hover:text-primary transition-colors"
                >
                  {isAr ? brand.name_ar : brand.name_en}
                </Label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Age Group Placeholder */}
      <div className="space-y-4 border-t border-border pt-6">
        <h4 className="text-sm font-semibold text-foreground">
          {isAr ? "العمر" : "Age Group"}
        </h4>
        <div className="flex flex-wrap gap-2">
          {["0-2", "3-5", "6-8", "9-12", "12+"].map((age) => {
             const isChecked = searchParams.get("age") === age;
             return (
               <button
                 key={age}
                 onClick={() => updateFilters("age", isChecked ? null : age)}
                 className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                   isChecked 
                    ? "bg-primary text-white border-primary" 
                    : "bg-background text-muted-foreground border-border hover:border-primary/30"
                 }`}
               >
                 {age} {isAr ? "سنوات" : "yrs"}
               </button>
             );
          })}
        </div>
      </div>
    </div>
  );
}
