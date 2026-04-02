import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { ProductCard } from "@nss/db/queries";
import ProductCardComponent from "./product-card";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: ProductCard[];
  locale: Locale;
  viewAllHref?: string;
  viewAllLabel?: string;
  flashSaleActive?: boolean;
  columns?: 2 | 3 | 4 | 5;
  bgVariant?: "default" | "surface" | "muted" | "mint" | "lavender" | "peach" | "sky" | "lemon";
  maxItems?: number;
  accentColor?: "sky" | "mint" | "lavender" | "peach" | "pink" | "lemon" | "coral";
}

export function ProductSection({
  title,
  subtitle,
  products,
  locale,
  viewAllHref,
  viewAllLabel,
  flashSaleActive = false,
  columns = 4,
  bgVariant = "default",
  maxItems,
  accentColor = "sky",
}: ProductSectionProps) {
  const isAr = locale === "ar";
  const displayed = maxItems ? products.slice(0, maxItems) : products;

  if (displayed.length === 0) return null;

  const colClasses: Record<number, string> = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  };

  const bgClasses: Record<string, string> = {
    default: "",
    surface: "bg-surface",
    muted: "bg-muted/40",
    mint: "bg-clay-mint/30",
    lavender: "bg-clay-lavender/30",
    peach: "bg-clay-peach/30",
    sky: "bg-clay-sky/25",
    lemon: "bg-clay-lemon/30",
  };

  const accentClasses: Record<string, { bar: string; btn: string; btnText: string }> = {
    sky:      { bar: "bg-clay-sky-deep",      btn: "bg-clay-sky clay-shadow-sky",           btnText: "text-clay-sky-deep"      },
    mint:     { bar: "bg-clay-mint-deep",     btn: "bg-clay-mint clay-shadow-mint",         btnText: "text-clay-mint-deep"     },
    lavender: { bar: "bg-clay-lavender-deep", btn: "bg-clay-lavender clay-shadow-lavender", btnText: "text-clay-lavender-deep" },
    peach:    { bar: "bg-clay-peach-deep",    btn: "bg-clay-peach clay-shadow-peach",       btnText: "text-clay-peach-deep"    },
    pink:     { bar: "bg-clay-pink-deep",     btn: "bg-clay-pink clay-shadow-pink",         btnText: "text-clay-pink-deep"     },
    lemon:    { bar: "bg-clay-lemon-deep",    btn: "bg-clay-lemon clay-shadow-lemon",       btnText: "text-clay-lemon-deep"    },
    coral:    { bar: "bg-clay-coral-deep",    btn: "bg-clay-coral clay-shadow-coral",       btnText: "text-clay-coral-deep"    },
  };

  const accent = accentClasses[accentColor];

  return (
    <section className={cn("py-10", bgClasses[bgVariant])}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={cn("w-1.5 h-7 rounded-full shrink-0", accent.bar)} />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className={cn(
                "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black transition-all duration-200 hover:scale-105 whitespace-nowrap shrink-0",
                accent.btn, accent.btnText
              )}
            >
              {viewAllLabel ?? (isAr ? "عرض الكل" : "View All")}
              <ArrowRight size={12} className="rtl:rotate-180" />
            </Link>
          )}
        </div>

        {/* Product Grid */}
        <div className={cn("grid gap-4", colClasses[columns])}>
          {displayed.map((product) => (
            <ProductCardComponent
              key={product.id}
              product={product}
              locale={locale}
              flashSaleActive={flashSaleActive}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
