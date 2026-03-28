import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { SearchBar } from "./search-bar";
import { CartButton } from "./cart-button";
import { AccountButton } from "./account-button";
import { getSetting } from "@nss/db/queries";
import { 
  IconHeart, 
  IconSparkles
} from "@tabler/icons-react";
import { Button } from "@/components/ui";

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
  
  const annSettings = await getSetting("announcement_bar");
  const showAnn = annSettings?.enabled && annSettings.messages.some(m => m.enabled);

  return (
    <header className="sticky top-0 z-50">
      {/* ── Announcement Bar ── */}
      {showAnn && (
        <div 
          className="text-center py-2 px-4 text-[11px] sm:text-xs font-semibold uppercase tracking-wider overflow-hidden shadow-sm"
          style={{ 
            backgroundColor: annSettings.bg_color || 'hsl(var(--primary))',
            color: annSettings.text_color || '#FFFFFF'
          }}
        >
          <div className="flex items-center justify-center gap-4 animate-in slide-in-from-top-full duration-700">
            {annSettings.messages
              .filter(m => m.enabled)
              .map((msg, idx) => (
                <span key={idx} className={cn("flex items-center gap-2", idx > 0 ? "hidden md:flex" : "flex")}>
                   <IconSparkles size={14} className="opacity-70" stroke={2} />
                   {isAr ? msg.text_ar : msg.text_en}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* ── Main Nav ── */}
      <nav className="bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-1 group-hover:rotate-0 transition-transform">
                <span className="text-xl sm:text-2xl text-white font-black">★</span>
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xl sm:text-2xl font-black text-primary tracking-tighter">
                  {isAr ? "نيو ستار" : "NewStar"}
                </span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em]">
                  {isAr ? "سبورتس" : "Sports"}
                </span>
              </div>
            </Link>

            {/* Search Bar - Center */}
            <div className="flex-1 max-w-lg mx-6 hidden md:block">
              <SearchBar locale={locale} />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Language Toggle */}
              <Link
                href={`/${locale === "ar" ? "en" : "ar"}`}
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-xs font-bold text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent hover:border-border/40 transition-all duration-200"
              >
                {isAr ? "EN" : "AR"}
              </Link>

              {/* Wishlist */}
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/5" asChild>
                <Link href={`/${locale}/account/wishlist`} aria-label={isAr ? "المفضلات" : "Wishlist"}>
                  <IconHeart size={22} stroke={1.5} />
                </Link>
              </Button>

              {/* Cart */}
              <CartButton locale={locale} />

              <div className="h-6 w-px bg-border/40 mx-1 hidden sm:block" />

              {/* Account / Login */}
              <AccountButton locale={locale} user={user} />
            </div>
          </div>
        </div>

        {/* ── Category Nav Bar ── */}
        <div className="border-t border-border/40 bg-muted/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8 overflow-x-auto scrollbar-none py-3 text-[13px] font-semibold">
              <Link href={`/${locale}/products`} className="whitespace-nowrap text-primary hover:opacity-80 transition-opacity flex items-center gap-1.5 uppercase tracking-wide">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {isAr ? "الكل" : "Shop All"}
              </Link>
              <Link href={`/${locale}/products?sort=new`} className="whitespace-nowrap text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5">
                {isAr ? "وصل حديثاً" : "New Arrivals"}
              </Link>
              <Link href={`/${locale}/products?sale=true`} className="whitespace-nowrap text-accent hover:opacity-80 transition-opacity flex items-center gap-1.5">
                {isAr ? "تخفيضات" : "Sale"}
                <span className="text-[10px] bg-accent/10 px-1.5 rounded-full">🔥</span>
              </Link>
              <div className="h-4 w-px bg-border/40 hidden sm:block" />
              <Link href={`/${locale}/category/building-construction`} className="whitespace-nowrap text-muted-foreground hover:text-foreground transition-all">
                {isAr ? "البناء" : "Building"}
              </Link>
              <Link href={`/${locale}/category/dolls-accessories`} className="whitespace-nowrap text-muted-foreground hover:text-foreground transition-all">
                {isAr ? "الدمى" : "Dolls"}
              </Link>
              <Link href={`/${locale}/category/outdoor-sports`} className="whitespace-nowrap text-muted-foreground hover:text-foreground transition-all">
                {isAr ? "خارجي" : "Outdoor"}
              </Link>
              <div className="h-4 w-px bg-border/40 hidden sm:block" />
              <Link href={`/${locale}/brand/lego`} className="whitespace-nowrap text-muted-foreground hover:text-foreground transition-all uppercase tracking-tighter opacity-80 hover:opacity-100 italic">
                LEGO
              </Link>
              <Link href={`/${locale}/brand/barbie`} className="whitespace-nowrap text-muted-foreground hover:text-foreground transition-all uppercase tracking-tighter opacity-80 hover:opacity-100 italic">
                Barbie
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

import { cn } from "@/lib/utils";
