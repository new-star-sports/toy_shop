import Link from "next/link";
import type { Locale } from "@/lib/i18n";

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const isAr = locale === "ar";

  return (
    <header className="sticky top-0 z-50">
      {/* ── Announcement Bar ── */}
      <div className="bg-nss-primary text-white text-center py-2 px-4 text-sm">
        <p>
          {isAr
            ? "توصيل مجاني للطلبات أعلى من 10 د.ك 🚚"
            : "Free delivery on orders above 10 KD 🚚"}
        </p>
      </div>

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
              <div className="relative">
                <input
                  type="search"
                  placeholder={isAr ? "ابحث عن ألعاب..." : "Search for toys..."}
                  className="w-full h-10 pl-10 rtl:pr-10 rtl:pl-4 pr-4 rounded-full border border-nss-border bg-nss-surface text-sm focus:outline-none focus:ring-2 focus:ring-nss-primary/20 focus:border-nss-primary transition-all"
                />
                <svg
                  className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-nss-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
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
              <Link
                href={`/${locale}/cart`}
                className="relative p-2 rounded-lg text-nss-text-secondary hover:bg-nss-surface transition-colors min-h-0 min-w-0"
                aria-label={isAr ? "السلة" : "Cart"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 rtl:-left-0.5 rtl:right-auto w-4 h-4 rounded-full bg-nss-accent text-white text-[10px] flex items-center justify-center font-bold">
                  0
                </span>
              </Link>

              {/* Account */}
              <Link
                href={`/${locale}/login`}
                className="p-2 rounded-lg text-nss-text-secondary hover:bg-nss-surface transition-colors min-h-0 min-w-0"
                aria-label={isAr ? "الحساب" : "Account"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
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
