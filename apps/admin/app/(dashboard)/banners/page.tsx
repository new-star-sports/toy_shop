import Link from "next/link";
import { Suspense } from "react";
import { getAdminBanners } from "@nss/db/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui";
import { BannerTypeBadge } from "../_components/banners/type-badge";
import { ToggleBannerStatus } from "../_components/banners/toggle-status";
import { BannerActionsMenu } from "../_components/banners/actions-menu";
import type { Banner } from "@nss/db/types";
import { IconPlus, IconPhoto, IconVideo, IconAlertCircle, IconSpeakerphone, IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";

const TYPE_GRADIENTS: Record<string, string> = {
  hero: "from-emerald-500 to-teal-600",
  announcement: "from-teal-500 to-cyan-600",
  editorial: "from-violet-500 to-purple-600",
  split_promo: "from-orange-500 to-amber-600",
};

function BannerThumbnail({ banner }: { banner: Banner }) {
  if (banner.image_desktop_url) {
    return (
      <img
        src={banner.image_desktop_url}
        alt={banner.title_en ?? "Banner"}
        className="w-full h-full object-cover"
      />
    );
  }
  if ((banner as any).video_desktop_url) {
    return (
      <div className={`w-full h-full bg-gradient-to-br ${TYPE_GRADIENTS[banner.banner_type] ?? "from-gray-400 to-gray-600"} flex items-center justify-center`}>
        <IconVideo size={18} className="text-white/80" stroke={1.5} />
      </div>
    );
  }
  return (
    <div className={`w-full h-full bg-gradient-to-br ${TYPE_GRADIENTS[banner.banner_type] ?? "from-gray-400 to-gray-600"} flex items-center justify-center`}>
      <IconPhoto size={18} className="text-white/50" stroke={1.5} />
    </div>
  );
}

export default async function BannersPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; active?: string }>;
}) {
  const params = await searchParams;
  
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <IconSpeakerphone size={26} className="text-primary" stroke={1.5} />
            Banners
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage promotional banners and announcements</p>
        </div>
        <Button asChild className="flex items-center gap-2">
          <Link href="/banners/new">
            <IconPlus size={16} stroke={2} />
            Add Banner
          </Link>
        </Button>
      </div>

      <Suspense fallback={<BannerListSkeleton />}>
        <BannerList type={params.type} active={params.active} />
      </Suspense>
    </div>
  );
}

