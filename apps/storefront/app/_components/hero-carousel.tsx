"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroBanner {
  id: string;
  title_en: string | null;
  title_ar: string | null;
  subtitle_en: string | null;
  subtitle_ar: string | null;
  image_desktop_url: string | null;
  image_mobile_url: string | null;
  video_desktop_url: string | null;
  video_mobile_url: string | null;
  cta_text_en: string | null;
  cta_text_ar: string | null;
  cta_link: string | null;
  bg_color: string | null;
}

interface HeroCarouselProps {
  banners: HeroBanner[];
  locale: "en" | "ar";
  autoPlayInterval?: number;
  aspectRatio?: string;
}

export function HeroCarousel({
  banners,
  locale,
  autoPlayInterval = 4500,
  aspectRatio = "aspect-[16/8] sm:aspect-[16/9]",
}: HeroCarouselProps) {
  const isAr = locale === "ar";

  // Tier logic
  const count = banners.length;
  const isOne = count === 1;
  const isTwo = count === 2;
  const isMany = count >= 3;

  // slide flex-basis per tier
  const slideBasis = isOne ? "100%" : isTwo ? "50%" : "44%";
  // only loop/autoplay for 3+
  const shouldLoop = isMany;
  const shouldAutoplay = isMany;

  // Duplicate slides so Embla has enough track for seamless looping.
  // 3 slides × 44% = 132% — not enough. 6 slides × 44% = 264% — sufficient.
  const displayBanners = shouldLoop && count < 6
    ? [...banners, ...banners]
    : banners;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: shouldLoop,
    direction: isAr ? "rtl" : "ltr",
    align: "start",
    containScroll: shouldLoop ? false : isOne ? "trimSnaps" : "keepSnaps",
    dragFree: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || !shouldAutoplay) return;
    const interval = setInterval(() => emblaApi.scrollNext(), autoPlayInterval);
    return () => clearInterval(interval);
  }, [emblaApi, autoPlayInterval, shouldAutoplay]);

  if (count === 0) {
    return (
      <div className={cn(aspectRatio, "relative w-full overflow-hidden rounded-[2rem] flex items-center clay-shadow-sky")}
        style={{ background: "linear-gradient(135deg, oklch(0.75 0.12 215) 0%, oklch(0.55 0.19 215) 100%)" }}
      >
        <div className="px-10 space-y-3 text-white">
          <p className="text-xs font-black uppercase tracking-widest opacity-70">
            {isAr ? "ألعاب أصلية 100%" : "100% Genuine Toys"}
          </p>
          <h2 className="text-3xl sm:text-5xl font-black leading-tight drop-shadow-md">
            {isAr ? "اكتشف عالم الألعاب" : "Discover the World of Play"}
          </h2>
          <p className="text-sm opacity-75 max-w-md">
            {isAr
              ? "وجهتك الأولى لأفضل الألعاب والماركات العالمية في الكويت"
              : "Kuwait's premier destination for the best toys and global brands"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Banner strip */}
      <div className={cn(
        "relative group overflow-hidden",
        isOne && "rounded-[2rem] clay-shadow-sky"
      )}>
        <div ref={emblaRef} className="overflow-hidden">
          <div className={cn("flex", !isOne && "gap-3 px-1")}>
            {displayBanners.map((banner, slideIdx) => {
              const video = banner.video_desktop_url || banner.video_mobile_url;
              const desktopImg = banner.image_desktop_url;
              const mobileImg = banner.image_mobile_url;
              const img = desktopImg || mobileImg;
              const hasMedia = !!(video || img);
              const title = isAr ? banner.title_ar : banner.title_en;
              const subtitle = isAr ? banner.subtitle_ar : banner.subtitle_en;
              const ctaText = isAr ? banner.cta_text_ar : banner.cta_text_en;

              const SlideWrapper = banner.cta_link ? Link : "div";
              const slideWrapperProps = banner.cta_link
                ? { href: banner.cta_link, className: cn("relative flex-shrink-0 overflow-hidden rounded-[1.75rem] block", aspectRatio, !hasMedia && "clay-shadow-sky"), style: { flex: `0 0 ${slideBasis}`, ...(!hasMedia ? { background: banner.bg_color || "linear-gradient(135deg, oklch(0.75 0.12 215) 0%, oklch(0.55 0.19 215) 100%)" } : {}) } }
                : { className: cn("relative flex-shrink-0 overflow-hidden rounded-[1.75rem]", aspectRatio, !hasMedia && "clay-shadow-sky"), style: { flex: `0 0 ${slideBasis}`, ...(!hasMedia ? { background: banner.bg_color || "linear-gradient(135deg, oklch(0.75 0.12 215) 0%, oklch(0.55 0.19 215) 100%)" } : {}) } };

              return (
                <SlideWrapper
                  key={`${banner.id}-${slideIdx}`}
                  {...(slideWrapperProps as any)}
                >
                  {/* Video takes priority */}
                  {video && (
                    <video
                      src={video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  {/* Image shown only when no video */}
                  {!video && img && (
                    <picture>
                      <source
                        media="(max-width: 639px)"
                        srcSet={mobileImg ?? desktopImg ?? ""}
                      />
                      <img
                        src={desktopImg ?? mobileImg ?? ""}
                        alt={title || ""}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </picture>
                  )}

                  {/* No-media branded fallback */}
                  {!hasMedia && (
                    <div className="absolute inset-0 flex items-center px-8">
                      <div className="text-white space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest opacity-70">
                          {isAr ? "ألعاب أصلية 100%" : "100% Genuine Toys"}
                        </p>
                        <h2 className="text-2xl sm:text-4xl font-black leading-tight drop-shadow-md">
                          {isAr ? "اكتشف عالم الألعاب" : "Discover the World of Play"}
                        </h2>
                        <p className="text-xs sm:text-sm opacity-75 max-w-md">
                          {isAr
                            ? "وجهتك الأولى لأفضل الألعاب والماركات العالمية في الكويت"
                            : "Kuwait's premier destination for the best toys and global brands"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Text overlay for banners with title/CTA */}
                  {(title || ctaText) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent rtl:bg-gradient-to-l flex items-center">
                      <div className={cn(
                        "px-6 sm:px-9 space-y-3 max-w-xs sm:max-w-md",
                        isAr && "mr-auto pr-6 sm:pr-9 pl-0 text-right"
                      )}>
                        {title && (
                          <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-white leading-tight drop-shadow-md">
                            {title}
                          </h2>
                        )}
                        {subtitle && (
                          <p className="text-xs text-white/80 leading-relaxed line-clamp-2 hidden sm:block">
                            {subtitle}
                          </p>
                        )}
                        {ctaText && banner.cta_link && (
                          <Link
                            href={banner.cta_link}
                            className="inline-flex items-center gap-1.5 h-9 sm:h-10 px-5 sm:px-6 bg-white text-primary font-black rounded-full text-xs hover:scale-105 transition-all duration-200 clay-shadow-white"
                          >
                            {ctaText}
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </SlideWrapper>
              );
            })}
          </div>
        </div>

        {/* Prev / Next arrows — clay circle buttons */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white clay-shadow-white text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-200 z-10"
            >
              <ChevronLeft size={17} />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white clay-shadow-white text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-200 z-10"
            >
              <ChevronRight size={17} />
            </button>
          </>
        )}
      </div>

      {/* Dot indicators — clay pills */}
      {count > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                idx === selectedIndex % count
                  ? "bg-primary w-6 clay-shadow-sky"
                  : "bg-border w-2 hover:bg-muted-foreground"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
