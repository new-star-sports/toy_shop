import { getProducts, getBrandBySlug, getFeaturedBrands } from "@nss/db/queries";
import { notFound } from "next/navigation";
import ProductCardComponent from "../../../_components/product-card";
import { ProductFilters } from "../../_components/catalog/product-filters";
import { ProductSort } from "../../_components/catalog/product-sort";
import { Breadcrumbs } from "../../_components/catalog/breadcrumbs";
import type { Locale } from "@/lib/i18n";

export default async function BrandPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
  searchParams: Promise<{ 
    minPrice?: string; 
    maxPrice?: string; 
    sort?: string;
    page?: string;
  }>;
}) {
  const { locale, slug } = await params;
  const sParams = await searchParams;
  const isAr = locale === "ar";

  const brand = await getBrandBySlug(slug);
  if (!brand) {
    notFound();
  }

  const brands = await getFeaturedBrands();

  const filters = {
    brandSlug: slug,
    minPrice: sParams.minPrice ? parseFloat(sParams.minPrice) : undefined,
    maxPrice: sParams.maxPrice ? parseFloat(sParams.maxPrice) : undefined,
    sort: sParams.sort as any,
    page: sParams.page ? parseInt(sParams.page) : 1,
  };

  const { data: products, count } = await getProducts(filters);

  const breadcrumbItems = [
    { 
      label_en: brand.name_en, 
      label_ar: brand.name_ar, 
      href: `/${locale}/brand/${brand.slug}` 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbItems} locale={locale} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          {brand.logo_url && (
             <div className="w-16 h-16 rounded-xl border border-nss-border bg-white flex items-center justify-center p-2">
                <img src={brand.logo_url} alt={brand.name_en} className="max-h-full max-w-full object-contain" />
             </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-nss-text-primary">
              {isAr ? brand.name_ar : brand.name_en}
            </h1>
            <p className="text-sm text-nss-text-secondary mt-1">
              {isAr ? `تم العثور على ${count} منتج` : `Found ${count} products`}
            </p>
          </div>
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
                {isAr ? "لم يتم العثور على منتجات لهذه العلامة التجارية" : "No products found for this brand."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCardComponent 
                  key={product.id} 
                  product={product} 
                  locale={locale} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
