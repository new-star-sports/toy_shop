"use client";

import { useState } from "react";
import { ProductGallery } from "./product-gallery";
import { VariantSelector } from "./variant-selector";
import { Breadcrumbs } from "./breadcrumbs";
import { Button } from "@nss/ui/components/button";
import { Badge } from "@nss/ui/components/badge";
import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import type { ProductWithRelations } from "@nss/db/queries";
import type { Locale } from "@/lib/i18n";

interface ProductDetailProps {
  product: ProductWithRelations;
  locale: Locale;
}

export function ProductDetail({ product, locale }: ProductDetailProps) {
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
      price: price,
      compareAtPrice: compareAtPrice || null,
      stockQuantity: currentStock,
    }, 1);
  };

  const price = selectedVariant?.price_override_kwd ?? product.price_kwd;
  const compareAtPrice = selectedVariant?.compare_at_price_kwd || product.compare_at_price_kwd;
  const discount = compareAtPrice ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;
  
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbItems} locale={locale} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Gallery */}
        <ProductGallery 
          images={product.images.map((img: any) => ({ 
            url: img.url, 
            alt_en: product.name_en, 
            alt_ar: product.name_ar 
          }))} 
          locale={locale} 
        />

        {/* Right Column: Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            {product.brand && (
              <Link href={`/${locale}/brand/${product.brand.slug}`} className="text-sm font-semibold text-nss-primary uppercase tracking-widest hover:underline">
                {isAr ? product.brand.name_ar : product.brand.name_en}
              </Link>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-nss-text-primary leading-tight">
              {isAr ? product.name_ar : product.name_en}
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 fill-current ${i < (product.avg_rating || 0) ? "" : "text-gray-300"}`} viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
                <span className="text-sm text-nss-text-primary font-medium ms-1">
                  {product.avg_rating || "0.0"}
                </span>
                <span className="text-xs text-nss-text-secondary ms-1">
                  ({product.review_count} {isAr ? "تقييم" : "reviews"})
                </span>
              </div>
              <div className="h-4 w-px bg-nss-border" />
              <div className="text-xs font-medium text-nss-text-secondary uppercase tracking-wider">
                SKU: {selectedVariant?.sku || product.sku || "N/A"}
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-nss-surface p-6 rounded-3xl border border-nss-border/30">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-nss-primary">
                {price.toFixed(3)} {isAr ? "د.ك" : "KWD"}
              </span>
              {compareAtPrice && (
                <>
                  <span className="text-lg text-nss-text-secondary line-through">
                    {compareAtPrice.toFixed(3)}
                  </span>
                  <Badge className="bg-red-500 hover:bg-red-600 text-white border-none">
                    -{discount}%
                  </Badge>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isOutOfStock ? "bg-red-500" : "bg-green-500"}`} />
              <span className={`text-sm font-medium ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
                {isOutOfStock 
                  ? (isAr ? "غير متوفر" : "Out of Stock") 
                  : (currentStock < 5 
                      ? (isAr ? `متوفر فقط ${currentStock} قطعة!` : `Only ${currentStock} left!`) 
                      : (isAr ? "متوفر" : "In Stock"))
                }
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
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="flex-1 h-14 rounded-2xl text-lg font-bold gap-3 shadow-lg shadow-nss-primary/20 bg-nss-primary hover:bg-nss-primary/90 transition-all active:scale-95"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-6 w-6" />
              {isAr ? "إضافة إلى السلة" : "Add to Cart"}
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-14 w-14 rounded-2xl border-2 border-nss-border/50 hover:text-red-500 hover:border-red-500/30 transition-all active:scale-95"
              >
                <Heart className="h-6 w-6" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-14 w-14 rounded-2xl border-2 border-nss-border/50 hover:text-nss-primary hover:border-nss-primary/30 transition-all active:scale-95"
              >
                <Share2 className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Trust Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-y border-nss-border/30">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-nss-primary flex-shrink-0" />
              <span className="text-xs font-medium text-nss-text-secondary leading-tight">
                {isAr ? "منتج أصلي 100%" : "100% Genuine Product"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-nss-primary flex-shrink-0" />
              <span className="text-xs font-medium text-nss-text-secondary leading-tight">
                {isAr ? "توصيل سريع" : "Fast Delivery"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-nss-primary flex-shrink-0" />
              <span className="text-xs font-medium text-nss-text-secondary leading-tight">
                {isAr ? "إرجاع سهل خلال 14 يوم" : "Easy 14-day Returns"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-nss-text-primary">
              {isAr ? "الوصف" : "Description"}
            </h3>
            <div className="prose prose-sm max-w-none text-nss-text-secondary leading-relaxed">
              {isAr ? product.description_ar : product.description_en}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