async function BannerList({ type, active }: { type?: string; active?: string }) {
  const typeSelection = type || "all";
  const activeStatus =
    active === "true" ? true : active === "false" ? false : undefined;

  let banners: Banner[] = [];
  let fetchError: string | null = null;

  try {
    banners = await getAdminBanners({ type: typeSelection, isActive: activeStatus });
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to load banners";
    console.error("BannersPage fetch error:", err);
  }

  const types = ["all", "hero", "announcement", "editorial", "split_promo"];
  const activeFilters = ["all", "active", "inactive"];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Banners</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage promotional banners and announcements
            {!fetchError && ` (${banners.length} total)`}
          </p>
        </div>
        <Button asChild className="flex items-center gap-2">
          <Link href="/banners/new">
            <IconPlus size={16} stroke={2} />
            Add Banner
          </Link>
        </Button>
      </div>

      {/* Error state */}
      {fetchError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <IconAlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" stroke={2} />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Failed to load banners</p>
            <p className="text-xs text-red-500 mt-0.5">{fetchError}</p>
          </div>
        </div>
      )}

      {/* Search */}
      <Card className="rounded-2xl border-border/50">
        <CardContent className="p-3 sm:p-4">
          <div className="relative w-full sm:max-w-sm">
            <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" stroke={1.5} />
            <Input placeholder="Search banners..." className="pl-10 h-10 rounded-xl w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="rounded-2xl border-border/50">
        <CardContent className="p-3 sm:p-4 flex flex-col gap-3">
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
          <div className="flex gap-2">
            {activeFilters.map((s) => {
              const isActiveVal = s === "active" ? "true" : s === "inactive" ? "false" : "all";
              const currentActive = active || "all";
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
                <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-start">Media</th>
                <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-start">Schedule</th>
                <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-start">Status</th>
                <th className="px-6 py-3 font-bold text-[11px] uppercase tracking-widest text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {banners.length === 0 && !fetchError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-muted/40 flex items-center justify-center">
                        <IconPhoto size={22} className="text-muted-foreground/50" stroke={1.5} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">No banners yet</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Create your first banner to get started.</p>
                      </div>
                      <Button asChild size="sm" className="mt-1">
                        <Link href="/banners/new"><IconPlus size={14} stroke={2} className="mr-1.5" />Add Banner</Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                banners.map((banner: Banner) => (
                  <tr key={banner.id} className="hover:bg-muted/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-12 rounded-xl overflow-hidden border border-border/30 shrink-0 bg-muted/20">
                          <BannerThumbnail banner={banner} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground line-clamp-1 text-sm">
                            {banner.title_en ?? <span className="text-muted-foreground italic font-normal">Untitled</span>}
                          </p>
                          {banner.title_ar && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 font-arabic" dir="rtl">
                              {banner.title_ar}
                            </p>
                          )}
                          <p className="text-[10px] text-muted-foreground/60 mt-0.5">#{banner.display_order}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <BannerTypeBadge type={banner.banner_type as any} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        {(banner as any).video_desktop_url && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-muted text-foreground border border-border/60 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                            Video
                          </span>
                        )}
                        {banner.image_desktop_url && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-muted text-foreground border border-border/60 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            Image
                          </span>
                        )}
                        {!(banner as any).video_desktop_url && !banner.image_desktop_url && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border/60 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                            None
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {banner.schedule_start ? (
                        <div className="text-xs space-y-0.5">
                          <p><span className="text-muted-foreground">From: </span>{new Date(banner.schedule_start).toLocaleDateString()}</p>
                          {banner.schedule_end && (
                            <p><span className="text-muted-foreground">To: </span>{new Date(banner.schedule_end).toLocaleDateString()}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Always on</span>
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
        {banners.length === 0 && !fetchError ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border/60">
            <IconPhoto size={32} className="mx-auto mb-3 text-muted-foreground/30" stroke={1.5} />
            <p className="text-sm font-semibold text-foreground mb-1">No banners yet</p>
            <p className="text-xs text-muted-foreground mb-4">Create your first banner to get started.</p>
            <Button asChild size="sm">
              <Link href="/banners/new"><IconPlus size={14} stroke={2} className="mr-1.5" />Add Banner</Link>
            </Button>
          </div>
        ) : banners.map((banner: Banner) => (
          <Card key={banner.id} className="rounded-2xl border-border/40 overflow-hidden bg-card">
            <div className="flex items-start">
              {/* Left accent strip */}
              <div className={`w-1.5 self-stretch shrink-0 bg-gradient-to-b ${TYPE_GRADIENTS[banner.banner_type] ?? "from-gray-400 to-gray-500"}`} />
              <div className="flex-1 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-20 h-12 rounded-xl overflow-hidden border border-border/30 shrink-0 bg-muted/20">
                    <BannerThumbnail banner={banner} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm line-clamp-1">
                      {banner.title_en ?? <span className="text-muted-foreground italic font-normal">Untitled</span>}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <BannerTypeBadge type={banner.banner_type as any} />
                      {(banner as any).video_desktop_url && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                          Video
                        </span>
                      )}
                    </div>
                    {banner.schedule_start && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(banner.schedule_start).toLocaleDateString()}
                        {banner.schedule_end && ` → ${new Date(banner.schedule_end).toLocaleDateString()}`}
                      </p>
                    )}
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

function BannerListSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-14 bg-muted/20 rounded-2xl w-full" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 bg-muted/10 rounded-2xl w-full" />
      ))}
    </div>
  );
}
