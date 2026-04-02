"use client";

import Link from "next/link";
import { SearchBar } from "./search-bar";
import { CartButton } from "./cart-button";
import { AccountButton } from "./account-button";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  locale: Locale;
  user?: User | null;
}

export default function Header({ locale, user }: HeaderProps) {
  const isAr = locale === "ar";
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* ── Main Nav ── */}
      <nav style={{ background: "var(--gradient-header)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/20">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="flex-shrink-0 group"
            >
              <img
                src="/logo.png"
                alt={isAr ? "نيو ستار سبورتس" : "NewStarSports"}
                className="h-8 sm:h-10 w-auto transition-opacity group-hover:opacity-80"
              />
            </Link>

            {/* Nav Links — desktop center */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
              {[
                { href: `/${locale}/products`, en: "Shop", ar: "المتجر" },
                { href: `/${locale}/products?sort=new`, en: "New Arrivals", ar: "وصل حديثاً" },
                { href: `/${locale}/products?sale=true`, en: "Sale", ar: "تخفيضات" },
                { href: `/${locale}/blog`, en: "Blog", ar: "المدونة" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors text-white/80 hover:text-white"
                >
                  {isAr ? link.ar : link.en}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Language Toggle */}
              <Link
                href={`/${locale === "ar" ? "en" : "ar"}`}
                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold border text-white border-white/30 hover:bg-white/15 transition-all duration-200"
              >
                {isAr ? "EN" : "AR"}
              </Link>

              {/* Search */}
              <div className="hidden md:block">
                <SearchBar locale={locale} />
              </div>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full transition-colors text-white/80 hover:text-white hover:bg-white/15"
                asChild
              >
                <Link href={`/${locale}/account/wishlist`} aria-label={isAr ? "المفضلات" : "Wishlist"}>
                  <Heart size={20} />
                </Link>
              </Button>

              {/* Cart */}
              <CartButton locale={locale} scrolled={true} />

              <div className="h-5 w-px mx-1 hidden sm:block bg-white/25" />

              {/* Account */}
              <AccountButton locale={locale} user={user} scrolled={true} />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
