import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getWishlistProducts } from "@nss/db/queries";
import LogoutButton from "@/components/account/logout-button";
import type { Locale } from "@/lib/i18n";
import { User, Package, MapPin, Heart } from "lucide-react";
import ProductCard from "@/app/_components/product-card";

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}?auth=login&redirect=${encodeURIComponent(`/${locale}/account/wishlist`)}`);
  }

  const wishlistProducts = await getWishlistProducts(user.id);

  const initials = (user.user_metadata?.full_name as string || user.email || "U")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navLinks = [
    { href: `/${locale}/account/profile`, icon: User, en: "Profile", ar: "الملف الشخصي", active: false },
    { href: `/${locale}/account/orders`, icon: Package, en: "My Orders", ar: "طلباتي", active: false },
    { href: `/${locale}/account/wishlist`, icon: Heart, en: "Wishlist", ar: "المفضلات", active: true },
    { href: `/${locale}/account/addresses`, icon: MapPin, en: "Address Book", ar: "دفتر العناوين", active: false },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">{isAr ? "المفضلات" : "My Wishlist"}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isAr ? "المنتجات التي قمت بحفظها" : "Products you have saved for later"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          {/* Avatar card */}
          <div className="clay-shadow-lavender rounded-[2rem] bg-white p-5 text-center">
            <div className="w-16 h-16 rounded-full bg-clay-lavender clay-shadow-lavender flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-black text-clay-lavender-deep">{initials}</span>
            </div>
            <p className="font-black text-foreground text-sm truncate">{user.user_metadata?.full_name || user.email}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>

          {/* Nav */}
          <div className="clay-shadow-white rounded-[2rem] bg-white p-3 space-y-1">
            {navLinks.map(({ href, icon: Icon, en, ar, active }) => (
              <a
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  active
                    ? "bg-clay-lavender text-clay-lavender-deep shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                {isAr ? ar : en}
              </a>
            ))}
          </div>

          <LogoutButton />
        </div>

        {/* Wishlist Content */}
        <div className="md:col-span-3">
          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-muted">
              <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                <Heart size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-black text-foreground">
                {isAr ? "قائمة المفضلات فارغة" : "Your wishlist is empty"}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {isAr ? "ابدأ بإضافة بعض المنتجات التي تحبها!" : "Start adding some products you love!"}
              </p>
              <a
                href={`/${locale}/products`}
                className="px-8 py-3 bg-primary text-white font-black rounded-full text-sm hover:scale-105 transition-all clay-shadow-sky"
              >
                {isAr ? "اكتشف المنتجات" : "Browse Products"}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
