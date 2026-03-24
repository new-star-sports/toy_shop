"use client";

import Link from "next/link";
import Image from "next/image";
import type { ProductCard } from "@nss/db/queries";
import { formatKWD, getDiscountPercent, type Locale } from "@/lib/i18n";

interface ProductCardComponentProps {
  product: ProductCard;
  locale: Locale;
}

import { 
  IconHeart, 
  IconStar, 
  IconBolt,
  IconPhotoOff
} from "@tabler/icons-react";

export default function ProductCardComponent({ product, locale, flashSaleActive = false }: ProductCardComponentProps & { flashSaleActive?: boolean }) {
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
      className="group block bg-background rounded-[32px] border border-border/40 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-muted/20 overflow-hidden">
        {product.primary_image_url ? (
          <Image
            src={product.primary_image_url}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
            <IconPhotoOff size={48} stroke={1} />
          </div>
        )}

        {/* Badges Container */}
        <div className="absolute top-3 left-3 rtl:right-3 rtl:left-auto flex flex-col gap-1.5 z-10">
          {product.is_new_arrival && (
            <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20">
              {isAr ? "جديد" : "New"}
            </span>
          )}
          {hasFlashSale && (
            <span className="px-3 py-1 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-accent/20 flex items-center gap-1 animate-pulse">
              <IconBolt size={10} fill="currentColor" />
              {isAr ? "بطل" : "Sale"}
            </span>
          )}
          {discount && !hasFlashSale && (
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border border-primary/10">
              -{discount}%
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="px-5 py-2 bg-zinc-900 text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-2xl">
              {isAr ? "نفد المخزون" : "Sold Out"}
            </span>
          </div>
        )}

        {/* Quick Wishlist */}
        <button
          className="absolute top-3 right-3 rtl:left-3 rtl:right-auto w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-white transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 duration-300 z-30 min-h-0 min-w-0"
          aria-label={isAr ? "أضف للمفضلة" : "Add to wishlist"}
          onClick={(e) => { e.preventDefault(); }}
        >
          <IconHeart size={20} className="transition-transform active:scale-125" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 pt-4 space-y-3">
        <div className="space-y-1">
          {brandName && (
            <p className="text-[10px] text-accent font-black uppercase tracking-[0.15em] truncate">
              {brandName}
            </p>
          )}

          <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors min-h-[2.5rem]">
            {name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <IconStar
                key={i}
                size={12}
                className={i < Math.round(product.avg_rating || 5) ? "fill-current" : "text-muted-foreground/30"}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-muted-foreground ltr-nums">
            {product.avg_rating ? `(${product.review_count})` : "(0)"}
          </span>
        </div>

        {/* Price & Actions */}
        <div className="flex items-end justify-between gap-2 pt-1">
          <div className="flex flex-col">
            {comparePrice && comparePrice > currentPrice && (
              <span className="text-[11px] text-muted-foreground line-through decoration-destructive/50 ltr-nums font-medium">
                {formatKWD(comparePrice, locale)}
              </span>
            )}
            <span className={`text-lg font-black ltr-nums tracking-tight ${hasFlashSale ? 'text-accent' : 'text-primary'}`}>
              {formatKWD(currentPrice, locale)}
            </span>
          </div>

          <div className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
            <IconBolt size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
