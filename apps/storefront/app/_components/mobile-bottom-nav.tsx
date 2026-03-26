"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { type Locale } from "@/lib/i18n";

interface MobileBottomNavProps {
  locale: Locale;
}

export default function MobileBottomNav({ locale }: MobileBottomNavProps) {
  const isAr = locale === "ar";
  const cartItemCount = useCartStore().getTotalItems();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16">
        <Link href={`/${locale}`} className="flex flex-col items-center gap-1 min-w-0 min-h-0 px-2 py-1 text-muted-foreground hover:text-primary">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-medium">{isAr ? "الرئيسية" : "Home"}</span>
        </Link>
        <Link href={`/${locale}/products`} className="flex flex-col items-center gap-1 min-w-0 min-h-0 px-2 py-1 text-muted-foreground hover:text-primary">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-[10px] font-medium">{isAr ? "الأقسام" : "Categories"}</span>
        </Link>
        <Link href={`/${locale}/cart`} className="relative flex flex-col items-center gap-1 min-w-0 min-h-0 px-2 py-1 text-muted-foreground hover:text-primary">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="absolute top-1 right-4 w-4 h-4 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-bold">{cartItemCount}</span>
          <span className="text-[10px] font-medium">{isAr ? "السلة" : "Cart"}</span>
        </Link>
        <Link href={`/${locale}/account/wishlist`} className="flex flex-col items-center gap-1 min-w-0 min-h-0 px-2 py-1 text-muted-foreground hover:text-primary">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-[10px] font-medium">{isAr ? "المفضلة" : "Wishlist"}</span>
        </Link>
        <Link href={`/${locale}/login`} className="flex flex-col items-center gap-1 min-w-0 min-h-0 px-2 py-1 text-muted-foreground hover:text-primary">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[10px] font-medium">{isAr ? "حسابي" : "Account"}</span>
        </Link>
      </div>
    </nav>
  );
}
