"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchBar } from "./search-bar";
import { SearchOverlay } from "./search-overlay";
import { CartButton } from "./cart-button";
import { AccountButton } from "./account-button";
import { Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  locale: Locale;
  user?: User | null;
}

const NAV_LINKS = [
  { href: "products",           en: "Shop",         ar: "المتجر"     },
  { href: "products?sort=new",  en: "New Arrivals",  ar: "وصل حديثاً" },
  { href: "products?sale=true", en: "Sale",          ar: "تخفيضات"    },
  { href: "blog",               en: "Blog",          ar: "المدونة"    },
];

export default function Header({ locale, user }: HeaderProps) {
  const isAr = locale === "ar";
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* ── Main Nav ── */}
      <nav
        className="border-b border-white/20"
        style={{
          background: "linear-gradient(135deg, oklch(0.82 0.09 240) 0%, oklch(0.74 0.14 225) 50%, oklch(0.65 0.17 215) 100%)",
          boxShadow: "0 4px 24px -4px oklch(0.55 0.15 215 / 35%), inset 0 1px 0 rgba(255,255,255,0.35)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[4.5rem]">
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="flex-shrink-0 group"
            >
              <img
                src="/logo.png"
                alt={isAr ? "نيو ستار سبورتس" : "NewStarSports"}
                className="h-8 sm:h-10 w-auto transition-all duration-200 group-hover:scale-105 drop-shadow"
              />
            </Link>

            {/* Nav Links — desktop center */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-black">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}/${link.href}`}
                  className="px-4 py-2 rounded-full text-white/85 hover:text-white hover:bg-white/20 transition-all duration-200"
                >
                  {isAr ? link.ar : link.en}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Language Toggle — clay pill */}
              <Link
                href={`/${locale === "ar" ? "en" : "ar"}`}
                className="hidden sm:flex items-center justify-center h-8 px-3.5 rounded-full text-xs font-black bg-white/20 text-white hover:bg-white/35 transition-all duration-200"
                style={{ boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4)" }}
              >
                {isAr ? "EN" : "AR"}
              </Link>

              {/* Search — desktop inline, mobile icon */}
              <div className="hidden md:block">
                <SearchBar locale={locale} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 rounded-full text-white/85 hover:text-white hover:bg-white/20 transition-all duration-200"
                onClick={() => setSearchOpen(true)}
                aria-label={isAr ? "بحث" : "Search"}
              >
                <Search size={18} />
              </Button>

              {/* Wishlist — clay circle */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-white/85 hover:text-white hover:bg-white/20 transition-all duration-200"
                asChild
              >
                <Link href={`/${locale}/account/wishlist`} aria-label={isAr ? "المفضلات" : "Wishlist"}>
                  <Heart size={18} />
                </Link>
              </Button>

              {/* Cart */}
              <CartButton locale={locale} scrolled={true} />

              <div className="h-5 w-px mx-0.5 hidden sm:block bg-white/25" />

              {/* Account */}
              <AccountButton locale={locale} user={user} scrolled={true} />
            </div>
          </div>
        </div>
      </nav>
    </header>
      <SearchOverlay locale={locale} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
