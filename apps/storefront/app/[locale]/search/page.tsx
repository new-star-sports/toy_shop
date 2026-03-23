import { getProducts, getFeaturedBrands } from "@nss/db/queries";
import { getActiveFlashSale } from "@/lib/marketing";
import ProductCardComponent from "../../_components/product-card";
import { ProductFilters } from "../_components/catalog/product-filters";
import { ProductSort } from "../_components/catalog/product-sort";
import { Breadcrumbs } from "../_components/catalog/breadcrumbs";
import type { Locale } from "@/lib/i18n";

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
  const isAr = locale === "ar";
  const query = sParams.q || "";

  const brands = await getFeaturedBrands();

  const filters = {
    search: query,
    minPrice: sParams.minPrice ? parseFloat(sParams.minPrice) : undefined,
    maxPrice: sParams.maxPrice ? parseFloat(sParams.maxPrice) : undefined,
    brandSlug: Array.isArray(sParams.brand) ? sParams.brand[0] : sParams.brand,
    sort: sParams.sort as any,
    page: sParams.page ? parseInt(sParams.page) : 1,
  };

  const [{ data: products, count }, activeFlashSale] = await Promise.all([
    getProducts(filters),
    getActiveFlashSale(),
  ]);

  const breadcrumbItems = [
    { 
      label_en: `Search: ${query}`, 
      label_ar: `بحث: ${query}`, 
      href: `/${locale}/search?q=${query}` 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbItems} locale={locale} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-nss-text-primary">
            {isAr ? "نتائج البحث" : "Search Results"}
          </h1>
          <p className="text-sm text-nss-text-secondary mt-1">
            {isAr 
              ? `تم العثور على ${count} منتج للبحث "${query}"` 
              : `Found ${count} products for "${query}"`}
          </p>
        </div>
        <ProductSort locale={locale} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block lg:col-span-1 space-y-8 sticky top-24 h-fit">
          <ProductFilters locale={locale} brands={brands} />
        </aside>

        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-nss-surface rounded-3xl border border-nss-border/50">
              <p className="text-nss-text-secondary">
                {isAr 
                  ? "عذراً، لم نجد أي نتائج. جرب كلمات بحث أخرى." 
                  : "Sorry, no results found. Try different keywords."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}
