import { getCategories } from "@nss/db/queries";
import type { Locale } from "@/lib/i18n";
import type { User } from "@supabase/supabase-js";
import { SiteHeaderClient } from "./site-header-client";

interface SiteHeaderProps {
  locale: Locale;
  user?: User | null;
}

export async function SiteHeader({ locale, user }: SiteHeaderProps) {
  let categories: any[] = [];
  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Failed to fetch categories in header:", error);
  }

  return (
    <SiteHeaderClient
      locale={locale}
      user={user}
      categories={categories}
    />
  );
}
