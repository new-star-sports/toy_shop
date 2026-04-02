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

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[300px]"
          style={
            banner.bg_color
              ? { backgroundColor: banner.bg_color }
              : { background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }
          }
        >
          {(banner.image_desktop_url || banner.image_mobile_url) && (
            <picture>
              <source
                media="(max-width: 639px)"
                srcSet={banner.image_mobile_url ?? banner.image_desktop_url ?? ""}
              />
              <img
                src={banner.image_desktop_url ?? banner.image_mobile_url ?? ""}
                alt={title || ""}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </picture>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent rtl:bg-gradient-to-l" />
          <div className="relative z-10 p-8 sm:p-12 flex flex-col justify-center h-full min-h-[200px] sm:min-h-[260px]">
            <div className="max-w-lg space-y-3">
              {title && (
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                  {subtitle}
                </p>
              )}
              {ctaText && banner.cta_link && (
                <Link
                  href={banner.cta_link}
                  className="inline-flex items-center gap-2 h-10 px-6 bg-primary text-white font-bold rounded-full text-sm hover:bg-primary/90 transition-all w-fit"
                >
                  {ctaText}
                  <ArrowRight size={14} className="rtl:rotate-180" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface SplitPromoBannersProps {
  banners: BannerItem[];
  locale: Locale;
}

export function SplitPromoBanners({ banners, locale }: SplitPromoBannersProps) {
  const isAr = locale === "ar";
  if (banners.length === 0) return null;

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {banners.slice(0, 2).map((banner) => {
            const title = isAr ? banner.title_ar : banner.title_en;
            const ctaText = isAr ? banner.cta_text_ar : banner.cta_text_en;

            return (
              <div
                key={banner.id}
                className="relative rounded-xl overflow-hidden aspect-[16/7] group"
                style={
                  banner.bg_color
                    ? { backgroundColor: banner.bg_color }
                    : { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }
                }
              >
                {(banner.image_desktop_url || banner.image_mobile_url) && (
                  <picture>
                    <source
                      media="(max-width: 639px)"
                      srcSet={banner.image_mobile_url ?? banner.image_desktop_url ?? ""}
                    />
                    <img
                      src={banner.image_desktop_url ?? banner.image_mobile_url ?? ""}
                      alt={title || ""}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </picture>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {title && (
                    <h3 className="text-base sm:text-lg font-black text-white mb-2 leading-tight">
                      {title}
                    </h3>
                  )}
                  {ctaText && banner.cta_link && (
                    <Link
                      href={banner.cta_link}
                      className="inline-flex items-center gap-1 text-xs font-bold text-white bg-white/20 hover:bg-white/30 border border-white/30 px-4 py-1.5 rounded-full transition-all"
                    >
                      {ctaText}
                      <ArrowRight size={12} className="rtl:rotate-180" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
