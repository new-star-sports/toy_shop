import { getProductBySlug } from "@nss/db/queries";
import { notFound } from "next/navigation";
import { ProductDetail } from "../../_components/catalog/product-detail";
import type { Locale } from "@/lib/i18n";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} locale={locale} />;
}
