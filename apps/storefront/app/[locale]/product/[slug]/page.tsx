import { getProductBySlug } from "@nss/db/queries";
import { getActiveFlashSale } from "@/lib/marketing";
import { notFound } from "next/navigation";
import { ProductDetail } from "../../_components/catalog/product-detail";
import type { Locale } from "@/lib/i18n";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  
  const [product, activeFlashSale] = await Promise.all([
    getProductBySlug(slug),
    getActiveFlashSale(),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} locale={locale} flashSaleActive={!!activeFlashSale} />;
}
