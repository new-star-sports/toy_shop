import { getAdminBannerById } from "@nss/db/queries";
import { BannerForm } from "../../_components/banners/banner-form";
import { notFound } from "next/navigation";

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const banner = await getAdminBannerById(id);

  if (!banner) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-nss-text-primary">Edit Banner</h1>
        <p className="text-sm text-nss-text-secondary">
          Update your banner content, scheduling, and appearance.
        </p>
      </div>
      <BannerForm initialData={banner} />
    </div>
  );
}
