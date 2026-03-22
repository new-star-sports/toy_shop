"use client";

import Link from "next/link";
import Image from "next/image";
import type { ProductCard } from "@nss/db/queries";
import { formatKWD, getDiscountPercent, type Locale } from "@/lib/i18n";

interface ProductCardComponentProps {
  product: ProductCard;
  locale: Locale;
}

export default function ProductCardComponent({ product, locale }: ProductCardComponentProps) {
  const isAr = locale === "ar";
  const name = isAr ? product.name_ar : product.name_en;
  const brandName = isAr ? product.brand_name_ar : product.brand_name_en;
  const discount = getDiscountPercent(product.price_kwd, product.compare_at_price_kwd);
  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group block bg-nss-card rounded-2xl border border-nss-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-nss-primary/5 hover:-translate-y-0.5"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-nss-surface overflow-hidden">
        {product.primary_image_url ? (
          <Image
            src={product.primary_image_url}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-nss-text-secondary">
            <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 rtl:right-2 rtl:left-auto flex flex-col gap-1">
          {product.is_new_arrival && (
            <span className="px-2 py-0.5 bg-nss-primary text-white text-xs font-semibold rounded-full">
              {isAr ? "جديد" : "NEW"}
            </span>
          )}
          {discount && (
            <span className="px-2 py-0.5 bg-nss-accent text-white text-xs font-semibold rounded-full">
              -{discount}%
            </span>
          )}
          {product.include_in_flash_sale && (
            <span className="px-2 py-0.5 bg-nss-danger text-white text-xs font-semibold rounded-full animate-pulse">
              🔥 {isAr ? "عرض" : "SALE"}
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="px-4 py-2 bg-nss-text-primary text-white text-sm font-semibold rounded-full">
              {isAr ? "نفد المخزون" : "Out of Stock"}
            </span>
          </div>
        )}

        {/* Quick Wishlist */}
        <button
          className="absolute top-2 right-2 rtl:left-2 rtl:right-auto w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-nss-text-secondary hover:text-nss-danger transition-colors opacity-0 group-hover:opacity-100 min-h-0 min-w-0"
          aria-label={isAr ? "أضف للمفضلة" : "Add to wishlist"}
          onClick={(e) => { e.preventDefault(); }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-3 space-y-1.5">
        {/* Brand */}
        {brandName && (
          <p className="text-xs text-nss-accent font-medium uppercase tracking-wide truncate">
            {brandName}
          </p>
        )}

        {/* Name */}
        <h3 className="text-sm font-semibold text-nss-text-primary line-clamp-2 leading-snug group-hover:text-nss-primary transition-colors">
          {name}
        </h3>

        {/* Rating */}
        {product.avg_rating && (
          <div className="flex items-center gap-1">
            <div className="flex text-nss-gold">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${i < Math.round(product.avg_rating!) ? "fill-current" : "fill-none stroke-current"}`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] text-nss-text-secondary ltr-nums">
              ({product.review_count})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-nss-primary ltr-nums">
            {formatKWD(product.price_kwd, locale)}
          </span>
          {product.compare_at_price_kwd && (
            <span className="text-xs text-nss-text-secondary line-through ltr-nums">
              {formatKWD(product.compare_at_price_kwd, locale)}
            </span>
          )}
        </div>

        {/* Age */}
        <p className="text-[10px] text-nss-text-secondary">
          {isAr ? `${product.min_age}+ سنوات` : `${product.min_age}+ years`}
        </p>
      </div>
    </Link>
  );
}
