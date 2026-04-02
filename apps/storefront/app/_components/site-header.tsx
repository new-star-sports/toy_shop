import { getCategories } from "@nss/db/queries";
import type { Locale } from "@/lib/i18n";
import type { User } from "@supabase/supabase-js";
import { SiteHeaderClient } from "./site-header-client";

interface SiteHeaderProps {
  locale: Locale;
  user?: User | null;
}

export async function SiteHeader({ locale, user }: SiteHeaderProps) {
  const categories = await getCategories();

  return (
    <SiteHeaderClient
      locale={locale}
      user={user}
      categories={categories}
    />
  );
}
