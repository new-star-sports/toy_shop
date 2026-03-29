import Link from "next/link";
import { getAdminBanners } from "@nss/db/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui";
import { BannerTypeBadge } from "../_components/banners/type-badge";
import { ToggleBannerStatus } from "../_components/banners/toggle-status";
import { BannerActionsMenu } from "../_components/banners/actions-menu";
import type { Banner } from "@nss/db/types";
import { IconPlus, IconPhoto } from "@tabler/icons-react";

export default async function BannersPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; active?: string }>;
}) {
  const params = await searchParams;
  const typeSelection = params.type || "all";
  const activeStatus =
    params.active === "true" ? true : params.active === "false" ? false : undefined;

  const banners = await getAdminBanners({
    type: typeSelection,
    isActive: activeStatus,
  });

  const types = ["all", "hero", "announcement", "editorial", "split_promo"];
  const activeFilters = ["all", "active", "inactive"];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Banners</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage promotional banners and announcements ({banners.length} total)
          </p>
        </div>
        <Button asChild className="flex items-center gap-2">
          <Link href="/banners/new">
            <IconPlus size={16} stroke={2} />
            Add Banner
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border-border/50">
        <CardContent className="p-3 sm:p-4 flex flex-col gap-3">
          {/* Type filters */}
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <Button
                key={t}
                variant={typeSelection === t ? "default" : "outline"}
                size="sm"
                className="capitalize rounded-xl text-xs font-bold h-8"
                asChild
              >
                <Link href={`?type=${t}${activeStatus !== undefined ? `&active=${activeStatus}` : ""}`}>
                  {t.replace("_", " ")}
                </Link>
              </Button>
            ))}
          </div>
          {/* Active status filters */}
          <div className="flex gap-2">
            {activeFilters.map((s) => {
              const isActiveVal = s === "active" ? "true" : s === "inactive" ? "false" : "all";
              const currentActive = params.active || "all";
              return (
                <Button
                  key={s}
                  variant={currentActive === isActiveVal ? "default" : "outline"}
                  size="sm"
                  className="capitalize rounded-xl text-xs font-bold h-8"
                  asChild
                >
                  <Link href={`?active=${isActiveVal}${typeSelection !== "all" ? `&type=${typeSelection}` : ""}`}>
                    {s}
                  </Link>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table */}
      <Card className="hidden md:block rounded-2xl border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-muted/30 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-start">Banner</th>
                <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-start">Type</th>
                <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-start">Schedule</th>
                <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-start">Status</th>
                <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground italic text-sm">
                    No banners found matching your criteria.
                  </td>
                </tr>
              ) : (
                banners.map((banner: Banner) => (
                  <tr key={banner.id} className="hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 rounded-lg bg-muted/30 flex items-center justify-center overflow-hidden border border-border/30 shrink-0">
                          {banner.image_desktop_url ? (
                            <img src={banner.image_desktop_url} alt={banner.title_en ?? undefined} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-dynamic" style={{ '--dynamic-bg': banner.bg_color || '#e5e7eb' } as React.CSSProperties} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground line-clamp-1">{banner.title_en}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{banner.title_ar}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <BannerTypeBadge type={banner.banner_type as any} />
                    </td>
                    <td className="px-6 py-4">
                      {banner.schedule_start ? (
                        <div className="text-xs space-y-0.5">
                          <p><span className="text-muted-foreground">Start: </span>{new Date(banner.schedule_start).toLocaleDateString()}</p>
                          {banner.schedule_end && <p><span className="text-muted-foreground">End: </span>{new Date(banner.schedule_end).toLocaleDateString()}</p>}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">No schedule</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <ToggleBannerStatus id={banner.id} isActive={banner.is_active} />
                    </td>
                    <td className="px-6 py-4 text-end">
                      <BannerActionsMenu id={banner.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {banners.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground italic text-sm rounded-2xl border border-dashed border-border/60">
            No banners found.
          </div>
        ) : banners.map((banner: Banner) => (
          <Card key={banner.id} className="rounded-2xl border-border/40 overflow-hidden bg-card">
            <div className="flex items-start gap-0">
              {/* Banner preview strip */}
              <div className="w-2 self-stretch shrink-0 rounded-l-2xl bg-dynamic" style={{ '--dynamic-bg': banner.bg_color || '#e5e7eb' } as React.CSSProperties} />
              <div className="flex-1 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-16 h-10 rounded-lg bg-muted/30 flex items-center justify-center overflow-hidden border border-border/30 shrink-0">
                    {banner.image_desktop_url ? (
                      <img src={banner.image_desktop_url} alt={banner.title_en ?? undefined} className="w-full h-full object-cover" />
                    ) : (
                      <IconPhoto size={18} className="text-muted-foreground/40" stroke={1.5} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm line-clamp-1">{banner.title_en}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <BannerTypeBadge type={banner.banner_type as any} />
                      {banner.schedule_start && (
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(banner.schedule_start).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <ToggleBannerStatus id={banner.id} isActive={banner.is_active} />
                  <BannerActionsMenu id={banner.id} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
