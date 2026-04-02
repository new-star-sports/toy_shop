import {
  getProducts,
  getCategoryBySlug,
  getCategories,
  getFeaturedBrands,
  getHeroBanners,
} from "@nss/db/queries";
import { getActiveFlashSale } from "@/lib/marketing";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Package, SlidersHorizontal } from "lucide-react";
import ProductCardComponent from "../../../_components/product-card";
import { ProductFilters } from "../../_components/catalog/product-filters";
import { ProductSort } from "../../_components/catalog/product-sort";
import type { Locale } from "@/lib/i18n";
import type { Category } from "@nss/db/types";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
  searchParams: Promise<{
    minPrice?: string;
    maxPrice?: string;
    brand?: string | string[];
    sort?: string;
    page?: string;
  }>;
}) {
  const { locale, slug } = await params;
  const sParams = await searchParams;
  const isAr = locale === "ar";

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

  const [{ data: products, count }, activeFlashSale, allBrands, allCategories, heroBanners] =
    await Promise.all([
      getProducts(filters),
      getActiveFlashSale(),
      getFeaturedBrands(),
      getCategories(),
      getHeroBanners(),
    ]);

  const subcategories = allCategories.filter(
    (c: Category) => c.parent_id === category.id
  );

  const categoryBanner = heroBanners.find(
    (b: any) => b.category_id === category.id
  );

  const categoryName = isAr ? category.name_ar : category.name_en;
  const categoryDesc = isAr ? category.description_ar : category.description_en;

  return (
    <>
      {/* Category Hero */}
      {categoryBanner ? (
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
              <p className="text-xs text-white/60 font-black">
                {isAr ? `${count} منتج` : `${count} products`}
              </p>
            </div>
          </div>
        </div>
      ) : (
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
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isAr ? `${count} منتج متاح` : `${count} products available`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subcategory Strip */}
      {subcategories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            <Link
              href={`/${locale}/category/${slug}`}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-black bg-clay-sky text-clay-sky-deep clay-shadow-sky"
            >
              {isAr ? "الكل" : "All"}
            </Link>
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
                <Link
                  key={sub.id}
                  href={`/${locale}/category/${sub.slug}`}
                  className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black transition-all duration-200 hover:scale-105 ${cc}`}
                >
                  {sub.image_url && (
                    <img src={sub.image_url} alt="" className="w-4 h-4 rounded-full object-cover" />
                  )}
                  {isAr ? sub.name_ar : sub.name_en}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters — clay card */}
            <aside className="hidden lg:block lg:col-span-1 space-y-6 sticky top-40 h-fit">
              <div className="bg-white rounded-[2rem] clay-shadow-lavender p-4">
                <ProductFilters locale={locale} brands={allBrands} />
              </div>
            </aside>

            {/* Product Grid */}
            <div className="lg:col-span-3">
              {/* Sort + Mobile filters row */}
              <div className="flex items-center justify-between mb-4 gap-3">
                <p className="text-sm text-muted-foreground font-bold">
                  {isAr ? `${count} نتيجة` : `${count} results`}
                </p>
                <div className="flex items-center gap-2">
                  <button className="lg:hidden flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-clay-lavender text-clay-lavender-deep clay-shadow-lavender transition-all hover:scale-105">
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
          </div>
        </div>
      </div>
    </>
  );
}
