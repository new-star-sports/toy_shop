import Link from "next/link";
import { Suspense } from "react";
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
} from "@nss/db/queries";
import { getActiveFlashSale } from "@/lib/marketing";
import { format } from "date-fns";
import { ArrowRight, FileText, Package } from "lucide-react";
import { HeroCarousel } from "../../_components/hero-carousel";
import { ProductSection } from "../../_components/product-section";
import { FlashSaleSection } from "../../_components/flash-sale-section";
import { EditorialBanner, SplitPromoBanners } from "../../_components/banner-section";
import { CategoryLinkClient } from "../../_components/category-link-client";
import { 
  ProductSectionSkeleton, 
  CategoryGridSkeleton, 
  BrandGridSkeleton,
  BannerSkeleton 
} from "../../_components/skeletons";
import { cn } from "@/lib/utils";

type Params = Promise<{ locale: string }>;

// --- Async Section Components ---

async function FlashSaleWrapper({ locale }: { locale: Locale }) {
  const activeFlashSale = await getActiveFlashSale().catch(() => null);
  if (!activeFlashSale) return null;
  
  const products = await getFlashSaleProducts(8).catch(() => []);
  if (products.length === 0) return null;

  return (
    <FlashSaleSection
      products={products}
      locale={locale}
      endTime={activeFlashSale.endTime}
      titleEn={activeFlashSale.titleEn}
      titleAr={activeFlashSale.titleAr}
    />
  );
}

async function PinnedCategoriesWrapper({ locale }: { locale: Locale }) {
  const categories = await getHomepagePinnedCategories().catch(() => []);
  if (categories.length === 0) return null;
  const isAr = locale === "ar";

  return (
    <section className="py-8 sm:py-10 bg-clay-lavender/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-clay-lavender-deep shrink-0" />
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              {isAr ? "أقسامنا" : "Shop by Category"}
            </h2>
          </div>
          <Link
            href={`/${locale}/search`}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-clay-lavender clay-shadow-lavender text-clay-lavender-deep hover:scale-105 transition-all duration-200"
          >
            {isAr ? "عرض الكل" : "View All"}
            <ArrowRight size={12} className="rtl:rotate-180" />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 6).map((cat, idx) => {
            const catColors = [
              { bg: "bg-clay-sky/40",      shadow: "clay-shadow-sky"      },
              { bg: "bg-clay-mint/40",     shadow: "clay-shadow-mint"     },
              { bg: "bg-clay-lavender/40", shadow: "clay-shadow-lavender" },
              { bg: "bg-clay-peach/40",    shadow: "clay-shadow-peach"    },
              { bg: "bg-clay-pink/40",     shadow: "clay-shadow-pink"     },
              { bg: "bg-clay-lemon/40",    shadow: "clay-shadow-lemon"    },
            ];
            const cc = catColors[idx % catColors.length];
            return (
              <CategoryLinkClient
                key={cat.id}
                href={`/${locale}/category/${cat.slug}`}
                className="group flex flex-col items-center gap-2"
              >
                <div className={cn("w-full aspect-square rounded-[1.5rem] overflow-hidden group-hover:scale-105 transition-all duration-200", cc.bg, cc.shadow)}>
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt={isAr ? cat.name_ar : cat.name_en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={28} className="text-foreground/20" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <p className="text-xs font-black text-foreground group-hover:text-primary transition-colors text-center line-clamp-2 leading-tight w-full">
                  {isAr ? cat.name_ar : cat.name_en}
                </p>
              </CategoryLinkClient>
            );
          })}
        </div>
      </div>
    </section>
  );
}

async function FeaturedSectionWrapper({ 
  locale, 
  type 
}: { 
  locale: Locale; 
  type: "new" | "best" 
}) {
  const isAr = locale === "ar";
  const data = type === "new" 
    ? await getNewArrivals(10).catch(() => [])
    : await getHomepageFeatured(8).catch(() => []);
    
  if (data.length === 0) return null;

  return (
    <ProductSection
      title={type === "new" 
        ? (isAr ? "وصل حديثاً" : "New Arrivals")
        : (isAr ? "الأكثر مبيعاً" : "Best Sellers")
      }
      products={data}
      locale={locale}
      viewAllHref={`/${locale}/search${type === "new" ? "?sort=new" : ""}`}
      columns={type === "new" ? 5 : 4}
      maxItems={type === "new" ? 5 : 8}
      bgVariant={type === "new" ? "mint" : "peach"}
      accentColor={type === "new" ? "mint" : "peach"}
    />
  );
}

