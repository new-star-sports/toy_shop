import Link from "next/link";
import { ChevronRight, ChevronLeft, Home } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface BreadcrumbsProps {
  items: { label_en: string; label_ar: string; href: string }[];
  locale: Locale;
}

export function Breadcrumbs({ items, locale }: BreadcrumbsProps) {
  const isAr = locale === "ar";
  const Arrow = isAr ? ChevronLeft : ChevronRight;

  return (
    <nav className="flex mb-6 overflow-x-auto pb-1" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground whitespace-nowrap">
        <li>
          <Link href={`/${locale}`} className="hover:text-primary transition-colors flex items-center">
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2 space-x-reverse">
            <Arrow className="h-4 w-4 flex-shrink-0 opacity-50" />
            <Link
              href={item.href}
              className={`hover:text-primary transition-colors ${
                index === items.length - 1 ? "font-semibold text-foreground" : ""
              }`}
            >
              {isAr ? item.label_ar : item.label_en}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
