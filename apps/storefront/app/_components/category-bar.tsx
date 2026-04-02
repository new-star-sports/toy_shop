import { getCategories } from "@nss/db/queries";
import type { Locale } from "@/lib/i18n";
import { CategoryBarClient } from "./category-bar-client";

interface CategoryBarProps {
  locale: Locale;
  activeCategorySlug?: string;
  activeBrandSlug?: string;
}

export async function CategoryBar({ locale, activeCategorySlug, activeBrandSlug }: CategoryBarProps) {
  const categories = await getCategories();

  return (
    <CategoryBarClient
      locale={locale}
      categories={categories}
      activeCategorySlug={activeCategorySlug}
      activeBrandSlug={activeBrandSlug}
    />
  );
}