async function BrandSectionWrapper({ locale }: { locale: Locale }) {
  const brands = await getFeaturedBrands().catch(() => []);
  if (brands.length === 0) return null;
  const isAr = locale === "ar";

  return (
    <section className="py-8 sm:py-10 bg-clay-lemon/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-clay-lemon-deep shrink-0" />
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              {isAr ? "تسوق حسب الماركة" : "Shop by Brand"}
            </h2>
          </div>
          <Link
            href={`/${locale}/search`}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-clay-lemon clay-shadow-lemon text-clay-lemon-deep hover:scale-105 transition-all duration-200"
          >
            {isAr ? "عرض الكل" : "View All"}
            <ArrowRight size={12} className="rtl:rotate-180" />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {brands.slice(0, 6).map((brand) => (
            <Link
              key={brand.id}
              href={`/${locale}/brand/${brand.slug}`}
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-full aspect-square rounded-[1.5rem] overflow-hidden bg-white clay-shadow-white group-hover:scale-105 transition-all duration-200 p-3 flex items-center justify-center">
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={isAr ? brand.name_ar : brand.name_en}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={28} className="text-foreground/20" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <p className="text-xs font-black text-foreground group-hover:text-primary transition-colors text-center line-clamp-2 leading-tight w-full">
                {isAr ? brand.name_ar : brand.name_en}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

async function EditorialBannerWrapper({ locale }: { locale: Locale }) {
  const banner = await getEditorialBanner().catch(() => null);
  if (!banner) return null;
  return <EditorialBanner banner={banner as any} locale={locale} />;
}

async function PromoBannersWrapper({ locale }: { locale: Locale }) {
  const banners = await getPromoBanners().catch(() => []);
  if (banners.length === 0) return null;
  return <SplitPromoBanners banners={banners as any[]} locale={locale} />;
}

async function BlogSectionWrapper({ locale }: { locale: Locale }) {
  const blogs = await getBlogs({ publishedOnly: true }).catch(() => []);
  if (blogs.length === 0) return null;
  const isAr = locale === "ar";

  return (
    <section className="pt-0 pb-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-clay-sky-deep shrink-0" />
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              {isAr ? "من المدونة" : "From the Blog"}
            </h2>
          </div>
          <Link
            href={`/${locale}/blog`}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-clay-sky clay-shadow-sky text-clay-sky-deep hover:scale-105 transition-all duration-200 whitespace-nowrap"
          >
            {isAr ? "كل المقالات" : "All Articles"}
            <ArrowRight size={12} className="rtl:rotate-180" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {blogs.slice(0, 3).map((post: any, idx: number) => {
            const blogColors = [
              { imgBg: "bg-clay-sky/30",      shadow: "clay-shadow-sky"   },
              { imgBg: "bg-clay-pink/30",     shadow: "clay-shadow-pink"  },
              { imgBg: "bg-clay-mint/30",     shadow: "clay-shadow-mint"  },
            ];
            const bc = blogColors[idx % blogColors.length];
            return (
              <article
                key={post.id}
                className={`group bg-white rounded-[2rem] overflow-hidden clay-shadow-white clay-hover transition-all duration-300 ${bc.shadow}`}
              >
                <Link href={`/${locale}/blog/${post.slug}`} className={cn("block aspect-[16/9] overflow-hidden rounded-[1.75rem] m-2 mb-0", bc.imgBg)}>
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
                <div className="p-4 space-y-2">
                  <p className="text-xs text-muted-foreground font-bold">
                    {post.published_at ? format(new Date(post.published_at), "MMM d, yyyy") : "Draft"}
                  </p>
                  <h3 className="text-sm font-black text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    <Link href={`/${locale}/blog/${post.slug}`}>
                      {isAr ? post.title_ar : post.title_en}
                    </Link>
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {isAr ? post.excerpt_ar : post.excerpt_en}
                  </p>
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-black text-primary"
                  >
                    {isAr ? "اقرأ المزيد" : "Read more"}
                    <ArrowRight size={11} className="rtl:rotate-180" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// --- MAIN PAGE ---

export default async function HomePage({ params }: { params: Params }) {
  const { locale: localeStr } = await params;
  const locale = localeStr as Locale;

  // We only fetch the HERO banners here to show something immediately
  // Everything else will stream in via Suspense
  const heroBanners = await getHeroBanners().catch(() => []);

  return (
    <>
      {/* ── HERO BANNER ── */}
      <section className="pt-6 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroCarousel
            banners={heroBanners as any[]}
            locale={locale}
            aspectRatio="aspect-[16/8] sm:aspect-[21/7]"
          />
        </div>
      </section>

      <Suspense fallback={<ProductSectionSkeleton />}>
        <FlashSaleWrapper locale={locale} />
      </Suspense>

      <Suspense fallback={<ProductSectionSkeleton />}>
        <FeaturedSectionWrapper locale={locale} type="new" />
      </Suspense>

      <Suspense fallback={<CategoryGridSkeleton />}>
        <PinnedCategoriesWrapper locale={locale} />
      </Suspense>

      <Suspense fallback={<BannerSkeleton />}>
        <EditorialBannerWrapper locale={locale} />
      </Suspense>

      <Suspense fallback={<ProductSectionSkeleton />}>
        <FeaturedSectionWrapper locale={locale} type="best" />
      </Suspense>

      <Suspense fallback={<BannerSkeleton />}>
        <PromoBannersWrapper locale={locale} />
      </Suspense>

      <Suspense fallback={<BrandGridSkeleton />}>
        <BrandSectionWrapper locale={locale} />
      </Suspense>

      <Suspense fallback={<ProductSectionSkeleton />}>
        <BlogSectionWrapper locale={locale} />
      </Suspense>
    </>
  );
}
