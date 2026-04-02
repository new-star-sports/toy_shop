import { getProducts, getBrandBySlug, getFeaturedBrands, getHeroBanners } from "@nss/db/queries";
import { getActiveFlashSale } from "@/lib/marketing";
import { notFound } from "next/navigation";
import { Package } from "lucide-react";
import ProductCardComponent from "../../../_components/product-card";
import { ProductFilters } from "../../_components/catalog/product-filters";
import { ProductSort } from "../../_components/catalog/product-sort";
import { MobileFilterDrawer } from "../../_components/catalog/mobile-filter-drawer";
import type { Locale } from "@/lib/i18n";
import type { Brand } from "@nss/db/types";
import { Suspense } from "react";
import { 
  CategoryHeroSkeleton, 
  FilterSkeleton 
} from "../../../_components/skeletons";

type Params = Promise<{ locale: Locale; slug: string }>;
type SearchParams = Promise<{
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
}>;

// --- Helper Components ---

async function BrandHeroWrapper({ 
  brand, 
  locale 
}: { 
  brand: Brand; 
  locale: Locale 
}) {
  const heroBanners = await getHeroBanners().catch(() => []);
  const brandBanner = heroBanners.find((b: any) => b.brand_id === brand.id);
  const isAr = locale === "ar";
  const brandName = isAr ? brand.name_ar : brand.name_en;
  const brandDesc = isAr ? brand.description_ar : brand.description_en;

  if (brandBanner) {
    return (
      <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 relative w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)] aspect-[21/6] sm:aspect-[21/5] overflow-hidden rounded-[2rem] clay-shadow-peach">
        {(brandBanner as any).image_desktop_url && (
          <img
            src={(brandBanner as any).image_desktop_url}
            alt={brandName}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent rtl:bg-gradient-to-l flex items-center">
          <div className="px-8 sm:px-12 space-y-3">
            {brand.logo_url && (
              <div className="w-16 h-16 rounded-full bg-white p-2 flex items-center justify-center clay-shadow-white">
                <img src={brand.logo_url} alt={brandName} className="max-h-full max-w-full object-contain" />
              </div>
            )}
            <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-md">{brandName}</h1>
            <Suspense fallback={<div className="h-4 w-20 rounded bg-white/20 animate-pulse" />}>
              <BrandProductCountText brandSlug={brand.slug} locale={locale} />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 sm:mx-6 lg:mx-8 mt-4">
      <div className="bg-clay-peach/30 rounded-[2rem] clay-shadow-peach px-6 py-5">
        <div className="flex items-center gap-5">
          {brand.logo_url && (
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center p-3 flex-shrink-0 clay-shadow-white">
              <img src={brand.logo_url} alt={brandName} className="max-h-full max-w-full object-contain" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">{brandName}</h1>
            {brandDesc && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 max-w-lg">{brandDesc}</p>
            )}
            <Suspense fallback={<div className="h-4 w-32 rounded bg-muted/20 animate-pulse mt-1.5" />}>
              <BrandProductCountText brandSlug={brand.slug} locale={locale} showAvailable />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

async function BrandProductCountText({ 
  brandSlug, 
  locale, 
  showAvailable = false 
}: { 
  brandSlug: string; 
  locale: Locale; 
  showAvailable?: boolean 
}) {
  const result = await getProducts({ brandSlug, page: 1 }).catch(() => ({ count: 0 }));
  const isAr = locale === "ar";
  if (showAvailable) {
    return (
      <p className="text-xs text-muted-foreground mt-1.5 font-black">
        {isAr ? `${result.count} منتج متاح` : `${result.count} products available`}
      </p>
    );
  }
  return (
    <p className="text-xs text-white/60 font-black">
      {isAr ? `${result.count} منتج` : `${result.count} products`}
    </p>
  );
}

async function BrandFiltersWrapper({ locale }: { locale: Locale }) {
  const brands = await getFeaturedBrands().catch(() => []);
  return <ProductFilters locale={locale} brands={brands} />;
}

async function BrandMobileFiltersWrapper({ locale }: { locale: Locale }) {
  const brands = await getFeaturedBrands().catch(() => []);
  return <MobileFilterDrawer locale={locale} brands={brands} />;
}

async function BrandProductGridWrapper({ 
  filters, 
  locale 
}: { 
  filters: any; 
  locale: Locale 
}) {
  const productsResult = await getProducts(filters).catch(() => ({ data: [], count: 0 }));
  const { data: products, count } = productsResult;
  const activeFlashSale = await getActiveFlashSale().catch(() => null);
  const isAr = locale === "ar";

  return (
    <div className="lg:col-span-3">
      {/* Sort Row */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <p className="text-sm text-muted-foreground font-bold">
          {isAr ? `${count} نتيجة` : `${count} results`}
        </p>
        <div className="flex items-center gap-2">
          <Suspense fallback={<div className="h-9 w-24 rounded-full bg-muted/10 animate-pulse" />}>
            <BrandMobileFiltersWrapper locale={locale} />
          </Suspense>
          <ProductSort locale={locale} />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] clay-shadow-white">
          <Package size={40} className="text-muted-foreground/30 mx-auto mb-3" strokeWidth={1} />
          <p className="text-sm font-black text-muted-foreground">
            {isAr ? "لم يتم العثور على منتجات" : "No products found"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCardComponent
              key={product.id}
              product={product}
              locale={locale}
              flashSaleActive={!!activeFlashSale}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// --- Main Page ---

export default async function BrandPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { locale, slug } = await params;
  const sParams = await searchParams;

  const brand = await getBrandBySlug(slug);
  if (!brand) {
    notFound();
  }

  const filters = {
    brandSlug: slug,
    minPrice: sParams.minPrice ? parseFloat(sParams.minPrice) : undefined,
    maxPrice: sParams.maxPrice ? parseFloat(sParams.maxPrice) : undefined,
    sort: sParams.sort as any,
    page: sParams.page ? parseInt(sParams.page) : 1,
  };

  return (
    <>
      <Suspense fallback={<CategoryHeroSkeleton />}>
        <BrandHeroWrapper brand={brand} locale={locale} />
      </Suspense>

      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="hidden lg:block lg:col-span-1 space-y-6 sticky top-40 h-fit">
              <div className="bg-white rounded-[2rem] clay-shadow-peach p-4">
                <Suspense fallback={<FilterSkeleton />}>
                  <BrandFiltersWrapper locale={locale} />
                </Suspense>
              </div>
            </aside>

            <Suspense fallback={<div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4 gap-3"><div className="h-5 w-24 rounded bg-muted/10 animate-pulse" /></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <div key={i} className="space-y-3"><div className="aspect-square w-full rounded-[2rem] bg-muted/10 animate-pulse" /><div className="h-4 w-3/4 rounded bg-muted/20 animate-pulse" /></div>)}
              </div>
            </div>}>
              <BrandProductGridWrapper filters={filters} locale={locale} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
