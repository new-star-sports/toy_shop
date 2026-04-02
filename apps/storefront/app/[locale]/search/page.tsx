import { getProducts, getFeaturedBrands } from "@nss/db/queries";
import { getActiveFlashSale } from "@/lib/marketing";
import ProductCardComponent from "../../_components/product-card";
import { ProductFilters } from "../_components/catalog/product-filters";
import { ProductSort } from "../_components/catalog/product-sort";
import { MobileFilterDrawer } from "../_components/catalog/mobile-filter-drawer";
import { Breadcrumbs } from "../_components/catalog/breadcrumbs";
import type { Locale } from "@/lib/i18n";
import { Suspense } from "react";
import { FilterSkeleton } from "../../_components/skeletons";

// --- Helper Components ---

async function SearchHeaderContent({ 
  query, 
  locale, 
  filters 
}: { 
  query: string; 
  locale: Locale; 
  filters: any 
}) {
  const productsResult = await getProducts(filters).catch(() => ({ data: [], count: 0 }));
  const { count } = productsResult;
  const isAr = locale === "ar";

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-foreground">
        {isAr ? "المنتجات" : "Products"}
      </h1>
      <p className="text-xs text-muted-foreground mt-0.5">
        {query
          ? isAr
            ? `تم العثور على ${count} منتج للبحث "${query}"`
            : `Found ${count} products for "${query}"`
          : isAr ? `${count} منتج` : `${count} products`}
      </p>
    </div>
  );
}

async function FiltersWrapper({ locale }: { locale: Locale }) {
  const brands = await getFeaturedBrands().catch(() => []);
  return <ProductFilters locale={locale} brands={brands} />;
}

async function MobileFiltersWrapper({ locale }: { locale: Locale }) {
  const brands = await getFeaturedBrands().catch(() => []);
  return <MobileFilterDrawer locale={locale} brands={brands} />;
}

async function ProductGridWrapper({ 
  filters, 
  locale 
}: { 
  filters: any; 
  locale: Locale 
}) {
  const productsResult = await getProducts(filters).catch(() => ({ data: [], count: 0 }));
  const { data: products } = productsResult;
  const activeFlashSale = await getActiveFlashSale().catch(() => null);
  const isAr = locale === "ar";

  if (products.length === 0) {
    return (
      <div className="text-center py-20 clay-shadow-white rounded-[2rem] bg-white">
        <div className="w-16 h-16 rounded-full bg-clay-lemon/40 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🔍</span>
        </div>
        <p className="font-black text-foreground mb-1">{isAr ? "لا توجد نتائج" : "No results found"}</p>
        <p className="text-sm text-muted-foreground">
          {isAr
            ? "عذراً، لم نجد أي نتائج. جرب كلمات بحث أخرى."
            : "Sorry, no results found. Try different keywords."}
        </p>
      </div>
    );
  }

  return (
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
  );
}

// --- Main Page ---

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ 
    q?: string;
    minPrice?: string; 
    maxPrice?: string; 
    brand?: string | string[]; 
    sort?: string;
    page?: string;
  }>;
}) {
  const { locale } = await params;
  const sParams = await searchParams;
  const query = sParams.q || "";

  const filters = {
    search: query,
    minPrice: sParams.minPrice ? parseFloat(sParams.minPrice) : undefined,
    maxPrice: sParams.maxPrice ? parseFloat(sParams.maxPrice) : undefined,
    brandSlug: Array.isArray(sParams.brand) ? sParams.brand[0] : sParams.brand,
    sort: sParams.sort as any,
    page: sParams.page ? parseInt(sParams.page) : 1,
  };

  const breadcrumbItems = query ? [
    { 
      label_en: `Search: ${query}`, 
      label_ar: `بحث: ${query}`, 
      href: `/${locale}/search?q=${query}` 
    },
  ] : [
    {
      label_en: "Products",
      label_ar: "المنتجات",
      href: `/${locale}/search`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      <Breadcrumbs items={breadcrumbItems} locale={locale} />

      {/* Header Shell */}
      <div className="clay-shadow-sky rounded-[2rem] bg-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <Suspense fallback={<div className="space-y-2"><div className="h-7 w-32 rounded bg-muted/20 animate-pulse" /><div className="h-4 w-48 rounded bg-muted/10 animate-pulse" /></div>}>
          <SearchHeaderContent query={query} locale={locale} filters={filters} />
        </Suspense>
        
        <div className="flex items-center gap-2">
          <Suspense fallback={<div className="h-9 w-24 rounded-full bg-muted/20 animate-pulse" />}>
            <MobileFiltersWrapper locale={locale} />
          </Suspense>
          <ProductSort locale={locale} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <aside className="hidden lg:block lg:col-span-1 sticky top-24 h-fit clay-shadow-lavender rounded-[2rem] bg-white p-4">
          <Suspense fallback={<FilterSkeleton />}>
            <FiltersWrapper locale={locale} />
          </Suspense>
        </aside>

        <div className="lg:col-span-3">
          <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="space-y-3"><div className="aspect-square w-full rounded-[2rem] bg-muted/10 animate-pulse" /><div className="h-4 w-3/4 rounded bg-muted/20 animate-pulse" /></div>)}
          </div>}>
            <ProductGridWrapper filters={filters} locale={locale} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
