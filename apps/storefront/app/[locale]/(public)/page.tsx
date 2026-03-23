import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getHeroBanners, getHomepagePinnedCategories, getFeaturedBrands, getNewArrivals, getFlashSaleProducts, getHomepageFeatured } from "@nss/db/queries";
import { getSetting } from "@nss/db/queries";
import ProductCardComponent from "../../_components/product-card";
import { FlashSaleBanner } from "../../_components/flash-sale-banner";
import { getActiveFlashSale } from "@/lib/marketing";
import { getBlogs, type Blog } from "@nss/db/queries";
import { format } from "date-fns";
import { ChevronRight, FileText } from "lucide-react";

type Params = Promise<{ locale: string }>;

export default async function HomePage({ params }: { params: Params }) {
  const { locale: localeStr } = await params;
  const locale = localeStr as Locale;
  const isAr = locale === "ar";

  // Fetch data in parallel
  const [
    heroBanners,
    trustBarSettings,
    pinnedCategories,
    featuredBrands,
    newArrivals,
    flashSaleProducts,
    homepageFeatured,
    activeFlashSale,
    blogs,
  ] = await Promise.all([
    getHeroBanners(),
    getSetting("trust_bar"),
    getHomepagePinnedCategories(),
    getFeaturedBrands(),
    getNewArrivals(10),
    getFlashSaleProducts(8),
    getHomepageFeatured(8),
    getActiveFlashSale(),
    getBlogs({ publishedOnly: true }),
  ]);

  return (
    <>
      {activeFlashSale && (
        <FlashSaleBanner
          endTime={activeFlashSale.endTime}
          titleEn={activeFlashSale.titleEn}
          titleAr={activeFlashSale.titleAr}
          locale={locale}
        />
      )}
      {/* ── Section 02: Hero Banner ── */}
      <section id="hero" className="relative bg-gradient-to-br from-nss-primary to-nss-primary/90 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          {heroBanners && heroBanners.length > 0 ? (
            <div className="max-w-2xl space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {isAr ? heroBanners[0].title_ar : heroBanners[0].title_en}
              </h1>
              <p className="text-lg sm:text-xl text-white/80">
                {isAr ? heroBanners[0].subtitle_ar : heroBanners[0].subtitle_en}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={heroBanners[0].cta_link || `/${locale}/products`}
                  className="inline-flex items-center px-6 py-3 bg-nss-accent text-white font-semibold rounded-full hover:bg-nss-accent/90 transition-all hover:scale-105 shadow-lg shadow-nss-accent/25 min-h-0 min-w-0"
                >
                  {isAr ? heroBanners[0].cta_text_ar : heroBanners[0].cta_text_en}
                  <svg className="w-4 h-4 ms-2 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                {heroBanners[0].cta2_text_en && (
                  <Link
                    href={heroBanners[0].cta2_link || `/${locale}/products`}
                    className="inline-flex items-center px-6 py-3 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all min-h-0 min-w-0"
                  >
                    {isAr ? heroBanners[0].cta2_text_ar : heroBanners[0].cta2_text_en}
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {isAr
                  ? "مرحباً بكم في نيو ستار سبورتس"
                  : "Welcome to NewStarSports"}
              </h1>
              <p className="text-lg sm:text-xl text-white/80">
                {isAr
                  ? "وجهتك للألعاب في الكويت — تسوق أحدث المنتجات الأصلية والمرخصة"
                  : "Kuwait's home for toys — Shop the latest genuine, licensed products"}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex items-center px-6 py-3 bg-nss-accent text-white font-semibold rounded-full hover:bg-nss-accent/90 transition-all hover:scale-105 shadow-lg shadow-nss-accent/25 min-h-0 min-w-0"
                >
                  {isAr ? "تسوق الآن" : "Shop Now"}
                  <svg className="w-4 h-4 ms-2 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href={`/${locale}/products?sort=new`}
                  className="inline-flex items-center px-6 py-3 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all min-h-0 min-w-0"
                >
                  {isAr ? "وصل حديثاً" : "New Arrivals"}
                </Link>
              </div>
            </div>
          )}
        </div>
        {/* Decorative */}
        <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto w-1/2 h-full opacity-10">
          <div className="absolute inset-0 bg-gradient-to-l rtl:bg-gradient-to-r from-transparent to-nss-primary" />
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,107,43,0.3)_0%,transparent_70%)]" />
        </div>
      </section>

      {/* ── Section 03: Trust Bar ── */}
      {trustBarSettings?.enabled && (
        <section id="trust-bar" className="bg-nss-card border-y border-nss-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {trustBarSettings.items.filter((i) => i.enabled).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 justify-center text-center sm:text-start sm:justify-start">
                  <div className="w-10 h-10 rounded-full bg-nss-primary/5 flex items-center justify-center flex-shrink-0">
                    {item.icon === "truck" && <svg className="w-5 h-5 text-nss-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>}
                    {item.icon === "shield" && <svg className="w-5 h-5 text-nss-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                    {item.icon === "refresh" && <svg className="w-5 h-5 text-nss-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                    {item.icon === "map" && <svg className="w-5 h-5 text-nss-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    {item.icon === "help" && <svg className="w-5 h-5 text-nss-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-nss-text-primary">
                    {isAr ? item.text_ar : item.text_en}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 04: Flash Sale ── */}
      {flashSaleProducts.length > 0 && (
        <section id="flash-sale" className="bg-nss-accent py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  🔥 {isAr ? "تخفيضات سريعة" : "Flash Sale"}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  {isAr ? "عروض لفترة محدودة" : "Limited time offers"}
                </p>
              </div>
              <Link
                href={`/${locale}/products?sale=true`}
                className="text-sm font-semibold text-white border border-white/30 px-4 py-2 rounded-full hover:bg-white/10 transition-colors min-h-0 min-w-0"
              >
                {isAr ? "عرض الكل" : "View All →"}
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {flashSaleProducts.slice(0, 4).map((product) => (
                <ProductCardComponent key={product.id} product={product} locale={locale} flashSaleActive={!!activeFlashSale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 05: Shop by Category ── */}
      <section id="categories" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-nss-text-primary">
              {isAr ? "تسوق حسب الفئة" : "Shop by Category"}
            </h2>
            <p className="text-nss-text-secondary mt-2">
              {isAr ? "اختر الفئة المناسبة لعمر طفلك" : "Find the perfect toys for every age"}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {pinnedCategories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/category/${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-nss-primary/5 to-nss-primary/10 border border-nss-border hover:border-nss-primary/30 transition-all duration-300 hover:shadow-md"
              >
                <div className="aspect-[4/3] flex items-center justify-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-nss-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🧸</span>
                  </div>
                </div>
                <div className="p-4 pt-0 text-center">
                  <h3 className="font-semibold text-nss-text-primary group-hover:text-nss-primary transition-colors">
                    {isAr ? cat.name_ar : cat.name_en}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 06: New Arrivals ── */}
      {newArrivals.length > 0 && (
        <section id="new-arrivals" className="py-12 bg-nss-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-nss-text-primary">
                  {isAr ? "وصل حديثاً" : "New Arrivals"}
                </h2>
                <p className="text-nss-text-secondary mt-1 text-sm">
                  {isAr ? "أحدث المنتجات في المتجر" : "The latest additions to our store"}
                </p>
              </div>
              <Link
                href={`/${locale}/products?sort=new`}
                className="text-sm font-semibold text-nss-primary hover:text-nss-accent transition-colors min-h-0 min-w-0"
              >
                {isAr ? "عرض الكل ←" : "View All →"}
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {newArrivals.slice(0, 5).map((product) => (
                <ProductCardComponent key={product.id} product={product} locale={locale} flashSaleActive={!!activeFlashSale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 07: Brands Strip ── */}
      {featuredBrands.length > 0 && (
        <section id="brands" className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-xl font-semibold text-nss-text-primary mb-6">
              {isAr ? "تسوق حسب الماركة" : "Shop by Brand"}
            </h2>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {featuredBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/${locale}/brand/${brand.slug}`}
                  className="px-6 py-3 bg-nss-card border border-nss-border rounded-full text-sm font-semibold text-nss-text-primary hover:border-nss-primary hover:text-nss-primary hover:shadow-sm transition-all min-h-0 min-w-0"
                >
                  {isAr ? brand.name_ar : brand.name_en}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 08: Editorial Banner ── */}
      <section id="editorial" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-nss-primary to-nss-primary/80 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
              <div className="flex flex-col justify-center space-y-4">
                <span className="text-nss-accent font-semibold text-sm uppercase tracking-wider">
                  {isAr ? "مجموعة مميزة" : "Featured Collection"}
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-white">
                  {isAr ? "ألعاب تعليمية تنمي مهارات طفلك" : "Educational Toys That Build Skills"}
                </h2>
                <p className="text-white/80">
                  {isAr
                    ? "اكتشف مجموعتنا المختارة من الألعاب التعليمية التي تجمع بين المتعة والتعلم"
                    : "Discover our curated collection of educational toys that combine fun with learning"}
                </p>
                <Link
                  href={`/${locale}/category/educational-toys`}
                  className="inline-flex items-center self-start px-6 py-3 bg-nss-accent text-white font-semibold rounded-full hover:bg-nss-accent/90 transition-all min-h-0 min-w-0"
                >
                  {isAr ? "تسوق الآن" : "Shop Collection"}
                  <svg className="w-4 h-4 ms-2 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-64 h-64 rounded-3xl bg-white/10 flex items-center justify-center">
                  <span className="text-7xl">🎓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 09: Shop by Age Group ── */}
      <section id="age-groups" className="py-12 bg-nss-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-nss-text-primary text-center mb-8">
            {isAr ? "تسوق حسب الفئة العمرية" : "Shop by Age Group"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { range: "0–2", label_en: "0–2 years", label_ar: "من 0 إلى 2 سنوات", emoji: "👶" },
              { range: "3–5", label_en: "3–5 years", label_ar: "من 3 إلى 5 سنوات", emoji: "🧒" },
              { range: "6–8", label_en: "6–8 years", label_ar: "من 6 إلى 8 سنوات", emoji: "🧑" },
              { range: "9–12", label_en: "9–12 years", label_ar: "من 9 إلى 12 سنة", emoji: "🧑‍🎓" },
              { range: "13+", label_en: "13+ years", label_ar: "13+ سنة", emoji: "🧑‍💻" },
            ].map((age) => (
              <Link
                key={age.range}
                href={`/${locale}/products?age=${age.range}`}
                className="group flex flex-col items-center gap-3 p-6 bg-nss-surface rounded-2xl border border-nss-border hover:border-nss-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-nss-primary/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {age.emoji}
                </div>
                <span className="text-sm font-semibold text-nss-text-primary group-hover:text-nss-primary transition-colors ltr-nums">
                  {isAr ? age.label_ar : age.label_en}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 10: Double Promo Banner ── */}
      <section id="promo-banners" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href={`/${locale}/brand/lego`}
              className="group relative rounded-2xl overflow-hidden bg-[#FFD700]/10 border border-nss-border hover:shadow-lg transition-all"
            >
              <div className="p-8 space-y-3">
                <span className="text-4xl">🧱</span>
                <h3 className="text-xl font-bold text-nss-text-primary group-hover:text-nss-primary transition-colors">
                  {isAr ? "عروض ليغو" : "LEGO Deals"}
                </h3>
                <p className="text-sm text-nss-text-secondary">
                  {isAr ? "خصم حتى 30% على مجموعات مختارة" : "Up to 30% off selected sets"}
                </p>
                <span className="inline-flex items-center text-sm font-semibold text-nss-accent min-h-0 min-w-0">
                  {isAr ? "تسوق الآن" : "Shop Now →"}
                </span>
              </div>
            </Link>
            <Link
              href={`/${locale}/category/outdoor-sports`}
              className="group relative rounded-2xl overflow-hidden bg-nss-success/5 border border-nss-border hover:shadow-lg transition-all"
            >
              <div className="p-8 space-y-3">
                <span className="text-4xl">⚽</span>
                <h3 className="text-xl font-bold text-nss-text-primary group-hover:text-nss-primary transition-colors">
                  {isAr ? "ألعاب خارجية" : "Outdoor Fun"}
                </h3>
                <p className="text-sm text-nss-text-secondary">
                  {isAr ? "استعد للصيف مع ألعابنا الخارجية" : "Get summer-ready with outdoor toys"}
                </p>
                <span className="inline-flex items-center text-sm font-semibold text-nss-accent min-h-0 min-w-0">
                  {isAr ? "تسوق الآن" : "Shop Now →"}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 11: Best Sellers / Featured Products ── */}
      {homepageFeatured.length > 0 && (
        <section id="best-sellers" className="py-12 bg-nss-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-nss-text-primary">
                  {isAr ? "الأكثر مبيعاً" : "Best Sellers"}
                </h2>
                <p className="text-nss-text-secondary mt-1 text-sm">
                  {isAr ? "المنتجات الأكثر شعبية" : "Our most popular products"}
                </p>
              </div>
              <Link
                href={`/${locale}/products?sort=best-sellers`}
                className="text-sm font-semibold text-nss-primary hover:text-nss-accent transition-colors min-h-0 min-w-0"
              >
                {isAr ? "عرض الكل ←" : "View All →"}
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {homepageFeatured.slice(0, 8).map((product) => (
                <ProductCardComponent key={product.id} product={product} locale={locale} flashSaleActive={!!activeFlashSale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 12: Customer Reviews ── */}
      <section id="reviews" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-nss-text-primary">
              {isAr ? "آراء عملائنا" : "What Our Customers Say"}
            </h2>
            <div className="flex items-center justify-center gap-1 mt-3 text-nss-gold">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              <span className="text-sm text-nss-text-secondary ms-2 ltr-nums">4.8 / 5</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: isAr ? "فاطمة" : "Fatima", gov: isAr ? "حولي" : "Hawalli", text: isAr ? "ألعاب ممتازة وتوصيل سريع. أبنائي سعداء جداً!" : "Excellent toys and fast delivery. My kids are very happy!", rating: 5 },
              { name: isAr ? "أحمد" : "Ahmed", gov: isAr ? "العاصمة" : "Capital", text: isAr ? "منتجات أصلية ومضمونة. سأتسوق مرة أخرى بالتأكيد." : "Genuine guaranteed products. Will definitely shop again.", rating: 5 },
              { name: isAr ? "نورة" : "Noura", gov: isAr ? "الأحمدي" : "Ahmadi", text: isAr ? "تشكيلة رائعة من الألعاب التعليمية. أنصح بها بشدة!" : "Great selection of educational toys. Highly recommend!", rating: 4 },
              { name: isAr ? "محمد" : "Mohammed", gov: isAr ? "الفروانية" : "Farwaniya", text: isAr ? "خدمة عملاء ممتازة وأسعار مناسبة." : "Excellent customer service and fair prices.", rating: 5 },
            ].map((review, idx) => (
              <div key={idx} className="bg-nss-card border border-nss-border rounded-2xl p-5 space-y-3">
                <div className="flex text-nss-gold">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "fill-none stroke-current"}`} viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-nss-text-primary">{review.text}</p>
                <div className="flex items-center gap-2 text-xs text-nss-text-secondary">
                  <span className="w-6 h-6 rounded-full bg-nss-primary/10 flex items-center justify-center text-nss-primary font-semibold">
                    {review.name[0]}
                  </span>
                  <span className="font-medium">{review.name}</span>
                  <span>·</span>
                  <span>{review.gov}</span>
                  <svg className="w-3 h-3 text-nss-success" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 13: Gift Guides ── */}
      <section id="guides" className="py-12 bg-nss-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-nss-text-primary text-center mb-8">
            {isAr ? "دليل الهدايا" : "Gift Guides & Articles"}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title_en: "Best Toys for Eid 2025", title_ar: "أفضل ألعاب عيد 2025", tag_en: "Gift Guide", tag_ar: "دليل هدايا", time: "5 min" },
              { title_en: "Educational Toys by Age", title_ar: "ألعاب تعليمية حسب العمر", tag_en: "Education", tag_ar: "تعليم", time: "4 min" },
              { title_en: "Outdoor Activities for Summer", title_ar: "أنشطة خارجية للصيف", tag_en: "Seasonal", tag_ar: "موسمي", time: "3 min" },
            ].map((article, idx) => (
              <Link
                key={idx}
                href={`/${locale}/blog`}
                className="group block bg-nss-surface rounded-2xl border border-nss-border overflow-hidden hover:shadow-md transition-all"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-nss-primary/5 to-nss-primary/10 flex items-center justify-center">
                  <span className="text-5xl">{idx === 0 ? "🎁" : idx === 1 ? "📚" : "☀️"}</span>
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-xs font-semibold text-nss-accent">
                    {isAr ? article.tag_ar : article.tag_en}
                  </span>
                  <h3 className="font-semibold text-nss-text-primary group-hover:text-nss-primary transition-colors">
                    {isAr ? article.title_ar : article.title_en}
                  </h3>
                  <p className="text-xs text-nss-text-secondary ltr-nums">
                    {article.time} {isAr ? "قراءة" : "read"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 14: Loyalty Teaser ── */}
      <section id="loyalty" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-nss-gold/20 to-nss-accent/10 border border-nss-gold/20 p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-nss-text-primary mb-4">
              {isAr ? "برنامج الولاء — قريباً!" : "Loyalty Programme — Coming Soon!"}
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 mt-8 max-w-3xl mx-auto">
              {[
                { icon: "⭐", title_en: "Earn Points", title_ar: "اكسب نقاط", desc_en: "1 point per 0.100 KD spent", desc_ar: "1 نقطة لكل 0.100 د.ك" },
                { icon: "🎁", title_en: "Redeem Rewards", title_ar: "استبدل المكافآت", desc_en: "100 points = 1 KD", desc_ar: "100 نقطة = 1 د.ك" },
                { icon: "🎂", title_en: "Birthday Bonus", title_ar: "مكافأة عيد الميلاد", desc_en: "Special reward on your birthday", desc_ar: "مكافأة خاصة في عيد ميلادك" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="font-semibold text-nss-text-primary">{isAr ? item.title_ar : item.title_en}</h3>
                  <p className="text-sm text-nss-text-secondary ltr-nums">{isAr ? item.desc_ar : item.desc_en}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 15: Newsletter Signup ── */}
      <section id="newsletter" className="py-12 bg-nss-primary">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {isAr ? "انضم إلى قائمتنا البريدية" : "Join Our Newsletter"}
          </h2>
          <p className="text-white/80 mb-6">
            {isAr
              ? "احصل على أحدث العروض والمنتجات الجديدة مباشرة إلى بريدك"
              : "Get the latest deals and new products delivered to your inbox"}
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder={isAr ? "بريدك الإلكتروني" : "Your email address"}
              className="flex-1 h-12 px-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-nss-accent"
              required
            />
            <button
              type="submit"
              className="h-12 px-6 bg-nss-accent text-white font-semibold rounded-full hover:bg-nss-accent/90 transition-all min-h-0 min-w-0 text-sm"
            >
              {isAr ? "اشترك الآن" : "Subscribe"}
            </button>
          </form>
          <p className="text-xs text-white/50 mt-4">
            {isAr
              ? "بالاشتراك، أوافق على سياسة الخصوصية"
              : "By subscribing, you agree to our Privacy Policy"}
          </p>
        </div>
      </section>

      {/* ── Section 16: From the Blog ── */}
      {blogs && blogs.length > 0 && (
        <section id="blogs" className="py-20 bg-nss-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-extrabold text-nss-text-primary mb-2">
                  {isAr ? "من المدونة" : "From the Blog"}
                </h2>
                <p className="text-nss-text-secondary">
                  {isAr ? "أحدث الأخبار، المراجعات، والنصائح للأطفال." : "Latest news, reviews, and tips for kids."}
                </p>
              </div>
              <Link 
                href={`/${locale}/blog`} 
                className="text-nss-primary font-bold text-sm hover:underline flex items-center gap-1"
              >
                {isAr ? "عرض كل المقالات" : "View All Articles"}
                <ChevronRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.slice(0, 3).map((post: Blog) => (
                <article key={post.id} className="group bg-white rounded-2xl border border-nss-border overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                  <Link href={`/${locale}/blog/${post.slug}`} className="block aspect-[16/9] overflow-hidden bg-nss-surface">
                    {post.image_url ? (
                      <img 
                        src={post.image_url} 
                        alt={isAr ? post.title_ar : post.title_en} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-nss-text-secondary/20">
                        <FileText className="h-10 w-10" />
                      </div>
                    )}
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-[10px] font-bold text-nss-text-secondary uppercase tracking-widest mb-2">
                      {post.published_at ? format(new Date(post.published_at), "MMM d, yyyy") : "Draft"}
                    </div>
                    <h3 className="text-lg font-bold text-nss-text-primary mb-3 line-clamp-2 h-14 leading-snug group-hover:underline">
                      <Link href={`/${locale}/blog/${post.slug}`}>
                        {isAr ? post.title_ar : post.title_en}
                      </Link>
                    </h3>
                    <p className="text-nss-text-secondary text-sm line-clamp-2 mb-6 flex-1">
                      {isAr ? post.excerpt_ar : post.excerpt_en}
                    </p>
                    <Link 
                      href={`/${locale}/blog/${post.slug}`} 
                      className="inline-flex items-center text-xs font-bold text-nss-primary gap-1"
                    >
                      {isAr ? "اقرأ المزيد" : "Read More"}
                      <ChevronRight className={`h-3 w-3 ${isAr ? 'rotate-180' : ''}`} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
