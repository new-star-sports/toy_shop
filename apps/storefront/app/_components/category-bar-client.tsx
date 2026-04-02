"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, Package } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  image_url: string | null;
}

interface CategoryBarClientProps {
  locale: Locale;
  categories: Category[];
  activeCategorySlug?: string;
  activeBrandSlug?: string;
}

export function CategoryBarClient({
  locale,
  categories,
  activeCategorySlug,
  activeBrandSlug,
}: CategoryBarClientProps) {
  const isAr = locale === "ar";
  const isHome = !activeCategorySlug && !activeBrandSlug;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-16 sm:top-[72px] z-40 bg-background border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── EXPANDED STATE (icons + labels) ── */}
        <div className={cn(
          "overflow-x-auto scrollbar-hide transition-all duration-300",
          scrolled ? "hidden" : "flex py-2"
        )}>
          <div className="flex items-start gap-0.5 mx-auto">
            {/* For You */}
            <Link
              href={`/${locale}`}
              className={cn(
                "flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl min-w-[72px] text-center transition-all shrink-0",
                isHome ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "w-13 h-13 rounded-full flex items-center justify-center transition-all",
                isHome
                  ? "bg-primary/15 ring-2 ring-primary ring-offset-1"
                  : "bg-muted hover:bg-primary/10"
              )}>
                <Home size={22} className={isHome ? "text-primary" : "text-muted-foreground"} />
              </div>
              <span className="text-[11px] font-bold whitespace-nowrap leading-tight">
                {isAr ? "لك" : "For You"}
              </span>
            </Link>

            {/* Divider */}
            <div className="w-px bg-border mx-1 self-stretch my-2 shrink-0" />

            {/* Categories */}
            {categories.map((cat) => {
              const isActive = activeCategorySlug === cat.slug;
              const label = isAr ? cat.name_ar : cat.name_en;
              return (
                <Link
                  key={cat.id}
                  href={`/${locale}/category/${cat.slug}`}
                  className={cn(
                    "flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-xl min-w-[72px] text-center transition-all shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "w-13 h-13 rounded-full overflow-hidden flex items-center justify-center transition-all",
                    isActive
                      ? "ring-2 ring-primary ring-offset-1 bg-primary/10"
                      : "bg-muted hover:bg-primary/10"
                  )}>
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={label} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={20} className={isActive ? "text-primary" : "text-muted-foreground/50"} />
                    )}
                  </div>
                  <span className="text-[11px] font-bold whitespace-nowrap leading-tight max-w-[72px] truncate">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── COMPACT STATE (text tabs only) ── */}
        <div className={cn(
          "overflow-x-auto scrollbar-hide transition-all duration-300",
          scrolled ? "flex" : "hidden"
        )}>
          <div className="flex items-center gap-0 mx-auto">
            {/* For You */}
            <Link
              href={`/${locale}`}
              className={cn(
                "relative px-4 py-3 text-xs font-bold whitespace-nowrap shrink-0 transition-colors",
                isHome
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isAr ? "لك" : "For You"}
            </Link>

            {/* Divider */}
            <div className="w-px bg-border mx-0.5 h-4 shrink-0" />

            {/* Categories */}
            {categories.map((cat) => {
              const isActive = activeCategorySlug === cat.slug;
              const label = isAr ? cat.name_ar : cat.name_en;
              return (
                <Link
                  key={cat.id}
                  href={`/${locale}/category/${cat.slug}`}
                  className={cn(
                    "relative px-4 py-3 text-xs font-bold whitespace-nowrap shrink-0 transition-colors",
                    isActive
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
