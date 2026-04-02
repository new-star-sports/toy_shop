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
  bgVariant?: "default" | "surface" | "muted";
  maxItems?: number;
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
  };

  return (
    <section className={cn("py-10", bgClasses[bgVariant])}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap shrink-0"
            >
              {viewAllLabel ?? (isAr ? "عرض الكل" : "View All")}
              <ArrowRight size={14} className="rtl:rotate-180" />
            </Link>
          )}
        </div>

        {/* Product Grid */}
        <div className={cn("grid gap-3 sm:gap-4", colClasses[columns])}>
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
