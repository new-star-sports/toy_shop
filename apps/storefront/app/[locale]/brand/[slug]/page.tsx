import { getProducts, getBrandBySlug, getFeaturedBrands, getHeroBanners } from "@nss/db/queries";
import { getActiveFlashSale } from "@/lib/marketing";
import { notFound } from "next/navigation";
import { Package, SlidersHorizontal } from "lucide-react";
import ProductCardComponent from "../../../_components/product-card";
import { ProductFilters } from "../../_components/catalog/product-filters";
import { ProductSort } from "../../_components/catalog/product-sort";
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

  const filters = {
    brandSlug: slug,
    minPrice: sParams.minPrice ? parseFloat(sParams.minPrice) : undefined,
    maxPrice: sParams.maxPrice ? parseFloat(sParams.maxPrice) : undefined,
    sort: sParams.sort as any,
    page: sParams.page ? parseInt(sParams.page) : 1,
  };

  const [{ data: products, count }, activeFlashSale, allBrands, heroBanners] =
    await Promise.all([
      getProducts(filters),
      getActiveFlashSale(),
      getFeaturedBrands(),
      getHeroBanners(),
    ]);

  const brandBanner = heroBanners.find((b: any) => b.brand_id === brand.id);
  const brandName = isAr ? brand.name_ar : brand.name_en;
  const brandDesc = isAr ? brand.description_ar : brand.description_en;

  return (
    <>
      {/* Brand Hero */}
      {brandBanner ? (
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
              <p className="text-xs text-white/60 font-black">
                {isAr ? `${count} منتج` : `${count} products`}
              </p>
            </div>
          </div>
        </div>
      ) : (
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
                <p className="text-xs text-muted-foreground mt-1.5 font-black">
                  {isAr ? `${count} منتج متاح` : `${count} products available`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar — clay card */}
            <aside className="hidden lg:block lg:col-span-1 space-y-6 sticky top-40 h-fit">
              <div className="bg-white rounded-[2rem] clay-shadow-peach p-4">
                <ProductFilters locale={locale} brands={allBrands} />
              </div>
            </aside>

            {/* Product Grid */}
            <div className="lg:col-span-3">
              {/* Sort row */}
              <div className="flex items-center justify-between mb-4 gap-3">
                <p className="text-sm text-muted-foreground font-bold">
                  {isAr ? `${count} نتيجة` : `${count} results`}
                </p>
                <div className="flex items-center gap-2">
                  <button className="lg:hidden flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-clay-peach text-clay-peach-deep clay-shadow-peach transition-all hover:scale-105">
                    <SlidersHorizontal size={13} />
                    {isAr ? "تصفية" : "Filter"}
                  </button>
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
          </div>
        </div>
      </div>
    </>
  );
}
