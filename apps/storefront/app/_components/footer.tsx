import type { Locale } from "@/lib/i18n";
import { getSetting } from "@nss/db/queries";
import { FlickeringFooter } from "@/components/ui/flickering-footer";

interface FooterProps {
  locale: Locale;
}

export default async function Footer({ locale }: FooterProps) {
  const isAr = locale === "ar";
  const storeInfo = await getSetting("store_info");

  const crNumber = storeInfo?.cr_number || "[CR NUMBER]";
  const storeName = isAr
    ? storeInfo?.store_name_ar || "نيو ستار"
    : storeInfo?.store_name_en || "NewStar";
  const tagline = isAr
    ? storeInfo?.tagline_ar || "وجهتك للألعاب في الكويت"
    : storeInfo?.tagline_en || "Kuwait's home for toys";

  return (
    <FlickeringFooter
      locale={locale}
      storeName={storeName}
      tagline={tagline}
      crNumber={crNumber}
      instagramUrl={storeInfo?.instagram_url}
      whatsappNumber={storeInfo?.whatsapp_number}
      tiktokUrl={storeInfo?.tiktok_url}
    />
  );
}
