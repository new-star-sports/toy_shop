import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/account/logout-button";
import type { Locale } from "@/lib/i18n";
import { User, Package, MapPin, Heart } from "lucide-react";

export default async function ProfilePage({
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
    redirect(`/${locale}?auth=login&redirect=${encodeURIComponent(`/${locale}/account/profile`)}`);
  }

  const initials = (user.user_metadata?.full_name as string || user.email || "U")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navLinks = [
    { href: `/${locale}/account/profile`, icon: User, en: "Profile", ar: "الملف الشخصي", active: true },
    { href: `/${locale}/account/orders`, icon: Package, en: "My Orders", ar: "طلباتي", active: false },
    { href: `/${locale}/account/wishlist`, icon: Heart, en: "Wishlist", ar: "المفضلات", active: false },
    { href: `/${locale}/account/addresses`, icon: MapPin, en: "Address Book", ar: "دفتر العناوين", active: false },
  ];

  const fields = [
    { label: isAr ? "الاسم الكامل" : "Full Name", value: user.user_metadata?.full_name || "—" },
    { label: isAr ? "البريد الإلكتروني" : "Email", value: user.email },
    { label: isAr ? "رقم الهاتف" : "Phone", value: user.user_metadata?.phone || "—" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">{isAr ? "حسابي" : "My Account"}</h1>
        <p className="text-sm text-muted-foreground mt-1">{isAr ? "إدارة معلومات حسابك وطلباتك" : "Manage your account information and orders"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    ? "bg-clay-lavender text-clay-lavender-deep"
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

        {/* Profile Content */}
        <div className="md:col-span-2">
          <div className="clay-shadow-sky rounded-[2rem] bg-white p-6 space-y-1">
            <h2 className="text-base font-black text-foreground mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-clay-sky flex items-center justify-center">
                <User size={14} className="text-clay-sky-deep" />
              </span>
              {isAr ? "المعلومات الشخصية" : "Personal Information"}
            </h2>
            {fields.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-border/20 last:border-0">
                <span className="text-sm font-black text-muted-foreground w-1/3">{label}</span>
                <span className="text-sm text-foreground font-medium flex-1 text-end">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
