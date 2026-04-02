"use client";

import Link from "next/link";
import Image from "next/image";
import type { ProductCard } from "@nss/db/queries";
import { formatKWD, getDiscountPercent, type Locale } from "@/lib/i18n";
import { Heart, Star, ImageOff, Zap } from "lucide-react";

interface ProductCardComponentProps {
  product: ProductCard;
  locale: Locale;
  flashSaleActive?: boolean;
}

export default function ProductCardComponent({ product, locale, flashSaleActive = false }: ProductCardComponentProps) {
  const isAr = locale === "ar";
  const name = isAr ? product.name_ar : product.name_en;
  const brandName = isAr ? product.brand_name_ar : product.brand_name_en;

  const hasFlashSale = flashSaleActive && product.include_in_flash_sale;
  const currentPrice = hasFlashSale
    ? product.price_kwd * (1 - (product.flash_sale_discount_percent || 0) / 100)
    : product.price_kwd;

  const comparePrice = hasFlashSale ? product.price_kwd : product.compare_at_price_kwd;
  const discount = getDiscountPercent(currentPrice, comparePrice);
  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <Link
      href={`/${locale}/product/${product.slug}`}
      className="group block bg-background rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-muted/30 overflow-hidden">
        {product.primary_image_url ? (
          <Image
            src={product.primary_image_url}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
            <ImageOff size={40} strokeWidth={1} />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 rtl:right-2.5 rtl:left-auto flex flex-col gap-1 z-10">
          {product.is_new_arrival && (
            <span className="px-2.5 py-0.5 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              {isAr ? "جديد" : "New"}
            </span>
          )}
          {hasFlashSale && (
            <span className="px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
              <Zap size={9} fill="currentColor" />
              {isAr ? "عرض" : "Sale"}
            </span>
          )}
          {discount && !hasFlashSale && (
            <span className="px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Out of Stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/70 backdrop-blur-[1px] flex items-center justify-center z-20">
            <span className="px-4 py-1.5 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-wider rounded-full">
              {isAr ? "نفد المخزون" : "Sold Out"}
            </span>
          </div>
        )}

        {/* Wishlist — always visible */}
        <button
          className="absolute top-2.5 right-2.5 rtl:left-2.5 rtl:right-auto w-8 h-8 rounded-full bg-white shadow-md border border-border/40 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors z-30"
          aria-label={isAr ? "أضف للمفضلة" : "Add to wishlist"}
          onClick={(e) => { e.preventDefault(); }}
        >
          <Heart size={15} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {brandName && (
          <p className="text-[10px] text-primary font-bold uppercase tracking-[0.12em] truncate">
            {brandName}
          </p>
        )}

        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[2.5rem]">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.round(product.avg_rating || 5) ? "fill-current" : "text-muted-foreground/25 fill-none"}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground ltr-nums">
            ({product.review_count ?? 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex flex-col">
            {comparePrice && comparePrice > currentPrice && (
              <span className="text-[11px] text-muted-foreground line-through ltr-nums">
                {formatKWD(comparePrice, locale)}
              </span>
            )}
            <span className="text-base font-bold text-primary ltr-nums">
              {formatKWD(currentPrice, locale)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
