"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Package, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionSearchBar } from "@/components/ui/action-search-bar";
import { CartButton } from "./cart-button";
import { AccountButton } from "./account-button";
import type { Locale } from "@/lib/i18n";
import type { User } from "@supabase/supabase-js";

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  image_url: string | null;
}

interface SiteHeaderClientProps {
  locale: Locale;
  user?: User | null;
  categories: Category[];
}

export function SiteHeaderClient({ locale, user, categories }: SiteHeaderClientProps) {
  const isAr = locale === "ar";
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const activeCategorySlug = pathname.match(/\/category\/([^/]+)/)?.[1] ?? undefined;
  const activeBrandSlug = pathname.match(/\/brand\/([^/]+)/)?.[1] ?? undefined;
  const isHome = !activeCategorySlug && !activeBrandSlug;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const HEADER_GRADIENT = "linear-gradient(to bottom, #85c3ff 0%, #c8e4ff 55%, #ffffff 100%)";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Single gradient container — always maintains #85c3ff → white gradient */}
      <div style={{ background: HEADER_GRADIENT }}>

        {/* ── ROW 1: Logo + Search (flex-1) + Right actions ── */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3 h-14 sm:h-16">

            {/* Logo */}
            <Link href={`/${locale}`} className="flex-shrink-0 group">
              <img
                src="/logo.png"
                alt={isAr ? "نيو ستار سبورتس" : "NewStarSports"}
                className="h-7 sm:h-9 w-auto transition-opacity group-hover:opacity-80"
              />
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-5 text-sm font-bold shrink-0">
              {[
                { href: `/${locale}/products`, en: "Shop", ar: "المتجر" },
                { href: `/${locale}/products?sort=new`, en: "New Arrivals", ar: "وصل حديثاً" },
                { href: `/${locale}/products?sale=true`, en: "Sale", ar: "تخفيضات" },
                { href: `/${locale}/blog`, en: "Blog", ar: "المدونة" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white drop-shadow hover:text-white/80 transition-colors"
                  style={{ textShadow: "0 1px 3px rgba(0,80,160,0.35)" }}
                >
                  {isAr ? link.ar : link.en}
                </Link>
              ))}
            </nav>

            {/* Search — grows to fill available space */}
            <div className="flex-1 min-w-0">
              <ActionSearchBar locale={locale} />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              {/* Language toggle */}
              <Link
                href={`/${locale === "ar" ? "en" : "ar"}`}
                className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full text-xs font-extrabold bg-white/40 text-[#1a5fa8] border border-white/60 hover:bg-white/60 transition-all duration-200 shadow-sm"
              >
                {isAr ? "EN" : "AR"}
              </Link>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-white hover:bg-white/30 drop-shadow"
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,80,160,0.3))" }}
                asChild
              >
                <Link href={`/${locale}/account/wishlist`} aria-label={isAr ? "المفضلات" : "Wishlist"}>
                  <Heart size={19} />
                </Link>
              </Button>

              {/* Cart */}
              <CartButton locale={locale} scrolled={true} />

              <div className="h-4 w-px hidden sm:block bg-white/40 mx-0.5" />

              {/* Account */}
              <AccountButton locale={locale} user={user} scrolled={true} />
            </div>
          </div>
        </div>

        {/* ── ROW 2: Category icons (expanded) OR text tabs (compact/scrolled) ── */}
        {!scrolled ? (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 border-t border-black/5">
            <div className="overflow-x-auto scrollbar-hide py-2">
              <div className="flex items-start gap-0.5 w-fit mx-auto">
                {/* For You */}
                <Link
                  href={`/${locale}`}
                  className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl min-w-[68px] text-center transition-all shrink-0"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white shadow-sm",
                    isHome && "ring-2 ring-primary"
                  )}>
                    <Home size={20} className={isHome ? "text-primary" : "text-foreground/50"} />
                  </div>
                  <span className={cn(
                    "text-[11px] font-bold whitespace-nowrap leading-tight",
                    isHome ? "text-primary" : "text-foreground/70"
                  )}>
                    {isAr ? "لك" : "For You"}
                  </span>
                </Link>

                <div className="w-px bg-black/10 mx-0.5 self-stretch my-2 shrink-0" />

                {categories.map((cat) => {
                  const isActive = activeCategorySlug === cat.slug;
                  const label = isAr ? cat.name_ar : cat.name_en;
                  return (
                    <Link
                      key={cat.id}
                      href={`/${locale}/category/${cat.slug}`}
                      className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl min-w-[68px] text-center transition-all shrink-0"
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-full overflow-hidden flex items-center justify-center transition-all bg-white shadow-sm",
                        isActive && "ring-2 ring-primary"
                      )}>
                        {cat.image_url ? (
                          <img src={cat.image_url} alt={label} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={18} className={isActive ? "text-primary" : "text-foreground/40"} />
                        )}
                      </div>
                      <span className={cn(
                        "text-[11px] font-bold whitespace-nowrap leading-tight max-w-[68px] truncate",
                        isActive ? "text-primary" : "text-foreground/70"
                      )}>
                        {label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Compact — text tabs on white */
          <div className="bg-white border-t border-border">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-0 w-fit mx-auto">
                <Link
                  href={`/${locale}`}
                  className={cn(
                    "relative px-4 py-2.5 text-xs font-bold whitespace-nowrap shrink-0 transition-colors",
                    isHome
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isAr ? "لك" : "For You"}
                </Link>
                <div className="w-px bg-border mx-0.5 h-4 shrink-0" />
                {categories.map((cat) => {
                  const isActive = activeCategorySlug === cat.slug;
                  const label = isAr ? cat.name_ar : cat.name_en;
                  return (
                    <Link
                      key={cat.id}
                      href={`/${locale}/category/${cat.slug}`}
                      className={cn(
                        "relative px-4 py-2.5 text-xs font-bold whitespace-nowrap shrink-0 transition-colors",
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
        )}
      </div>
    </header>
  );
}
