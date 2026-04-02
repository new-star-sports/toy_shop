"use client"

import { useEffect, useState, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { bannerSchema } from "@nss/validators/banner"
import { createBanner, updateBanner } from "../../banners/_actions"
import { useRouter } from "next/navigation"
import type { Category, Brand } from "@nss/db/types"

import { Button, Card, Input, Label, Textarea, Switch, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui"
import { FileUpload } from "@/components/ui/file-upload"
import { toast } from "sonner"
import { translateToArabic } from "../../_lib/translate"
import { cn } from "@/lib/utils"
import {
  IconPhoto,
  IconSpeakerphone,
  IconArticle,
  IconLayoutColumns,
  IconVideo,
  IconAlertCircle,
  IconPhotoOff,
  IconCalendar,
  IconDeviceDesktop,
  IconDeviceMobile,
} from "@tabler/icons-react"

const datetimeOrEmpty = z
  .string()
  .or(z.literal(""))
  .transform(v => {
    if (!v) return null
    const d = new Date(v)
    return isNaN(d.getTime()) ? null : d.toISOString()
  })
  .optional()
  .nullable()

const bannerFormSchema = bannerSchema.extend({
  title_ar: z.string().optional().nullable(),
  subtitle_ar: z.string().optional().nullable(),
  cta_text_ar: z.string().optional().nullable(),
  category_id: z.string().optional().nullable(),
  brand_id: z.string().optional().nullable(),
  schedule_start: datetimeOrEmpty,
  schedule_end: datetimeOrEmpty,
  countdown_end: datetimeOrEmpty,
})

type BannerFormValues = z.infer<typeof bannerFormSchema>

const BANNER_TYPES = [
  {
    value: "hero" as const,
    icon: IconPhoto,
    label: "Hero Slider",
    description: "Full-width banner with image or video",
  },
  {
    value: "announcement" as const,
    icon: IconSpeakerphone,
    label: "Announcement",
    description: "Thin bar for offers & alerts — text only",
  },
  {
    value: "editorial" as const,
    icon: IconArticle,
    label: "Editorial",
    description: "Mid-page content banner",
  },
  {
    value: "split_promo" as const,
    icon: IconLayoutColumns,
    label: "Split Promo",
    description: "Two side-by-side panels",
  },
]

function toDateTimeLocal(iso: string | null | undefined): string {
  if (!iso) return ""
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return ""
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch {
    return ""
  }
}

interface BannerFormProps {
  initialData?: any
  categories?: Category[]
  brands?: Brand[]
}

export function BannerForm({ initialData, categories = [], brands = [] }: BannerFormProps) {
  const router = useRouter()
  const [mediaTab, setMediaTab] = useState<"image" | "video">("video")
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const isMountedRef = useRef(false)

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema) as any,
    defaultValues: {
      banner_type: initialData?.banner_type ?? "hero",
      title_en: initialData?.title_en ?? "",
      subtitle_en: initialData?.subtitle_en ?? "",
      cta_text_en: initialData?.cta_text_en ?? "",
      cta_link: initialData?.cta_link ?? "",
      image_desktop_url: initialData?.image_desktop_url ?? "",
      image_mobile_url: initialData?.image_mobile_url ?? "",
      video_desktop_url: initialData?.video_desktop_url ?? "",
      video_mobile_url: initialData?.video_mobile_url ?? "",
      display_order: initialData?.display_order ?? 0,
      is_active: initialData?.is_active ?? true,
      schedule_start: toDateTimeLocal(initialData?.schedule_start),
      schedule_end: toDateTimeLocal(initialData?.schedule_end),
      countdown_end: toDateTimeLocal(initialData?.countdown_end),
      slot: initialData?.slot ?? "left",
      category_id: initialData?.category_id ?? null,
      brand_id: initialData?.brand_id ?? null,
    },
  })

  const bannerType = form.watch("banner_type")
  const watchCategoryId = form.watch("category_id")
  const watchBrandId = form.watch("brand_id")
  const watchDesktopImage = form.watch("image_desktop_url")
  const watchMobileImage = form.watch("image_mobile_url")
  const watchDesktopVideo = form.watch("video_desktop_url")
  const watchMobileVideo = form.watch("video_mobile_url")
  const watchTitle = form.watch("title_en")
  const watchSubtitle = form.watch("subtitle_en")
  const watchSlot = form.watch("slot")

  const isAnnouncement = bannerType === "announcement"
  const isSplitPromo = bannerType === "split_promo"

  // Track mount to suppress warnings on initial load
  useEffect(() => { isMountedRef.current = true }, [])

  useEffect(() => {
    if (!isMountedRef.current) return
    if (!watchCategoryId || watchCategoryId === "none") return
    if (watchBrandId && watchBrandId !== "none") {
      form.setValue("brand_id", null)
      toast.info("Navigation changed from brand \u2192 category.")
    }
    const cat = categories.find(c => c.id === watchCategoryId)
    if (cat) form.setValue("cta_link", `/categories/${(cat as any).slug ?? ""}`)
  }, [watchCategoryId])

  useEffect(() => {
    if (!isMountedRef.current) return
    if (!watchBrandId || watchBrandId === "none") return
    if (watchCategoryId && watchCategoryId !== "none") {
      form.setValue("category_id", null)
      toast.info("Navigation changed from category \u2192 brand.")
    }
    const brand = brands.find(b => b.id === watchBrandId)
    if (brand) form.setValue("cta_link", `/brands/${(brand as any).slug ?? ""}`)
  }, [watchBrandId])

  const onSubmit = async (data: BannerFormValues) => {
    try {
      const bannerData = {
        ...data,
        title_ar: data.title_en ? await translateToArabic(data.title_en) : null,
        subtitle_ar: data.subtitle_en ? await translateToArabic(data.subtitle_en) : null,
        cta_text_ar: data.cta_text_en ? await translateToArabic(data.cta_text_en) : null,
        category_id: data.category_id === "none" ? null : data.category_id,
        brand_id: data.brand_id === "none" ? null : data.brand_id,
      }

      if (initialData?.id) {
        const result = await updateBanner(initialData.id, bannerData)
        if (result.success) {
          toast.success("Banner updated successfully!")
          router.push("/banners")
          router.refresh()
        } else {
          toast.error("Error updating banner: " + result.error)
        }
      } else {
        const result = await createBanner(bannerData as any)
        if (result.success) {
          toast.success("Banner created successfully!")
          router.push("/banners")
          router.refresh()
        } else {
          toast.error("Error creating banner: " + result.error)
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      toast.error("Unexpected error: " + message)
    }
  }

  // Resolve media based on preview mode
  const previewImageUrl = previewMode === "mobile"
    ? (watchMobileImage || watchDesktopImage)
    : watchDesktopImage
  const previewVideoUrl = previewMode === "mobile"
    ? (watchMobileVideo || watchDesktopVideo)
    : watchDesktopVideo
  const previewMediaUrl = previewVideoUrl || previewImageUrl
  const previewIsVideo = !!previewVideoUrl

  const PreviewMedia = () => previewMediaUrl ? (
    previewIsVideo ? (
      <video key={previewMediaUrl} src={previewMediaUrl} className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
    ) : (
      <img key={previewMediaUrl} src={previewMediaUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
    )
  ) : (
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center">
      <div className="text-center text-white/60">
        <IconPhotoOff size={32} className="mx-auto mb-2 opacity-50" stroke={1.5} />
        <p className="text-xs font-medium">No media uploaded</p>
      </div>
    </div>
  )

  // Mobile-specific preview: portrait aspect ratios + smaller text
  const renderMobilePreview = () => {
    const MobileMedia = ({ className }: { className?: string }) => previewMediaUrl ? (
      previewIsVideo ? (
        <video key={previewMediaUrl} src={previewMediaUrl} className={cn("w-full h-full object-cover", className)} autoPlay loop muted playsInline />
      ) : (
        <img key={previewMediaUrl} src={previewMediaUrl} alt="Preview" className={cn("w-full h-full object-cover", className)} />
      )
    ) : (
      <div className={cn("w-full h-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center", className)}>
        <div className="text-center text-white/60">
          <IconPhotoOff size={18} className="mx-auto mb-1 opacity-50" stroke={1.5} />
          <p className="text-[9px] font-medium">No media</p>
        </div>
      </div>
    )

    switch (bannerType) {
      case "announcement":
        return (
          <div className="w-full h-9 flex items-center justify-center bg-gradient-to-r from-teal-600 to-emerald-600 px-3">
            {watchTitle
              ? <p className="text-white font-semibold text-[10px] text-center line-clamp-1">{watchTitle}</p>
              : <p className="text-white/50 text-[9px] italic">Announcement text</p>
            }
          </div>
        )
      case "editorial":
        return (
          <div className="w-full">
            <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
              <div className="absolute inset-0"><MobileMedia /></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-2.5 bg-white dark:bg-gray-900">
              {watchTitle
                ? <h3 className="text-gray-900 dark:text-white font-bold text-[11px] leading-tight mb-1 line-clamp-2">{watchTitle}</h3>
                : <div className="h-2.5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-1.5" />
              }
              {watchSubtitle
                ? <p className="text-gray-500 dark:text-gray-400 text-[9px] leading-relaxed line-clamp-2">{watchSubtitle}</p>
                : <div className="h-2 w-full bg-gray-100 dark:bg-gray-700/50 rounded" />
              }
            </div>
          </div>
        )
      case "split_promo": {
        const slot = watchSlot ?? "left"
        return (
          <div className="w-full">
            <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
              <div className="absolute inset-0"><MobileMedia /></div>
              <div className="absolute top-1.5 left-1.5 z-10">
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white uppercase">{slot} slot</span>
              </div>
              {watchTitle && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2.5 pointer-events-none">
                  <div>
                    <h3 className="text-white font-bold text-[11px] leading-tight">{watchTitle}</h3>
                    {watchSubtitle && <p className="text-white/70 text-[9px] mt-0.5 line-clamp-1">{watchSubtitle}</p>}
                  </div>
                </div>
              )}
            </div>
            <div className="w-full h-8 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-[8px] text-gray-400 dark:text-gray-500 uppercase tracking-widest">Other panel</span>
            </div>
          </div>
        )
      }
      default: // hero
        return (
          <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
            <div className="absolute inset-0"><MobileMedia /></div>
            {(watchTitle || watchSubtitle) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end pointer-events-none">
                <div className="p-2.5 space-y-0.5">
                  {watchTitle && <h3 className="text-white font-black text-xs leading-tight drop-shadow-lg">{watchTitle}</h3>}
                  {watchSubtitle && <p className="text-white/80 text-[10px] font-medium drop-shadow line-clamp-2">{watchSubtitle}</p>}
                </div>
              </div>
            )}
          </div>
        )
    }
  }

  const renderPreview = () => {
    switch (bannerType) {
      case "announcement":
        return (
          <div className="w-full h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-teal-600 to-emerald-600 px-6">
            {watchTitle
              ? <p className="text-white font-semibold text-sm text-center line-clamp-1">{watchTitle}</p>
              : <p className="text-white/50 text-xs italic">Announcement text will appear here</p>
            }
            {watchSubtitle && (
              <span className="text-white/70 text-xs border-l border-white/30 pl-3 line-clamp-1">{watchSubtitle}</span>
            )}
          </div>
        )
      case "editorial":
        return (
          <div className="w-full flex" style={{ aspectRatio: "16/5" }}>
            <div className="relative w-1/2 h-full overflow-hidden">
              <PreviewMedia />
            </div>
            <div className="w-1/2 flex flex-col justify-center p-5 bg-nss-card border-l border-nss-border">
              {watchTitle
                ? <h3 className="text-nss-text-primary font-black text-base leading-tight mb-1 line-clamp-2">{watchTitle}</h3>
                : <div className="h-4 w-3/4 bg-nss-border rounded mb-2" />
              }
              {watchSubtitle
                ? <p className="text-nss-text-secondary text-xs leading-relaxed line-clamp-3">{watchSubtitle}</p>
                : <div className="h-3 w-full bg-nss-border/50 rounded" />
              }
            </div>
          </div>
        )
      case "split_promo": {
        const slot = watchSlot ?? "left"
        return (
          <div className="w-full flex" style={{ aspectRatio: "16/5" }}>
            {(["left", "right"] as const).map(panel => {
              const isActive = panel === slot
              return (
                <div key={panel} className={cn("relative w-1/2 h-full overflow-hidden", isActive ? "ring-2 ring-inset ring-emerald-500" : "")}>
                  {isActive
                    ? <PreviewMedia />
                    : <div className="absolute inset-0 bg-nss-border/20 flex flex-col items-center justify-center gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-nss-text-secondary">{panel} slot</span>
                        <span className="text-[10px] text-nss-text-secondary/60">Other banner goes here</span>
                      </div>
                  }
                  <div className="absolute top-2 left-2 z-10">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase", isActive ? "bg-emerald-500 text-white" : "bg-nss-surface/80 text-nss-text-secondary")}>{panel}</span>
                  </div>
                  {isActive && watchTitle && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 pointer-events-none">
                      <div>
                        <h3 className="text-white font-bold text-sm">{watchTitle}</h3>
                        {watchSubtitle && <p className="text-white/70 text-xs mt-0.5">{watchSubtitle}</p>}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      }
      default: // hero
        return (
          <div className="relative w-full" style={{ paddingBottom: "31.25%" }}>
            <PreviewMedia />
            {(watchTitle || watchSubtitle) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end pointer-events-none">
                <div className="p-5 space-y-0.5 max-w-xl">
                  {watchTitle && <h3 className="text-white font-black text-xl leading-tight drop-shadow-lg">{watchTitle}</h3>}
                  {watchSubtitle && <p className="text-white/80 text-sm font-medium drop-shadow">{watchSubtitle}</p>}
                </div>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6 pb-20">

      {/* ── Sticky header ── */}
      <div className="flex items-center justify-between sticky top-0 z-10 bg-nss-surface/80 backdrop-blur-md py-4 border-b border-nss-border">
        <div>
          <h2 className="text-xl font-bold text-nss-text-primary">
            {initialData ? "Edit Banner" : "New Banner"}
          </h2>
          <p className="text-xs text-nss-text-secondary capitalize mt-0.5">
            {bannerType?.replace("_", " ")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={form.formState.isSubmitting}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {initialData ? "Update Banner" : "Create Banner"}
          </Button>
        </div>
      </div>

      {/* ── ① Banner Type Picker ── */}
      <Controller
        control={form.control}
        name="banner_type"
        render={({ field }) => (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BANNER_TYPES.map(type => {
              const isSelected = field.value === type.value
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => field.onChange(type.value)}
                  className={cn(
                    "relative p-4 rounded-2xl border-2 text-start transition-all hover:shadow-md",
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-md shadow-emerald-500/10"
                      : "border-nss-border bg-nss-card hover:border-nss-text-secondary/30"
                  )}
                >
                  {isSelected && (
                    <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">✓</span>
                  )}
                  <type.icon
                    size={28}
                    className={cn("mb-2", isSelected ? "text-emerald-600" : "text-nss-text-secondary")}
                    stroke={1.5}
                  />
                  <p className={cn("font-semibold text-sm", isSelected ? "text-emerald-700 dark:text-emerald-400" : "text-nss-text-primary")}>
                    {type.label}
                  </p>
                  <p className="text-[11px] text-nss-text-secondary mt-0.5 leading-snug">
                    {type.description}
                  </p>
                </button>
              )
            })}
          </div>
        )}
      />

      {/* ── ② Live Preview ── */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-nss-border">
          <span className="text-xs font-semibold text-nss-text-secondary uppercase tracking-wider">Live Preview</span>
          {!isAnnouncement && (
            <div className="flex rounded-lg border border-nss-border overflow-hidden">
              {(["desktop", "mobile"] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPreviewMode(mode)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors",
                    previewMode === mode
                      ? "bg-nss-card text-nss-text-primary"
                      : "text-nss-text-secondary hover:text-nss-text-primary"
                  )}
                >
                  {mode === "desktop"
                    ? <><IconDeviceDesktop size={14} /> Desktop</>
                    : <><IconDeviceMobile size={14} /> Mobile</>
                  }
                </button>
              ))}
            </div>
          )}
        </div>

        {previewMode === "desktop" || isAnnouncement ? (
          <div className="overflow-hidden">{renderPreview()}</div>
        ) : (
          <div className="py-8 flex justify-center bg-gradient-to-b from-nss-border/20 to-nss-border/5">
            {/* Phone shell */}
            <div
              className="relative w-[248px] bg-gray-950 rounded-[44px] overflow-visible flex-shrink-0"
              style={{ boxShadow: "0 0 0 2px #374151, 0 0 0 4px #111827, 0 25px 50px rgba(0,0,0,0.5)" }}
            >
              {/* Volume / side buttons */}
              <div className="absolute -left-[3px] top-[70px] w-[3px] h-[26px] bg-gray-700 rounded-l-full" />
              <div className="absolute -left-[3px] top-[106px] w-[3px] h-[42px] bg-gray-700 rounded-l-full" />
              <div className="absolute -left-[3px] top-[158px] w-[3px] h-[42px] bg-gray-700 rounded-l-full" />
              <div className="absolute -right-[3px] top-[110px] w-[3px] h-[58px] bg-gray-700 rounded-r-full" />

              {/* Screen */}
              <div className="rounded-[44px] overflow-hidden bg-white dark:bg-gray-900">
                {/* Status bar */}
                <div className="bg-gray-950 flex items-center justify-between px-6 pt-3 pb-1.5">
                  <span className="text-white text-[10px] font-bold tracking-tight">9:41</span>
                  <div className="w-[80px] h-[16px] bg-gray-900 rounded-full" />
                  <div className="flex items-end gap-[3px] h-[10px]">
                    {[3, 5, 7, 9].map(h => (
                      <div key={h} style={{ height: `${h}px` }} className="w-[2px] bg-white rounded-full" />
                    ))}
                    <div className="w-[14px] h-[7px] border border-white/70 rounded-[2px] ml-0.5 flex items-center pl-[2px]">
                      <div className="w-[6px] h-[4px] bg-white/70 rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* Fake storefront navbar */}
                <div className="bg-white dark:bg-gray-900 px-3 py-2 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-sm bg-emerald-500 flex-shrink-0" />
                    <div className="h-[7px] w-10 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                  <div className="h-[18px] flex-1 mx-2 bg-gray-100 dark:bg-gray-800 rounded-full" />
                  <div className="w-[18px] h-[18px] rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                </div>

                {/* Banner content */}
                {renderMobilePreview()}

                {/* Skeleton product grid */}
                <div className="bg-white dark:bg-gray-900 p-2 pt-2.5">
                  <div className="grid grid-cols-3 gap-1.5">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                        <div className="aspect-square bg-gray-100 dark:bg-gray-750" />
                        <div className="p-1 space-y-1">
                          <div className="h-[6px] w-full bg-gray-200 dark:bg-gray-700 rounded" />
                          <div className="h-[5px] w-2/3 bg-gray-100 dark:bg-gray-600 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom nav */}
                <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-2.5 flex justify-around">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className={cn("w-4 h-4 rounded bg-gray-200 dark:bg-gray-700", i === 0 && "bg-emerald-200 dark:bg-emerald-900")} />
                      <div className="w-5 h-[4px] bg-gray-100 dark:bg-gray-700/50 rounded" />
                    </div>
                  ))}
                </div>

                {/* Home indicator */}
                <div className="bg-white dark:bg-gray-900 flex justify-center pb-2 pt-1">
                  <div className="w-[60px] h-[4px] bg-gray-900 dark:bg-gray-100 rounded-full opacity-20" />
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* ── ③ Two-column layout ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">

          {/* Media — hidden for announcement banners */}
          {!isAnnouncement && (
            <Card className="overflow-hidden">
              {/* Image / Video tabs */}
              <div className="flex border-b border-nss-border">
                {([
                "video",
                "image"
              ] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setMediaTab(tab)}
                  className={cn(
                    "flex-1 py-3 px-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2",
                    mediaTab === tab
                      ? "border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/10"
                      : "text-nss-text-secondary hover:text-nss-text-primary"
                  )}
                >
                  {tab === "video"
                    ? <><IconVideo size={16} stroke={2} /> Video</>
                    : <><IconPhoto size={16} stroke={2} /> Images</>}
                  {tab === "image" && watchDesktopImage && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  )}
                  {tab === "video" && watchDesktopVideo && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  )}
                </button>
              ))}
              </div>

              <div className="p-6">
                {mediaTab === "image" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-semibold">Desktop Image</Label>
                      <p className="text-[11px] text-nss-text-secondary">1920×700px (Hero) · 1200×600px (Editorial)</p>
                      <Controller
                        control={form.control}
                        name="image_desktop_url"
                        render={({ field }) => (
                          <FileUpload
                            value={field.value || undefined}
                            onChange={field.onChange}
                            bucket="banners"
                            maxSize={5 * 1024 * 1024}
                            allowedTypes={["jpeg", "jpg", "png", "webp"]}
                            disabled={form.formState.isSubmitting}
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Mobile Image</Label>
                      <p className="text-[11px] text-nss-text-secondary">800×600px · shown on phones</p>
                      <Controller
                        control={form.control}
                        name="image_mobile_url"
                        render={({ field }) => (
                          <FileUpload
                            value={field.value || undefined}
                            onChange={field.onChange}
                            bucket="banners"
                            maxSize={5 * 1024 * 1024}
                            allowedTypes={["jpeg", "jpg", "png", "webp"]}
                            disabled={form.formState.isSubmitting}
                          />
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-100 dark:bg-amber-950/40 border-l-4 border-amber-500 dark:border-amber-400">
                      <IconAlertCircle size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" stroke={2} />
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-200 leading-relaxed">
                        Video takes priority over images on the storefront. Keep it short (5–15 sec), autoplay-friendly, and muted.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-semibold">Desktop Video</Label>
                        <p className="text-[11px] text-nss-text-secondary">MP4 / WebM · max 50MB</p>
                        <Controller
                          control={form.control}
                          name="video_desktop_url"
                          render={({ field }) => (
                            <FileUpload
                              value={field.value || undefined}
                              onChange={field.onChange}
                              bucket="banners"
                              maxSize={50 * 1024 * 1024}
                              allowedTypes={["mp4", "webm"]}
                              disabled={form.formState.isSubmitting}
                            />
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-semibold">Mobile Video</Label>
                        <p className="text-[11px] text-nss-text-secondary">MP4 / WebM · max 50MB</p>
                        <Controller
                          control={form.control}
                          name="video_mobile_url"
                          render={({ field }) => (
                            <FileUpload
                              value={field.value || undefined}
                              onChange={field.onChange}
                              bucket="banners"
                              maxSize={50 * 1024 * 1024}
                              allowedTypes={["mp4", "webm"]}
                              disabled={form.formState.isSubmitting}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Content */}
          <Card className="p-6 space-y-5">
            <div>
              <h3 className="font-semibold text-nss-text-primary">Content</h3>
              <p className="text-xs text-nss-text-secondary mt-0.5">
                Both fields are optional — leave empty for a clean image-only banner.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_en">Title</Label>
              <Input
                id="title_en"
                {...form.register("title_en")}
                placeholder='e.g. "Summer Sale – Up to 50% Off"'
              />
              {form.formState.errors.title_en && (
                <p className="text-xs text-red-500">{form.formState.errors.title_en.message as string}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle_en">Subtitle</Label>
              <Textarea
                id="subtitle_en"
                {...form.register("subtitle_en")}
                placeholder="Supporting text shown below the title"
                rows={2}
              />
            </div>
          </Card>

          {/* Navigation — merged CTA + Link Association */}
          <Card className="p-6 space-y-5">
            <div>
              <h3 className="font-semibold text-nss-text-primary">Navigation</h3>
              <p className="text-xs text-nss-text-secondary mt-0.5">
                Pick a category or brand to auto-fill the destination link. You can also enter a custom URL.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Link to Category</Label>
                <Controller
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <Select
                      onValueChange={(v) => field.onChange(v === "none" ? null : v)}
                      value={field.value ?? "none"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name_en}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-[11px] text-nss-text-secondary">Navigates to this category when banner is clicked.</p>
              </div>
              <div className="space-y-2">
                <Label>Link to Brand</Label>
                <Controller
                  control={form.control}
                  name="brand_id"
                  render={({ field }) => (
                    <Select
                      onValueChange={(v) => field.onChange(v === "none" ? null : v)}
                      value={field.value ?? "none"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {brands.map(brand => (
                          <SelectItem key={brand.id} value={brand.id}>{brand.name_en}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-[11px] text-nss-text-secondary">Navigates to this brand when banner is clicked.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta_link">Destination URL</Label>
              <Input
                id="cta_link"
                {...form.register("cta_link")}
                placeholder="/categories/toys  or  https://..."
              />
              <p className="text-[11px] text-nss-text-secondary">
                Auto-filled from category/brand above. The entire banner image/video is clickable.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-nss-border">
              <Label htmlFor="cta_text_en">
                CTA Button Text{" "}
                <span className="text-nss-text-secondary font-normal text-xs">(optional)</span>
              </Label>
              <Input
                id="cta_text_en"
                {...form.register("cta_text_en")}
                placeholder='e.g. "Shop Now" — leave empty to hide the button'
              />
              <p className="text-[11px] text-nss-text-secondary">
                If empty, no button is shown — the full banner image acts as the link.
              </p>
            </div>
          </Card>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">

          {/* Publish */}
          <Card className="p-5 space-y-5">
            <h3 className="font-semibold text-nss-text-primary">Publish</h3>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Active</Label>
                <p className="text-[11px] text-nss-text-secondary">Show on storefront</p>
              </div>
              <Switch
                checked={form.watch("is_active")}
                onCheckedChange={(checked) => form.setValue("is_active", checked)}
              />
            </div>
            <div className="space-y-2 pt-3 border-t border-nss-border">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                min={0}
                {...form.register("display_order", { valueAsNumber: true })}
              />
              <p className="text-[11px] text-nss-text-secondary">Lower number = shown first</p>
            </div>
          </Card>

          {/* Schedule */}
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-nss-text-primary">Schedule</h3>
            <div className="space-y-2">
              <Label htmlFor="schedule_start">Start Date</Label>
              <div className="relative">
                <Input
                  id="schedule_start"
                  type="datetime-local"
                  {...form.register("schedule_start")}
                  className="cursor-pointer pr-9"
                  onClick={(e) => { try { (e.currentTarget as any).showPicker?.() } catch {} }}
                />
                <button type="button" tabIndex={-1} onClick={() => { const el = document.getElementById("schedule_start") as any; try { el?.showPicker?.() } catch {} }} className="absolute right-2 top-1/2 -translate-y-1/2 text-nss-text-secondary hover:text-nss-text-primary">
                  <IconCalendar size={15} stroke={1.5} />
                </button>
              </div>
              {form.formState.errors.schedule_start && (
                <p className="text-xs text-red-500">{form.formState.errors.schedule_start.message as string}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule_end">End Date</Label>
              <div className="relative">
                <Input
                  id="schedule_end"
                  type="datetime-local"
                  {...form.register("schedule_end")}
                  className="cursor-pointer pr-9"
                  onClick={(e) => { try { (e.currentTarget as any).showPicker?.() } catch {} }}
                />
                <button type="button" tabIndex={-1} onClick={() => { const el = document.getElementById("schedule_end") as any; try { el?.showPicker?.() } catch {} }} className="absolute right-2 top-1/2 -translate-y-1/2 text-nss-text-secondary hover:text-nss-text-primary">
                  <IconCalendar size={15} stroke={1.5} />
                </button>
              </div>
              {form.formState.errors.schedule_end && (
                <p className="text-xs text-red-500">{form.formState.errors.schedule_end.message as string}</p>
              )}
            </div>
            {(bannerType === "hero" || bannerType === "announcement") && (
              <div className="space-y-2 pt-3 border-t border-nss-border">
                <Label htmlFor="countdown_end">Countdown Timer End</Label>
                <div className="relative">
                  <Input
                    id="countdown_end"
                    type="datetime-local"
                    {...form.register("countdown_end")}
                    className="cursor-pointer pr-9"
                    onClick={(e) => { try { (e.currentTarget as any).showPicker?.() } catch {} }}
                  />
                  <button type="button" tabIndex={-1} onClick={() => { const el = document.getElementById("countdown_end") as any; try { el?.showPicker?.() } catch {} }} className="absolute right-2 top-1/2 -translate-y-1/2 text-nss-text-secondary hover:text-nss-text-primary">
                    <IconCalendar size={15} stroke={1.5} />
                  </button>
                </div>
                <p className="text-[11px] text-nss-text-secondary">Displays a live countdown on the banner</p>
              </div>
            )}
          </Card>

          {/* Settings — only for split_promo */}
          {isSplitPromo && (
            <Card className="p-5 space-y-4">
              <h3 className="font-semibold text-nss-text-primary">Settings</h3>
              <div className="space-y-2">
                <Label>Slot Position</Label>
                <Controller
                  control={form.control}
                  name="slot"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? "left"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">⬅ Left Panel</SelectItem>
                        <SelectItem value="right">➡ Right Panel</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-[11px] text-nss-text-secondary">
                  Which half of the split layout this banner occupies
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </form>
  )
}
