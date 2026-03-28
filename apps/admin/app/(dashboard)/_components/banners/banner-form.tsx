"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { bannerSchema } from "@nss/validators/banner"
import { createBanner, updateBanner } from "../../banners/_actions"
import { useRouter } from "next/navigation"
import type { Category, Brand } from "@nss/db/types"

import { Button, Card, Input, Label, Textarea, Badge, Switch, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui"
import { FileUpload } from "@/components/ui/file-upload"
import { toast } from "sonner"
import { translateToArabic } from "../../_lib/translate"

const bannerFormSchema = bannerSchema.extend({
  title_ar: z.string().optional().nullable(),
  subtitle_ar: z.string().optional().nullable(),
  cta_text_ar: z.string().optional().nullable(),
  category_id: z.string().optional().nullable(),
  brand_id: z.string().optional().nullable(),
})

type BannerFormValues = z.infer<typeof bannerFormSchema>

interface BannerFormProps {
  initialData?: any
  categories?: Category[]
  brands?: Brand[]
}

export function BannerForm({ initialData, categories = [], brands = [] }: BannerFormProps) {
  const router = useRouter()

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema) as any,
    defaultValues: {
      banner_type: initialData?.banner_type ?? "hero",
      title_en: initialData?.title_en ?? "",
      subtitle_en: initialData?.subtitle_en ?? "",
      cta_text_en: initialData?.cta_text_en ?? "",
      cta_link: initialData?.cta_link ?? "",
      cta2_text_en: initialData?.cta2_text_en ?? "",
      cta2_link: initialData?.cta2_link ?? "",
      image_desktop_url: initialData?.image_desktop_url ?? "",
      image_mobile_url: initialData?.image_mobile_url ?? "",
      display_order: initialData?.display_order ?? 0,
      is_active: initialData?.is_active ?? true,
      schedule_start: initialData?.schedule_start ?? "",
      schedule_end: initialData?.schedule_end ?? "",
      countdown_end: initialData?.countdown_end ?? "",
      slot: initialData?.slot ?? "left",
      category_id: initialData?.category_id ?? null,
      brand_id: initialData?.brand_id ?? null,
    },
  })

  const bannerType = form.watch("banner_type")
  const watchCategoryId = form.watch("category_id")
  const watchBrandId = form.watch("brand_id")

  useEffect(() => {
    if (watchCategoryId && watchCategoryId !== "none") {
      const cat = categories.find(c => c.id === watchCategoryId)
      if (cat) form.setValue("cta_link", `/categories/${cat.slug}`)
    }
  }, [watchCategoryId])

  useEffect(() => {
    if (watchBrandId && watchBrandId !== "none") {
      const brand = brands.find(b => b.id === watchBrandId)
      if (brand) form.setValue("cta_link", `/brands/${brand.slug}`)
    }
  }, [watchBrandId])

  const onSubmit = async (data: BannerFormValues) => {
    try {
      const bannerData = {
        ...data,
        title_ar: await translateToArabic(data.title_en),
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-20">
      <div className="flex items-center justify-between sticky top-0 z-10 bg-nss-surface/80 backdrop-blur-md py-4 border-b border-nss-border">
        <div>
          <h2 className="text-xl font-bold text-nss-text-primary">
            {initialData ? "Edit Banner" : "New Banner"}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="capitalize">
              {bannerType?.replace("_", " ")}
            </Badge>
          </div>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">

          {/* Content */}
          <Card className="p-6 space-y-6">
            <h3 className="font-semibold text-nss-text-primary">Content</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title_en">Title <span className="text-red-500">*</span></Label>
                <Input id="title_en" {...form.register("title_en")} placeholder="Main heading" />
                {form.formState.errors.title_en && (
                  <p className="text-xs text-red-500">{(form.formState.errors.title_en as any).message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle_en">Subtitle</Label>
                <Textarea id="subtitle_en" {...form.register("subtitle_en")} placeholder="Optional description" rows={3} />
              </div>
            </div>
          </Card>

          {/* Media */}
          <Card className="p-6 space-y-6">
            <h3 className="font-semibold text-nss-text-primary">Media & Images</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Desktop Image</Label>
                <p className="text-[10px] text-nss-text-secondary mb-2">Recommended: 1920×700px (Hero) or 1200×600px (Editorial)</p>
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
                <Label>Mobile Image</Label>
                <p className="text-[10px] text-nss-text-secondary mb-2">Recommended: 800×600px</p>
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
          </Card>

          {/* Call to Action */}
          <Card className="p-6 space-y-6">
            <h3 className="font-semibold text-nss-text-primary">Call to Action</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cta_text_en">Button Text</Label>
                <Input id="cta_text_en" {...form.register("cta_text_en")} placeholder="e.g. Shop Now" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta_link">Link URL</Label>
                <Input
                  id="cta_link"
                  {...form.register("cta_link")}
                  placeholder="Auto-filled when category/brand selected, or enter custom URL"
                />
                <p className="text-[10px] text-nss-text-secondary">Auto-populated from category/brand selection below. You can override it manually.</p>
              </div>
            </div>
          </Card>

          {/* Link to Category / Brand */}
          <Card className="p-6 space-y-6">
            <h3 className="font-semibold text-nss-text-primary">Link Association</h3>
            <p className="text-sm text-nss-text-secondary">Selecting a category or brand will automatically set the CTA link and associate the banner for storefront navigation.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Category</Label>
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
                <p className="text-[10px] text-nss-text-secondary">Clicking the banner navigates to this category.</p>
              </div>
              <div className="space-y-2">
                <Label>Brand</Label>
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
                <p className="text-[10px] text-nss-text-secondary">Clicking the banner navigates to this brand.</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">

          {/* Configuration */}
          <Card className="p-6 space-y-6">
            <h3 className="font-semibold text-nss-text-primary">Configuration</h3>

            <div className="space-y-2">
              <Label>Banner Type</Label>
              <Controller
                control={form.control}
                name="banner_type"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">Hero Slider</SelectItem>
                      <SelectItem value="announcement">Announcement Bar</SelectItem>
                      <SelectItem value="editorial">Editorial Banner</SelectItem>
                      <SelectItem value="split_promo">Split Promo</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                {...form.register("display_order", { valueAsNumber: true })}
              />
            </div>

            {bannerType === "split_promo" && (
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
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}
          </Card>

          {/* Status & Scheduling */}
          <Card className="p-6 space-y-6">
            <h3 className="font-semibold text-nss-text-primary">Status & Scheduling</h3>

            <div className="flex items-center justify-between">
              <div>
                <Label>Active</Label>
                <p className="text-[11px] text-nss-text-secondary">Show this banner on the storefront</p>
              </div>
              <Switch
                checked={form.watch("is_active")}
                onCheckedChange={(checked) => form.setValue("is_active", checked)}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-nss-border">
              <div className="space-y-2">
                <Label htmlFor="schedule_start">Start Date</Label>
                <Input id="schedule_start" type="datetime-local" {...form.register("schedule_start")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule_end">End Date</Label>
                <Input id="schedule_end" type="datetime-local" {...form.register("schedule_end")} />
              </div>
              {(bannerType === "hero" || bannerType === "announcement") && (
                <div className="space-y-2">
                  <Label htmlFor="countdown_end">Countdown End</Label>
                  <Input id="countdown_end" type="datetime-local" {...form.register("countdown_end")} />
                  <p className="text-[10px] text-nss-text-secondary">Enables countdown timer on the banner</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </form>
  )
}
