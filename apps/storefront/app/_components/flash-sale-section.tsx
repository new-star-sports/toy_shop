"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type { ProductCard } from "@nss/db/queries";
import ProductCardComponent from "./product-card";

interface FlashSaleSectionProps {
  products: ProductCard[];
  locale: Locale;
  endTime: string;
  titleEn: string;
  titleAr: string;
}

function Countdown({ endTime, locale }: { endTime: string; locale: Locale }) {
  const isAr = locale === "ar";
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const update = () => {
      const distance = new Date(endTime).getTime() - Date.now();
      if (distance < 0) { setTimeLeft(null); return; }
      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  if (!timeLeft) return null;

  const units = [
    { val: timeLeft.hours, en: "HRS", ar: "ساعة" },
    { val: timeLeft.minutes, en: "MIN", ar: "دقيقة" },
    { val: timeLeft.seconds, en: "SEC", ar: "ثانية" },
  ];

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 hidden sm:block">
        {isAr ? "ينتهي خلال" : "Ends in"}
      </span>
      <div className="flex items-center gap-1 font-mono">
        {units.map(({ val, en, ar }, idx) => (
          <span key={idx} className="flex items-center gap-1">
            {idx > 0 && <span className="text-white/50 font-bold text-sm">:</span>}
            <span className="flex flex-col items-center">
              <span className="bg-white/20 rounded px-1.5 py-0.5 min-w-[28px] text-center text-sm font-bold tabular-nums">
                {String(val).padStart(2, "0")}
              </span>
              <span className="text-[8px] uppercase opacity-60 mt-0.5">
                {isAr ? ar : en}
              </span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function FlashSaleSection({
  products,
  locale,
  endTime,
  titleEn,
  titleAr,
}: FlashSaleSectionProps) {
  const isAr = locale === "ar";

  if (products.length === 0) return null;

  return (
    <section className="bg-background py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-red-600 rounded-t-xl">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-white fill-white" />
            <span className="text-white font-black text-base sm:text-lg uppercase tracking-wide">
              {isAr ? titleAr : titleEn}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Countdown endTime={endTime} locale={locale} />
            <Link
              href={`/${locale}/products?sale=true`}
              className={cn(
                "hidden sm:flex items-center gap-1 text-xs font-bold text-white/90",
                "hover:text-white transition-colors"
              )}
            >
              {isAr ? "عرض الكل" : "View All"}
              <ArrowRight size={12} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>

        {/* Products */}
        <div className="bg-red-50 dark:bg-red-950/20 border border-t-0 border-red-200 dark:border-red-900/30 rounded-b-xl p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {products.slice(0, 6).map((product) => (
              <ProductCardComponent
                key={product.id}
                product={product}
                locale={locale}
                flashSaleActive
              />
            ))}
          </div>
          {/* Mobile view all */}
          <div className="mt-3 flex sm:hidden justify-center">
            <Link
              href={`/${locale}/products?sale=true`}
              className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              {isAr ? "عرض جميع العروض" : "View All Deals"}
              <ArrowRight size={14} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
