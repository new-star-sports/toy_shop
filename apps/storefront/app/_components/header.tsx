import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { SearchBar } from "./search-bar";
import { CartButton } from "./cart-button";

import { getSetting } from "@nss/db/queries";

interface HeaderProps {
  locale: Locale;
  user?: {
    email?: string;
    user_metadata?: {
      full_name?: string;
    };
  } | null;
}

export default async function Header({ locale, user }: HeaderProps) {
  const isAr = locale === "ar";
  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split("@")[0];
  
  const annSettings = await getSetting("announcement_bar");
  const showAnn = annSettings?.enabled && annSettings.messages.some(m => m.enabled);

  return (
    <header className="sticky top-0 z-50">
      {/* ── Announcement Bar ── */}
      {showAnn && (
        <div 
          className="text-center py-2 px-4 text-sm font-medium overflow-hidden"
          style={{ 
            backgroundColor: annSettings.bg_color || "var(--nss-primary)",
            color: annSettings.text_color || "#FFFFFF"
          }}
        >
          <div className="flex items-center justify-center gap-4 animate-in fade-in duration-500">
            {annSettings.messages
              .filter(m => m.enabled)
              .map((msg, idx) => (
                <span key={idx} className={idx > 0 ? "hidden md:inline" : ""}>
                   {isAr ? msg.text_ar : msg.text_en}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* ── Main Nav ── */}
      <nav className="bg-nss-card border-b border-nss-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2 min-h-0 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-nss-primary flex items-center justify-center flex-shrink-0">
                <span className="text-xl text-white font-bold">★</span>
              </div>
              <span className="text-lg font-bold text-nss-primary hidden sm:block">
                {isAr ? "نيو ستار سبورتس" : "NewStarSports"}
              </span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <SearchBar locale={locale} />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Language Toggle */}
              <Link
                href={`/${locale === "ar" ? "en" : "ar"}`}
                className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-nss-text-secondary hover:bg-nss-surface transition-colors min-h-0 min-w-0"
              >
                {isAr ? "EN" : "عربي"}
              </Link>

              {/* Wishlist */}
              <Link
                href={`/${locale}/account/wishlist`}
                className="relative p-2 rounded-lg text-nss-text-secondary hover:bg-nss-surface transition-colors min-h-0 min-w-0"
                aria-label={isAr ? "المفضلات" : "Wishlist"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>

              {/* Cart */}
              <CartButton locale={locale} />

              {/* Account */}
              {user ? (
                <Link
                  href={`/${locale}/account/profile`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-nss-text-secondary hover:bg-nss-surface transition-colors min-h-0 min-w-0"
                  aria-label={isAr ? "الحساب" : "Account"}
                >
                  <div className="w-8 h-8 rounded-full bg-nss-primary/10 flex items-center justify-center text-nss-primary font-bold text-xs">
                    {userDisplayName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block text-xs font-medium max-w-[100px] truncate">
                    {userDisplayName}
                  </span>
                </Link>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  className="p-2 rounded-lg text-nss-text-secondary hover:bg-nss-surface transition-colors min-h-0 min-w-0"
                  aria-label={isAr ? "تسجيل الدخول" : "Login"}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── Category Nav Bar ── */}
        <div className="border-t border-nss-border bg-nss-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6 overflow-x-auto scrollbar-none py-2 text-sm">
              <Link href={`/${locale}/products`} className="whitespace-nowrap font-medium text-nss-primary hover:text-nss-accent transition-colors min-h-0 min-w-0">
                {isAr ? "جميع المنتجات" : "All Products"}
              </Link>
              <Link href={`/${locale}/products?sort=new`} className="whitespace-nowrap text-nss-text-secondary hover:text-nss-accent transition-colors min-h-0 min-w-0">
                {isAr ? "وصل حديثاً" : "New Arrivals"}
              </Link>
              <Link href={`/${locale}/products?sale=true`} className="whitespace-nowrap text-nss-accent font-semibold hover:text-nss-primary transition-colors min-h-0 min-w-0">
                {isAr ? "تخفيضات 🔥" : "Sale 🔥"}
              </Link>
              <Link href={`/${locale}/category/building-construction`} className="whitespace-nowrap text-nss-text-secondary hover:text-nss-accent transition-colors min-h-0 min-w-0">
                {isAr ? "البناء والتركيب" : "Building & Construction"}
              </Link>
              <Link href={`/${locale}/category/dolls-accessories`} className="whitespace-nowrap text-nss-text-secondary hover:text-nss-accent transition-colors min-h-0 min-w-0">
                {isAr ? "دمى وإكسسوارات" : "Dolls & Accessories"}
              </Link>
              <Link href={`/${locale}/category/outdoor-sports`} className="whitespace-nowrap text-nss-text-secondary hover:text-nss-accent transition-colors min-h-0 min-w-0">
                {isAr ? "ألعاب خارجية" : "Outdoor & Sports"}
              </Link>
              <Link href={`/${locale}/brand/lego`} className="whitespace-nowrap text-nss-text-secondary hover:text-nss-accent transition-colors min-h-0 min-w-0">
                LEGO
              </Link>
              <Link href={`/${locale}/brand/barbie`} className="whitespace-nowrap text-nss-text-secondary hover:text-nss-accent transition-colors min-h-0 min-w-0">
                Barbie
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
