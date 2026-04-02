import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface BannerItem {
  id: string;
  title_en: string | null;
  title_ar: string | null;
  subtitle_en: string | null;
  subtitle_ar: string | null;
  image_desktop_url: string | null;
  image_mobile_url: string | null;
  cta_text_en: string | null;
  cta_text_ar: string | null;
  cta_link: string | null;
  bg_color: string | null;
}

interface EditorialBannerProps {
  banner: BannerItem;
  locale: Locale;
}

export function EditorialBanner({ banner, locale }: EditorialBannerProps) {
  const isAr = locale === "ar";
  const title = isAr ? banner.title_ar : banner.title_en;
  const subtitle = isAr ? banner.subtitle_ar : banner.subtitle_en;
  const ctaText = isAr ? banner.cta_text_ar : banner.cta_text_en;

  const hasContent = !!(title || subtitle || ctaText);

  const hasImage = !!(banner.image_desktop_url || banner.image_mobile_url);

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative rounded-[2.5rem] overflow-hidden banner-glow-sky${!hasImage ? " min-h-[200px]" : ""}`}
          style={
            banner.bg_color
              ? { backgroundColor: banner.bg_color }
              : { background: "linear-gradient(135deg, oklch(0.25 0.06 290) 0%, oklch(0.18 0.04 260) 50%, oklch(0.22 0.08 215) 100%)" }
          }
        >
          {hasImage && (
            <picture>
              <source
                media="(max-width: 639px)"
                srcSet={banner.image_mobile_url ?? banner.image_desktop_url ?? ""}
              />
              <img
                src={banner.image_desktop_url ?? banner.image_mobile_url ?? ""}
                alt={title || ""}
                className="w-full block"
                loading="eager"
                fetchPriority="high"
              />
            </picture>
          )}
          {hasContent && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent rtl:bg-gradient-to-l" />
          )}
          {banner.cta_link && !hasContent && (
            <a href={banner.cta_link} className="absolute inset-0 z-10" aria-label="View offer" />
          )}
          {hasContent && (
            <div className="absolute inset-0 z-10 p-8 sm:p-14 flex flex-col justify-center">
              <div className="max-w-lg space-y-4">
                {title && (
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight drop-shadow-md">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                    {subtitle}
                  </p>
                )}
                {ctaText && banner.cta_link && (
                  <Link
                    href={banner.cta_link}
                    className="inline-flex items-center gap-2 h-10 px-7 bg-white text-foreground font-black rounded-full text-sm hover:scale-105 transition-all duration-200 w-fit clay-shadow-white"
                  >
                    {ctaText}
                    <ArrowRight size={14} className="rtl:rotate-180" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

interface SplitPromoBannersProps {
  banners: BannerItem[];
  locale: Locale;
}

const PROMO_CLAY = [
  { shadow: "clay-shadow-peach",    fallback: "linear-gradient(135deg, oklch(0.82 0.12 55) 0%, oklch(0.70 0.14 38) 100%)" },
  { shadow: "clay-shadow-mint",     fallback: "linear-gradient(135deg, oklch(0.80 0.12 162) 0%, oklch(0.62 0.14 150) 100%)" },
];

export function SplitPromoBanners({ banners, locale }: SplitPromoBannersProps) {
  const isAr = locale === "ar";
  if (banners.length === 0) return null;

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {banners.slice(0, 2).map((banner, idx) => {
            const title = isAr ? banner.title_ar : banner.title_en;
            const ctaText = isAr ? banner.cta_text_ar : banner.cta_text_en;
            const clay = PROMO_CLAY[idx % PROMO_CLAY.length];
            const hasContent = !!(title || ctaText);

            const hasImage = !!(banner.image_desktop_url || banner.image_mobile_url);

            return (
              <div
                key={banner.id}
                className={`relative rounded-[2rem] overflow-hidden banner-glow-sky${!hasImage ? " min-h-[200px]" : ""}`}
                style={
                  banner.bg_color
                    ? { backgroundColor: banner.bg_color }
                    : { background: clay.fallback }
                }
              >
                {hasImage && (
                  <picture>
                    <source
                      media="(max-width: 639px)"
                      srcSet={banner.image_mobile_url ?? banner.image_desktop_url ?? ""}
                    />
                    <img
                      src={banner.image_desktop_url ?? banner.image_mobile_url ?? ""}
                      alt={title || ""}
                      className="w-full block"
                      loading="eager"
                      fetchPriority="high"
                    />
                  </picture>
                )}
                {hasContent && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                )}
                {banner.cta_link && !hasContent && (
                  <a href={banner.cta_link} className="absolute inset-0 z-10" aria-label="View offer" />
                )}
                {hasContent && (
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    {title && (
                      <h3 className="text-base sm:text-lg font-black text-white mb-2.5 leading-tight drop-shadow">
                        {title}
                      </h3>
                    )}
                    {ctaText && banner.cta_link && (
                      <Link
                        href={banner.cta_link}
                        className="inline-flex items-center gap-1.5 text-xs font-black text-white bg-white/25 hover:bg-white/40 px-4 py-1.5 rounded-full transition-all duration-200 clay-shadow-white hover:scale-105"
                      >
                        {ctaText}
                        <ArrowRight size={11} className="rtl:rotate-180" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
