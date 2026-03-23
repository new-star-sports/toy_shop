import Link from "next/link";
import { getAdminBanners } from "@nss/db/queries";
import { Button } from "@nss/ui/components/button";
import { BannerTypeBadge } from "../_components/banners/type-badge";
import { ToggleBannerStatus } from "../_components/banners/toggle-status";
import { DeleteBannerButton } from "../_components/banners/delete-button";
import type { Banner } from "@nss/db/types";

export default async function BannersPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; active?: string }>;
}) {
  const params = await searchParams;
  const typeSelection = params.type || "all";
  const activeStatus = params.active === "true" ? true : params.active === "false" ? false : undefined;

  const banners = await getAdminBanners({
    type: typeSelection,
    isActive: activeStatus,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nss-text-primary">Banners</h1>
          <p className="text-sm text-nss-text-secondary">
            Manage your store's promotional banners and announcements ({banners.length} total)
          </p>
        </div>
        <Button asChild>
          <Link href="/banners/new">
            <span className="me-2">+</span> Add Banner
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-nss-card p-4 rounded-xl border border-nss-border">
        <div className="flex flex-wrap gap-2">
          {["all", "hero", "announcement", "editorial", "split_promo"].map((t) => (
            <Button
              key={t}
              variant={typeSelection === t ? "default" : "outline"}
              size="sm"
              className="capitalize"
              asChild
            >
              <Link href={`?type=${t}${activeStatus !== undefined ? `&active=${activeStatus}` : ""}`}>
                {t.replace("_", " ")}
              </Link>
            </Button>
          ))}
        </div>
        <div className="border-s border-nss-border mx-2 hidden sm:block h-8" />
        <div className="flex gap-2">
          {["all", "active", "inactive"].map((s) => {
            const isActive = s === "active" ? "true" : s === "inactive" ? "false" : "all";
            const currentActive = params.active || "all";
            return (
              <Button
                key={s}
                variant={currentActive === isActive ? "default" : "outline"}
                size="sm"
                className="capitalize"
                asChild
              >
                <Link href={`?active=${isActive}${typeSelection !== "all" ? `&type=${typeSelection}` : ""}`}>
                  {s}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-nss-card rounded-xl border border-nss-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-nss-surface text-nss-text-secondary border-b border-nss-border">
              <tr>
                <th className="px-6 py-3 font-semibold text-start">Banner</th>
                <th className="px-6 py-3 font-semibold text-start">Type</th>
                <th className="px-6 py-3 font-semibold text-start">Schedule</th>
                <th className="px-6 py-3 font-semibold text-start">Status</th>
                <th className="px-6 py-3 font-semibold text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nss-border">
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-nss-text-secondary">
                    No banners found matching your criteria.
                  </td>
                </tr>
              ) : (
                banners.map((banner: Banner) => (
                  <tr key={banner.id} className="hover:bg-nss-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 rounded bg-nss-surface flex items-center justify-center overflow-hidden border border-nss-border">
                          {banner.image_desktop_url ? (
                            <img
                              src={banner.image_desktop_url}
                              alt={banner.title_en}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div 
                              className="w-full h-full" 
                              style={{ backgroundColor: banner.bg_color || '#e5e7eb' }}
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-nss-text-primary line-clamp-1">
                            {banner.title_en}
                          </p>
                          <p className="text-xs text-nss-text-secondary line-clamp-1">
                            {banner.title_ar}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <BannerTypeBadge type={banner.banner_type as any} />
                    </td>
                    <td className="px-6 py-4">
                      {banner.schedule_start ? (
                        <div className="text-xs space-y-1">
                          <p><span className="text-nss-text-secondary">Start:</span> {new Date(banner.schedule_start).toLocaleDateString()}</p>
                          {banner.schedule_end && (
                            <p><span className="text-nss-text-secondary">End:</span> {new Date(banner.schedule_end).toLocaleDateString()}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-nss-text-secondary text-xs italic italic">No schedule</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <ToggleBannerStatus id={banner.id} isActive={banner.is_active} />
                    </td>
                    <td className="px-6 py-4 text-end space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/banners/${banner.id}`}>Edit</Link>
                      </Button>
                      <DeleteBannerButton id={banner.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
