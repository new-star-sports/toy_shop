import { BannerForm } from "../../_components/banners/banner-form";
import { getCategories } from "@nss/db/queries";
import { getBrands } from "@nss/db/queries";

export default async function NewBannerPage() {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ])

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-nss-text-primary">Create New Banner</h1>
        <p className="text-sm text-nss-text-secondary">
          Add a new promotional slider, announcement, or editorial banner to your storefront.
        </p>
      </div>
      <BannerForm categories={categories} brands={brands} />
    </div>
  );
}
