import {
  getProducts,
  getCategoryBySlug,
  getCategories,
  getFeaturedBrands,
  getHeroBanners,
} from "@nss/db/queries";
import { getActiveFlashSale } from "@/lib/marketing";
import { notFound } from "next/navigation";
import { Package } from "lucide-react";
import ProductCardComponent from "../../../_components/product-card";
import { ProductFilters } from "../../_components/catalog/product-filters";
import { ProductSort } from "../../_components/catalog/product-sort";
import { MobileFilterDrawer } from "../../_components/catalog/mobile-filter-drawer";
import type { Locale } from "@/lib/i18n";
import type { Category } from "@nss/db/types";
import { Suspense } from "react";
import { 
  CategoryHeroSkeleton, 
  SubcategorySkeleton, 
  FilterSkeleton
} from "../../../_components/skeletons";
import { CategoryLinkClient } from "../../../_components/category-link-client";

type Params = Promise<{ locale: Locale; slug: string }>;
type SearchParams = Promise<{
  minPrice?: string;
  maxPrice?: string;
  brand?: string | string[];
  sort?: string;
  page?: string;
}>;

// --- Helper Components ---

async function CategoryHeroWrapper({ 
  category, 
  locale 
}: { 
  category: Category; 
  locale: Locale 
}) {
  const heroBanners = await getHeroBanners().catch(() => []);
  const categoryBanner = heroBanners.find((b: any) => b.category_id === category.id);
  const isAr = locale === "ar";
  const categoryName = isAr ? category.name_ar : category.name_en;
  const categoryDesc = isAr ? category.description_ar : category.description_en;

  if (categoryBanner) {
    return (
      <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 relative w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)] aspect-[21/6] sm:aspect-[21/5] overflow-hidden rounded-[2rem] clay-shadow-sky">
        {(categoryBanner as any).image_desktop_url && (
          <img
            src={(categoryBanner as any).image_desktop_url}
            alt={categoryName}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent rtl:bg-gradient-to-l flex items-center">
          <div className="px-8 sm:px-12 space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-md">{categoryName}</h1>
            {categoryDesc && (
              <p className="text-sm text-white/80 max-w-md">{categoryDesc}</p>
            )}
            <Suspense fallback={<div className="h-4 w-20 rounded bg-white/20 animate-pulse" />}>
              <ProductCountText categorySlug={category.slug} locale={locale} />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 sm:mx-6 lg:mx-8 mt-4">
      <div className="bg-clay-sky/30 rounded-[2rem] clay-shadow-sky px-6 py-5">
        <div className="flex items-center gap-4">
          {category.image_url && (
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white clay-shadow-white flex-shrink-0">
              <img
                src={category.image_url}
                alt={categoryName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">{categoryName}</h1>
            <Suspense fallback={<div className="h-4 w-32 rounded bg-muted/20 animate-pulse mt-0.5" />}>
              <ProductCountText categorySlug={category.slug} locale={locale} showAvailable />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

async function ProductCountText({ 
  categorySlug, 
  locale, 
  showAvailable = false 
}: { 
  categorySlug: string; 
  locale: Locale; 
  showAvailable?: boolean 
}) {
  const result = await getProducts({ categorySlug: categorySlug, page: 1 }).catch(() => ({ count: 0 }));
  const isAr = locale === "ar";
  if (showAvailable) {
    return (
      <p className="text-sm text-muted-foreground mt-0.5">
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

async function SubcategoryStripWrapper({ 
  category, 
  locale, 
  slug 
}: { 
  category: Category; 
  locale: Locale; 
  slug: string 
}) {
  const allCategories = await getCategories().catch(() => []);
  const subcategories = allCategories.filter((c: Category) => c.parent_id === category.id);
  const isAr = locale === "ar";

  if (subcategories.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
        <CategoryLinkClient
          href={`/${locale}/category/${slug}`}
          className="shrink-0 px-4 py-1.5 rounded-full text-xs font-black bg-clay-sky text-clay-sky-deep clay-shadow-sky"
        >
          {isAr ? "الكل" : "All"}
        </CategoryLinkClient>
        {subcategories.map((sub: Category, idx: number) => {
          const subColors = [
            "bg-clay-mint text-clay-mint-deep clay-shadow-mint",
            "bg-clay-lavender text-clay-lavender-deep clay-shadow-lavender",
            "bg-clay-peach text-clay-peach-deep clay-shadow-peach",
            "bg-clay-pink text-clay-pink-deep clay-shadow-pink",
            "bg-clay-lemon text-clay-lemon-deep clay-shadow-lemon",
          ];
          const cc = subColors[idx % subColors.length];
          return (
            <CategoryLinkClient
              key={sub.id}
              href={`/${locale}/category/${sub.slug}`}
              className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black transition-all duration-200 hover:scale-105 ${cc}`}
            >
              {sub.image_url && (
                <img src={sub.image_url} alt="" className="w-4 h-4 rounded-full object-cover" />
              )}
              {isAr ? sub.name_ar : sub.name_en}
            </CategoryLinkClient>
          );
        })}
      </div>
    </div>
  );
}

async function CategoryFiltersWrapper({ locale }: { locale: Locale }) {
  const brands = await getFeaturedBrands().catch(() => []);
  return <ProductFilters locale={locale} brands={brands} />;
}

async function CategoryMobileFiltersWrapper({ locale }: { locale: Locale }) {
  const brands = await getFeaturedBrands().catch(() => []);
  return <MobileFilterDrawer locale={locale} brands={brands} />;
}

async function CategoryProductGridWrapper({ 
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
      {/* Sort + Mobile filters row */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <p className="text-sm text-muted-foreground font-bold">
          {isAr ? `${count} نتيجة` : `${count} results`}
        </p>
        <div className="flex items-center gap-2">
          <Suspense fallback={<div className="h-9 w-24 rounded-full bg-muted/10 animate-pulse" />}>
            <CategoryMobileFiltersWrapper locale={locale} />
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
          <p className="text-xs text-muted-foreground/60 mt-1">
            {isAr ? "جرب تعديل التصفية" : "Try adjusting your filters"}
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

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { locale, slug } = await params;
  const sParams = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const filters = {
    categorySlug: slug,
    minPrice: sParams.minPrice ? parseFloat(sParams.minPrice) : undefined,
    maxPrice: sParams.maxPrice ? parseFloat(sParams.maxPrice) : undefined,
    brandSlug: Array.isArray(sParams.brand) ? sParams.brand[0] : sParams.brand,
    sort: sParams.sort as any,
    page: sParams.page ? parseInt(sParams.page) : 1,
  };

  return (
    <>
      <Suspense fallback={<CategoryHeroSkeleton />}>
        <CategoryHeroWrapper category={category} locale={locale} />
      </Suspense>

      <Suspense fallback={<SubcategorySkeleton />}>
        <SubcategoryStripWrapper category={category} locale={locale} slug={slug} />
      </Suspense>

      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="hidden lg:block lg:col-span-1 space-y-6 sticky top-40 h-fit">
              <div className="bg-white rounded-[2rem] clay-shadow-lavender p-4">
                <Suspense fallback={<FilterSkeleton />}>
                  <CategoryFiltersWrapper locale={locale} />
                </Suspense>
              </div>
            </aside>

            <Suspense fallback={<div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4 gap-3"><div className="h-5 w-24 rounded bg-muted/10 animate-pulse" /></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <div key={i} className="space-y-3"><div className="aspect-square w-full rounded-[2rem] bg-muted/10 animate-pulse" /><div className="h-4 w-3/4 rounded bg-muted/20 animate-pulse" /></div>)}
              </div>
            </div>}>
              <CategoryProductGridWrapper filters={filters} locale={locale} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
