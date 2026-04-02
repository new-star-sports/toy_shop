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

const CLAY_COLORS = [
  { bg: "bg-clay-sky",      shadow: "clay-shadow-sky",      active: "bg-clay-sky",      text: "text-clay-sky-deep"      },
  { bg: "bg-clay-mint",     shadow: "clay-shadow-mint",     active: "bg-clay-mint",     text: "text-clay-mint-deep"     },
  { bg: "bg-clay-lavender", shadow: "clay-shadow-lavender", active: "bg-clay-lavender", text: "text-clay-lavender-deep" },
  { bg: "bg-clay-peach",    shadow: "clay-shadow-peach",    active: "bg-clay-peach",    text: "text-clay-peach-deep"    },
  { bg: "bg-clay-pink",     shadow: "clay-shadow-pink",     active: "bg-clay-pink",     text: "text-clay-pink-deep"     },
  { bg: "bg-clay-lemon",    shadow: "clay-shadow-lemon",    active: "bg-clay-lemon",    text: "text-clay-lemon-deep"    },
  { bg: "bg-clay-coral",    shadow: "clay-shadow-coral",    active: "bg-clay-coral",    text: "text-clay-coral-deep"    },
];

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
    <div className={cn(
      "sticky top-16 sm:top-[72px] z-40 bg-background/90 backdrop-blur-md transition-all duration-300",
      scrolled
        ? "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.10)] border-b border-border/40"
        : "border-b border-border/30"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── EXPANDED STATE (clay bubble icons + labels) ── */}
        <div className={cn(
          "overflow-x-auto scrollbar-hide transition-all duration-300",
          scrolled ? "hidden" : "flex py-3"
        )}>
          <div className="flex items-start gap-1 mx-auto">
            {/* For You */}
            <Link
              href={`/${locale}`}
              className={cn(
                "flex flex-col items-center gap-1.5 px-2.5 py-1.5 rounded-2xl min-w-[72px] text-center transition-all duration-200 shrink-0",
                isHome ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200",
                isHome
                  ? "bg-clay-sky clay-shadow-sky scale-110"
                  : "bg-muted hover:bg-clay-sky/60 hover:clay-shadow-sky"
              )}>
                <Home size={22} className={isHome ? "text-clay-sky-deep" : "text-muted-foreground"} />
              </div>
              <span className={cn(
                "text-[11px] font-black whitespace-nowrap leading-tight",
                isHome ? "text-clay-sky-deep" : ""
              )}>
                {isAr ? "لك" : "For You"}
              </span>
            </Link>

            {/* Divider */}
            <div className="w-px bg-border/60 mx-1 self-stretch my-3 shrink-0" />

            {/* Categories */}
            {categories.map((cat, idx) => {
              const isActive = activeCategorySlug === cat.slug;
              const label = isAr ? cat.name_ar : cat.name_en;
              const clay = CLAY_COLORS[idx % CLAY_COLORS.length];
              return (
                <Link
                  key={cat.id}
                  href={`/${locale}/category/${cat.slug}`}
                  className={cn(
                    "flex flex-col items-center gap-1.5 px-2.5 py-1.5 rounded-2xl min-w-[72px] text-center transition-all duration-200 shrink-0",
                    isActive ? clay.text : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-full overflow-hidden flex items-center justify-center transition-all duration-200",
                    isActive
                      ? `${clay.bg} ${clay.shadow} scale-110`
                      : `bg-muted hover:${clay.bg} hover:scale-105`
                  )}>
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={label} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={20} className={isActive ? clay.text : "text-muted-foreground/50"} />
                    )}
                  </div>
                  <span className={cn(
                    "text-[11px] font-black whitespace-nowrap leading-tight max-w-[72px] truncate",
                    isActive ? clay.text : ""
                  )}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── COMPACT STATE (clay pill tabs) ── */}
        <div className={cn(
          "overflow-x-auto scrollbar-hide transition-all duration-300",
          scrolled ? "flex py-2 gap-1.5" : "hidden"
        )}>
          {/* For You */}
          <Link
            href={`/${locale}`}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-black whitespace-nowrap shrink-0 transition-all duration-200",
              isHome
                ? "bg-clay-sky text-clay-sky-deep clay-shadow-sky"
                : "bg-muted text-muted-foreground hover:bg-clay-sky/60 hover:text-clay-sky-deep"
            )}
          >
            {isAr ? "لك" : "For You"}
          </Link>

          {/* Categories */}
          {categories.map((cat, idx) => {
            const isActive = activeCategorySlug === cat.slug;
            const label = isAr ? cat.name_ar : cat.name_en;
            const clay = CLAY_COLORS[idx % CLAY_COLORS.length];
            return (
              <Link
                key={cat.id}
                href={`/${locale}/category/${cat.slug}`}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-black whitespace-nowrap shrink-0 transition-all duration-200",
                  isActive
                    ? `${clay.bg} ${clay.text} ${clay.shadow}`
                    : `bg-muted text-muted-foreground hover:${clay.bg} hover:${clay.text}`
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
