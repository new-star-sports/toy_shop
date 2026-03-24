import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "../_components/header";
import Footer from "../_components/footer";
import MobileBottomNav from "../_components/mobile-bottom-nav";
import { CartDrawer } from "./_components/cart/cart-drawer";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/i18n";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | NewStarSports — نيو ستار سبورتس",
    default: "NewStarSports — Kuwait's Home for Toys | نيو ستار سبورتس",
  },
  description:
    "Shop toys, games, and educational products in Kuwait. Free delivery, genuine products, easy returns. تسوق الألعاب في الكويت.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

type Params = Promise<{ locale: string }>;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { locale } = await params;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col pb-16 sm:pb-0 selection:bg-primary/10 selection:text-primary">
        <Header locale={locale as Locale} user={user} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale as Locale} />
        <MobileBottomNav locale={locale as Locale} />
        <CartDrawer locale={locale as Locale} />
      </body>
    </html>
  );
}
