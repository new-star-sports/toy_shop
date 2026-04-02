import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import {
  getHeroBanners,
  getHomepagePinnedCategories,
  getFeaturedBrands,
  getNewArrivals,
  getFlashSaleProducts,
  getHomepageFeatured,
  getEditorialBanner,
  getPromoBanners,
  getBlogs,
  type Blog,
} from "@nss/db/queries";
import { getActiveFlashSale } from "@/lib/marketing";
import { format } from "date-fns";
import { ArrowRight, FileText, Package } from "lucide-react";
import { HeroCarousel } from "../../_components/hero-carousel";
import { ProductSection } from "../../_components/product-section";
import { FlashSaleSection } from "../../_components/flash-sale-section";
import { EditorialBanner, SplitPromoBanners } from "../../_components/banner-section";

type Params = Promise<{ locale: string }>;

export default async function HomePage({ params }: { params: Params }) {
  const { locale: localeStr } = await params;
  const locale = localeStr as Locale;
  const isAr = locale === "ar";

  const [
    heroBanners,
    pinnedCategories,
    featuredBrands,
    newArrivals,
    flashSaleProducts,
    homepageFeatured,
    activeFlashSale,
    blogs,
    editorialBanner,
    promoBanners,
  ] = await Promise.all([
    getHeroBanners(),
    getHomepagePinnedCategories(),
    getFeaturedBrands(),
    getNewArrivals(10),
    getFlashSaleProducts(8),
    getHomepageFeatured(8),
    getActiveFlashSale(),
    getBlogs({ publishedOnly: true }),
    getEditorialBanner(),
    getPromoBanners(),
  ]);

  return (
    <>
      {/* ── HERO BANNER ── */}
      <section className="pt-6 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={promoBanners.length >= 2 ? "grid xl:grid-cols-[1fr_300px] gap-3" : "block"}>
            <HeroCarousel
              banners={heroBanners as any[]}
              locale={locale}
              aspectRatio="aspect-[16/8] sm:aspect-[16/9]"
            />
            {promoBanners.length >= 2 && (
              <div className="hidden xl:grid grid-rows-2 gap-3">
                {promoBanners.slice(0, 2).map((banner) => (
                  <div
                    key={banner.id}
                    className="relative rounded-xl overflow-hidden bg-muted group"
                    style={banner.bg_color ? { backgroundColor: banner.bg_color } : {}}
                  >
                    {banner.image_desktop_url && (
                      <img
                        src={banner.image_desktop_url}
                        alt={isAr ? banner.title_ar || "" : banner.title_en || ""}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    {banner.cta_link && (
                      <a href={banner.cta_link} className="absolute inset-0" aria-label={isAr ? banner.title_ar || "" : banner.title_en || ""} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FLASH SALE ── */}
      {activeFlashSale && flashSaleProducts.length > 0 && (
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FlashSaleSection
              products={flashSaleProducts}
              locale={locale}
              endTime={activeFlashSale.endTime}
              titleEn={activeFlashSale.titleEn}
              titleAr={activeFlashSale.titleAr}
            />
          </div>
        </section>
      )}

      {/* ── NEW ARRIVALS ── */}
      <ProductSection
        title={isAr ? "وصل حديثاً" : "New Arrivals"}
        products={newArrivals}
        locale={locale}
        viewAllHref={`/${locale}/products?sort=new`}
        columns={5}
        maxItems={5}
        bgVariant="default"
        flashSaleActive={!!activeFlashSale}
      />

      {/* ── SHOP BY CATEGORY ── */}
      {pinnedCategories.length > 0 && (
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {isAr ? "أقسامنا" : "Shop by Category"}
              </h2>
              <Link
                href={`/${locale}/products`}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {isAr ? "عرض الكل" : "View All"}
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {pinnedCategories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/category/${cat.slug}`}
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="w-full aspect-square rounded-2xl overflow-hidden bg-background border border-border group-hover:border-primary group-hover:shadow-md transition-all duration-200">
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={isAr ? cat.name_ar : cat.name_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5">
                        <Package size={28} className="text-primary/30" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors text-center line-clamp-2 leading-tight w-full">
                    {isAr ? cat.name_ar : cat.name_en}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EDITORIAL BANNER ── */}
      {editorialBanner && (
        <EditorialBanner banner={editorialBanner as any} locale={locale} />
      )}

      {/* ── BEST SELLERS ── */}
      <ProductSection
        title={isAr ? "الأكثر مبيعاً" : "Best Sellers"}
        products={homepageFeatured}
        locale={locale}
        viewAllHref={`/${locale}/products`}
        columns={4}
        maxItems={8}
        bgVariant="default"
        flashSaleActive={!!activeFlashSale}
      />

      {/* ── PROMO BANNERS ── */}
      <SplitPromoBanners banners={promoBanners as any[]} locale={locale} />

      {/* ── SHOP BY BRAND ── */}
      {featuredBrands.length > 0 && (
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {isAr ? "تسوق حسب الماركة" : "Shop by Brand"}
              </h2>
              <Link
                href={`/${locale}/products`}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {isAr ? "عرض الكل" : "View All"}
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {featuredBrands.slice(0, 6).map((brand) => (
                <Link
                  key={brand.id}
                  href={`/${locale}/brand/${brand.slug}`}
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="w-full aspect-square rounded-2xl overflow-hidden bg-background border border-border group-hover:border-primary group-hover:shadow-md transition-all duration-200 p-3 flex items-center justify-center">
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={isAr ? brand.name_ar : brand.name_en}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5">
                        <Package size={28} className="text-primary/30" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors text-center line-clamp-2 leading-tight w-full">
                    {isAr ? brand.name_ar : brand.name_en}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FROM THE BLOG ── */}
      {blogs && blogs.length > 0 && (
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {isAr ? "من المدونة" : "From the Blog"}
              </h2>
              <Link
                href={`/${locale}/blog`}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
              >
                {isAr ? "كل المقالات" : "All Articles"}
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {blogs.slice(0, 3).map((post: Blog) => (
                <article
                  key={post.id}
                  className="group bg-background rounded-2xl border border-border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Link href={`/${locale}/blog/${post.slug}`} className="block aspect-[16/9] overflow-hidden bg-muted">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={isAr ? post.title_ar : post.title_en}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                        <FileText size={28} strokeWidth={1} />
                      </div>
                    )}
                  </Link>
                  <div className="p-5 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {post.published_at ? format(new Date(post.published_at), "MMM d, yyyy") : "Draft"}
                    </p>
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      <Link href={`/${locale}/blog/${post.slug}`}>
                        {isAr ? post.title_ar : post.title_en}
                      </Link>
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {isAr ? post.excerpt_ar : post.excerpt_en}
                    </p>
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
                    >
                      {isAr ? "اقرأ المزيد" : "Read more"}
                      <ArrowRight size={11} className="rtl:rotate-180" />
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
