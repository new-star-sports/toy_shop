"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bannerSchema, type Banner } from "@nss/validators/banner"
import { createBanner, updateBanner } from "../../banners/_actions"
import { useRouter } from "next/navigation"

import { Button } from "@nss/ui/components/button"
import { Card } from "@nss/ui/components/card"
import { Input } from "@nss/ui/components/input"
import { Label } from "@nss/ui/components/label"
import { Textarea } from "@nss/ui/components/textarea"
import { Badge } from "@nss/ui/components/badge"
import { Switch } from "@nss/ui/components/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nss/ui/components/select"
import { toast } from "sonner"
import { translateToArabic } from "../../_lib/translate"

interface BannerFormProps {
  initialData?: any
}

export function BannerForm({ initialData }: BannerFormProps) {
  const router = useRouter()

  const form = useForm<any>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      banner_type: "hero",
      title_en: "",
      title_ar: "",
      bg_color: "#1B3A6B",
      text_color: "#FFFFFF",
      is_active: true,
      display_order: 0,
      ...initialData,
    } as any,
  })

  const bannerType = form.watch("banner_type")

  const onSubmit = async (data: any) => {
    try {
      // Automate Arabic translations
      const bannerData = {
        ...data,
        title_ar: await translateToArabic(data.title_en),
        subtitle_ar: data.subtitle_en ? await translateToArabic(data.subtitle_en) : data.title_ar,
        cta_text_ar: data.cta_text_en ? await translateToArabic(data.cta_text_en) : "",
      } as Banner

      if (initialData?.id) {
        const result = await updateBanner(initialData.id, bannerData)
        if (result.success) {
          toast.success("Banner updated successfully")
          router.push("/banners")
          router.refresh()
        } else {
          toast.error("Error updating banner: " + result.error)
        }
      } else {
        const result = await createBanner(bannerData)
        if (result.success) {
          toast.success("Banner created successfully")
          router.push("/banners")
          router.refresh()
        } else {
          toast.error("Error creating banner: " + result.error)
        }
      }
    } catch (err) {
      console.error(err)
      toast.error("An unexpected error occurred.")
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Banner"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 space-y-6">
            <h3 className="font-semibold text-nss-text-primary">Content</h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title_en">Title</Label>
                  <Input id="title_en" {...form.register("title_en")} placeholder="Main heading" />
                  {form.formState.errors.title_en && <p className="text-xs text-nss-danger">{(form.formState.errors.title_en as any).message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle_en">Subtitle</Label>
                  <Textarea id="subtitle_en" {...form.register("subtitle_en")} placeholder="Optional description" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-6">
            <h3 className="font-semibold text-nss-text-primary">Call to Action</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cta_text_en">Button Text</Label>
                  <Input id="cta_text_en" {...form.register("cta_text_en")} placeholder="e.g. Shop Now" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta_link">Link URL</Label>
                  <Input id="cta_link" {...form.register("cta_link")} placeholder="/products/category-slug" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-6">
            <h3 className="font-semibold text-nss-text-primary">Media & Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="image_desktop_url">Desktop Image URL</Label>
                <Input id="image_desktop_url" {...form.register("image_desktop_url")} placeholder="https://..." />
                <p className="text-[10px] text-nss-text-secondary">Expected: 1920x700px (Hero) or 1200x600px (Editorial)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_mobile_url">Mobile Image URL</Label>
                <Input id="image_mobile_url" {...form.register("image_mobile_url")} placeholder="https://..." />
                <p className="text-[10px] text-nss-text-secondary">Expected: 800x600px (Split/Hero)</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <h3 className="font-semibold text-nss-text-primary">Design & Configuration</h3>
            
            <div className="space-y-2">
              <Label>Banner Type</Label>
              <Select 
                onValueChange={(v) => form.setValue("banner_type", v as any)} 
                defaultValue={form.getValues("banner_type")}
              >
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bg_color">Background Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="bg_color" 
                    type="color" 
                    {...form.register("bg_color")} 
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    {...form.register("bg_color")} 
                    placeholder="#HEX"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="text_color">Text Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="text_color" 
                    type="color" 
                    {...form.register("text_color")} 
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    {...form.register("text_color")} 
                    placeholder="#HEX"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input 
                id="display_order" 
                type="number" 
                {...form.register("display_order", { valueAsNumber: true })} 
                defaultValue={form.getValues("display_order") ?? 0}
              />
            </div>

            {bannerType === "split_promo" && (
              <div className="space-y-2">
                <Label htmlFor="slot">Slot Position</Label>
                <select 
                  id="slot"
                  className="w-full h-10 px-3 py-2 rounded-md border border-nss-border bg-nss-card text-sm"
                  {...form.register("slot")}
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-6">
            <h3 className="font-semibold text-nss-text-primary">Status & Scheduling</h3>
            
            <div className="flex items-center justify-between">
              <Label>Is Active</Label>
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
                  <Label htmlFor="countdown_end">Countdown End Date</Label>
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
