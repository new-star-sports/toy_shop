"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductGallery } from "./product-gallery";
import { VariantSelector } from "./variant-selector";
import { Breadcrumbs } from "./breadcrumbs";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import type { ProductWithRelations } from "@nss/db/queries";
import type { Locale } from "@/lib/i18n";

interface ProductDetailProps {
  product: ProductWithRelations;
  locale: Locale;
  flashSaleActive?: boolean;
}

export function ProductDetail({ product, locale, flashSaleActive = false }: ProductDetailProps) {
  const isAr = locale === "ar";
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.length > 0 ? product.variants[0] : null
  );

  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    addItem({
      variantId: selectedVariant?.id || product.id,
      productId: product.id,
      slug: product.slug,
      nameEn: product.name_en,
      nameAr: product.name_ar,
      brandEn: product.brand?.name_en,
      brandAr: product.brand?.name_ar,
      sku: selectedVariant?.sku || product.sku || "",
      image: product.images[0]?.url || null,
      price: finalPrice,
      compareAtPrice: finalComparePrice || null,
      stockQuantity: currentStock,
    }, 1);
  };

  const basePrice = selectedVariant?.price_override_kwd ?? product.price_kwd;
  const baseCompareAtPrice = selectedVariant?.compare_at_price_kwd || product.compare_at_price_kwd;
  
  const hasFlashSale = flashSaleActive && product.include_in_flash_sale;
  const flashSaleDiscount = product.flash_sale_discount_percent || 0;
  
  const finalPrice = hasFlashSale 
    ? basePrice * (1 - flashSaleDiscount / 100)
    : basePrice;
    
  const finalComparePrice = hasFlashSale ? basePrice : baseCompareAtPrice;
  const discount = finalComparePrice ? Math.round(((finalComparePrice - finalPrice) / finalComparePrice) * 100) : 0;
  
  const currentStock = selectedVariant?.stock_quantity ?? product.stock_quantity;
  const isOutOfStock = currentStock <= 0;

  const breadcrumbItems = [
    ...(product.category ? [{ 
      label_en: product.category.name_en, 
      label_ar: product.category.name_ar, 
      href: `/${locale}/category/${product.category.slug}` 
    }] : []),
    { 
      label_en: product.name_en, 
      label_ar: product.name_ar, 
      href: `/${locale}/product/${product.slug}` 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      <Breadcrumbs items={breadcrumbItems} locale={locale} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Left Column: Gallery */}
        <div className="clay-shadow-white rounded-[2rem] bg-white overflow-hidden p-2">
          <ProductGallery
            images={product.images.map((img: any) => ({
              url: img.url,
              alt_en: product.name_en,
              alt_ar: product.name_ar,
            }))}
            locale={locale}
          />
        </div>

        {/* Right Column: Info */}
        <div className="space-y-5">
          {/* Title + brand */}
          <div className="space-y-3">
            {product.brand && (
              <Link
                href={`/${locale}/brand/${product.brand.slug}`}
                className="inline-block text-xs font-black text-primary uppercase tracking-widest bg-clay-sky/40 px-3 py-1 rounded-full hover:bg-clay-sky transition-all"
              >
                {isAr ? product.brand.name_ar : product.brand.name_en}
              </Link>
            )}
            <div className="flex flex-wrap items-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight flex-1">
                {isAr ? product.name_ar : product.name_en}
              </h1>
              {hasFlashSale && (
                <span className="text-xs font-black bg-clay-coral text-clay-coral-deep px-3 py-1 rounded-full uppercase tracking-wide flex-shrink-0">
                  {isAr ? "عرض بطل" : "FLASH SALE"}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-3.5 h-3.5 fill-current ${i < (product.avg_rating || 0) ? "" : "text-muted/30"}`} viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
                <span className="text-foreground font-black ms-1">{product.avg_rating || "0.0"}</span>
                <span className="text-muted-foreground ms-1">({product.review_count})</span>
              </div>
              <span className="text-muted-foreground/40">|</span>
              <span className="text-muted-foreground font-bold uppercase">SKU: {selectedVariant?.sku || product.sku || "N/A"}</span>
            </div>
          </div>

          {/* Price card */}
          <div className={`rounded-[1.75rem] p-5 space-y-3 ${hasFlashSale ? "clay-shadow-coral bg-clay-coral/10" : "clay-shadow-sky bg-clay-sky/10"}`}>
            <div className="flex items-baseline gap-3">
              <span className={`text-3xl font-black ${hasFlashSale ? "text-clay-coral-deep" : "text-primary"}`}>
                {finalPrice.toFixed(3)} {isAr ? "د.ك" : "KWD"}
              </span>
              {finalComparePrice && finalComparePrice > finalPrice && (
                <>
                  <span className="text-base text-muted-foreground line-through">
                    {finalComparePrice.toFixed(3)}
                  </span>
                  <span className="text-xs font-black bg-clay-coral text-clay-coral-deep px-2.5 py-1 rounded-full">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isOutOfStock ? "bg-clay-coral-deep" : "bg-clay-mint-deep"}`} />
              <span className={`text-sm font-black ${isOutOfStock ? "text-clay-coral-deep" : "text-clay-mint-deep"}`}>
                {isOutOfStock
                  ? (isAr ? "غير متوفر" : "Out of Stock")
                  : (currentStock < 5
                    ? (isAr ? `متوفر فقط ${currentStock} قطعة!` : `Only ${currentStock} left!`)
                    : (isAr ? "متوفر" : "In Stock"))}
              </span>
            </div>
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelect={setSelectedVariant}
              locale={locale}
            />
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1 h-13 rounded-full font-black text-base gap-2 clay-shadow-sky active:scale-[0.98] transition-all"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {isAr ? "إضافة إلى السلة" : "Add to Cart"}
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full clay-shadow-pink bg-white border-0 hover:bg-clay-pink transition-all"
              >
                <Heart className="h-5 w-5 text-clay-pink-deep" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full clay-shadow-white bg-white border-0 hover:bg-clay-sky transition-all"
              >
                <Share2 className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Trust Points */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: ShieldCheck, label: isAr ? "منتج أصلي 100%" : "Genuine", color: "clay-shadow-mint", bg: "bg-clay-mint/30", text: "text-clay-mint-deep" },
              { icon: Truck, label: isAr ? "توصيل سريع" : "Fast Delivery", color: "clay-shadow-sky", bg: "bg-clay-sky/30", text: "text-clay-sky-deep" },
              { icon: RotateCcw, label: isAr ? "إرجاع خلال 14 يوم" : "14-day Returns", color: "clay-shadow-lavender", bg: "bg-clay-lavender/30", text: "text-clay-lavender-deep" },
            ].map(({ icon: Icon, label, color, bg, text }) => (
              <div key={label} className={`${color} rounded-2xl ${bg} p-3 flex flex-col items-center gap-1.5 text-center`}>
                <Icon className={`h-4 w-4 ${text}`} />
                <span className={`text-[10px] font-black ${text} leading-tight`}>{label}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          {(product.description_ar || product.description_en) && (
            <div className="clay-shadow-white rounded-[2rem] bg-white p-5 space-y-2">
              <h3 className="text-sm font-black text-foreground">
                {isAr ? "الوصف" : "Description"}
              </h3>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                {isAr ? product.description_ar : product.description_en}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


