"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { type Locale } from "@/lib/i18n";
import { Home, LayoutGrid, ShoppingBag, Heart, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AuthDialog } from "../[locale]/_components/auth-dialog";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface MobileBottomNavProps {
  locale: Locale;
  user?: SupabaseUser | null;
}

export default function MobileBottomNav({ locale, user }: MobileBottomNavProps) {
  const isAr = locale === "ar";
  const cartItemCount = useCartStore().getTotalItems();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  const navLinks = [
    { href: `/${locale}`, icon: Home, en: "Home", ar: "الرئيسية" },
    { href: `/${locale}/products`, icon: LayoutGrid, en: "Shop", ar: "المتجر" },
    { href: `/${locale}/account/wishlist`, icon: Heart, en: "Wishlist", ar: "المفضلة" },
  ];

  const ACTIVE_COLORS = [
    "text-clay-sky-deep bg-clay-sky",
    "text-clay-mint-deep bg-clay-mint",
    "text-clay-pink-deep bg-clay-pink",
    "text-clay-lavender-deep bg-clay-lavender",
  ];

  const accountActive = pathname.startsWith(`/${locale}/account`);

  return (
    <>
      <nav className="sm:hidden fixed bottom-3 left-3 right-3 z-50">
        <div
          className="flex items-center justify-around h-16 px-2 rounded-[2rem] bg-white"
          style={{
            boxShadow: "0 8px 32px -4px rgba(0,0,0,0.15), 0 2px 8px -2px rgba(0,0,0,0.08), inset 0 2px 4px 0 rgba(255,255,255,0.80)",
          }}
        >
          {navLinks.map(({ href, icon: Icon, en, ar }, idx) => {
            const active = pathname === href;
            const activeColor = ACTIVE_COLORS[idx % ACTIVE_COLORS.length];
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200",
                  active ? activeColor : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon size={21} strokeWidth={active ? 2.5 : 1.5} />
                <span className="text-[10px] font-black">{isAr ? ar : en}</span>
              </Link>
            );
          })}

          {/* Account — opens dialog if unauthenticated */}
          {user ? (
            <Link
              href={`/${locale}/account/profile`}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200",
                accountActive ? "text-clay-lavender-deep bg-clay-lavender" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <User size={21} strokeWidth={accountActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-black">{isAr ? "حسابي" : "Account"}</span>
            </Link>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl text-muted-foreground hover:text-clay-lavender-deep hover:bg-clay-lavender transition-all duration-200"
            >
              <User size={21} strokeWidth={1.5} />
              <span className="text-[10px] font-black">{isAr ? "دخول" : "Login"}</span>
            </button>
          )}

          {/* Cart with badge */}
          <button
            onClick={() => useCartStore.getState().toggleDrawer(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl text-muted-foreground hover:text-clay-peach-deep hover:bg-clay-peach transition-all duration-200 relative"
            aria-label={isAr ? "السلة" : "Cart"}
          >
            <ShoppingBag size={21} strokeWidth={1.5} />
            {mounted && cartItemCount > 0 && (
              <span className="absolute top-0.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-clay-coral text-clay-coral-deep text-[9px] flex items-center justify-center font-black clay-shadow-coral">
                {cartItemCount}
              </span>
            )}
            <span className="text-[10px] font-black">{isAr ? "السلة" : "Cart"}</span>
          </button>
        </div>
      </nav>

      {/* Auth dialog for unauthenticated mobile users */}
      {!user && (
        <AuthDialog
          locale={locale}
          open={authOpen}
          onOpenChange={setAuthOpen}
        />
      )}
    </>
  );
}
