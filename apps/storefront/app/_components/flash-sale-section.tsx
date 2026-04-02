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
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-white/70 hidden sm:block">
        {isAr ? "ينتهي خلال" : "Ends in"}
      </span>
      <div className="flex items-center gap-1 font-mono">
        {units.map(({ val, en, ar }, idx) => (
          <span key={idx} className="flex items-center gap-1">
            {idx > 0 && <span className="text-white/60 font-black text-sm">:</span>}
            <span className="flex flex-col items-center">
              <span
                className="rounded-xl px-2 py-1 min-w-[34px] text-center text-sm font-black tabular-nums text-clay-coral-deep"
                style={{ background: "rgba(255,255,255,0.92)", boxShadow: "0 2px 8px -1px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.8)" }}
              >
                {String(val).padStart(2, "0")}
              </span>
              <span className="text-[8px] font-black uppercase text-white/70 mt-0.5">
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
    <section className="py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] overflow-hidden clay-shadow-coral">
          {/* Header Bar */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ background: "linear-gradient(135deg, oklch(0.62 0.18 28) 0%, oklch(0.72 0.16 18) 100%)" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center clay-shadow-white">
                <Zap size={18} className="text-white fill-white" />
              </div>
              <span className="text-white font-black text-base sm:text-lg uppercase tracking-wide drop-shadow">
                {isAr ? titleAr : titleEn}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Countdown endTime={endTime} locale={locale} />
              <Link
                href={`/${locale}/products?sale=true`}
                className={cn(
                  "hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-black",
                  "hover:bg-white/30 transition-all duration-200"
                )}
              >
                {isAr ? "عرض الكل" : "View All"}
                <ArrowRight size={11} className="rtl:rotate-180" />
              </Link>
            </div>
          </div>

          {/* Products */}
          <div className="bg-clay-coral/20 p-4">
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
            <div className="mt-4 flex sm:hidden justify-center">
              <Link
                href={`/${locale}/products?sale=true`}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-clay-coral clay-shadow-coral text-clay-coral-deep text-sm font-black"
              >
                {isAr ? "عرض جميع العروض" : "View All Deals"}
                <ArrowRight size={13} className="rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
