"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@nss/ui/components/button"
import { Input } from "@nss/ui/components/input"
import { Label } from "@nss/ui/components/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@nss/ui/components/card"
import { toast } from "sonner"
import { saveStoreInfoAction } from "../_actions"
import { translateToArabic } from "../../_lib/translate"
import { useState } from "react"
import { Loader2, Save } from "lucide-react"

import { StoreInfoSettings } from "@nss/db/queries"

const storeInfoSchema = z.object({
  store_name_en: z.string().min(2, "Store name is required"),
  store_name_ar: z.string().min(2, "Arabic store name is required"),
  tagline_en: z.string().min(1, "Tagline is required"),
  tagline_ar: z.string().min(1, "Arabic tagline is required"),
  contact_email: z.string().email("Invalid email"),
  contact_phone: z.string().min(8, "Invalid phone number"),
  whatsapp_number: z.string().min(8, "Invalid WhatsApp number"),
  cr_number: z.string().min(1, "CR number is required for Kuwait compliance"),
  instagram_url: z.string().url().optional().or(z.literal("")),
  tiktok_url: z.string().url().optional().or(z.literal("")),
})

interface GeneralFormProps {
  initialData?: StoreInfoSettings
}

export function GeneralForm({ initialData }: GeneralFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: StoreInfoSettings = {
    store_name_en: initialData?.store_name_en || "NewStarSports",
    store_name_ar: initialData?.store_name_ar || "نيو ستار سبورتس",
    tagline_en: initialData?.tagline_en || "Kuwait's home for toys",
    tagline_ar: initialData?.tagline_ar || "وجهتك للألعاب في الكويت",
    contact_email: initialData?.contact_email || "info@newstarsports.com",
    contact_phone: initialData?.contact_phone || "+965 2222 2222",
    whatsapp_number: initialData?.whatsapp_number || "+965 2222 2222",
    cr_number: initialData?.cr_number || "",
    instagram_url: initialData?.instagram_url || "",
    tiktok_url: initialData?.tiktok_url || "",
  }

  const form = useForm<StoreInfoSettings>({
    resolver: zodResolver(storeInfoSchema),
    defaultValues,
  })

  async function onSubmit(values: StoreInfoSettings) {
    setIsSubmitting(true)
    
    // Automate Arabic translations
    const translatedData = {
      ...values,
      store_name_ar: await translateToArabic(values.store_name_en),
      tagline_ar: values.tagline_en ? await translateToArabic(values.tagline_en) : values.store_name_en,
    }

    const result = await saveStoreInfoAction(translatedData as StoreInfoSettings)
    setIsSubmitting(false)

    if (result.success) {
      toast.success("Store information updated")
    } else {
      toast.error(result.error || "Failed to update settings")
    }
  }

  return (
    <div className="grid gap-6">
      <Card className="border-nss-border shadow-none">
        <CardHeader>
          <CardTitle>Store Identity</CardTitle>
          <CardDescription>Main brand information used across the site and invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="store_name_en">Store Name</Label>
                <Input id="store_name_en" {...form.register("store_name_en")} />
                {form.formState.errors.store_name_en && <p className="text-xs text-red-500">{form.formState.errors.store_name_en.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline_en">Tagline</Label>
                <Input id="tagline_en" {...form.register("tagline_en")} />
              </div>
            </div>

            <div className="h-px bg-nss-border my-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input id="contact_email" type="email" {...form.register("contact_email")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input id="contact_phone" {...form.register("contact_phone")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">WhatsApp Business Number</Label>
                <Input id="whatsapp_number" {...form.register("whatsapp_number")} />
              </div>
              <div className="space-y-2 border-l-2 border-amber-500 pl-4 bg-amber-50 p-2 rounded">
                <Label htmlFor="cr_number" className="text-amber-800">Commercial Registration (CR) Number</Label>
                <Input id="cr_number" {...form.register("cr_number")} placeholder="Required for Kuwait legal" />
                <p className="text-[10px] text-amber-700">Displaying this number in the footer is mandatory for Kuwaiti businesses.</p>
              </div>
            </div>

            <div className="h-px bg-nss-border my-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="instagram_url">Instagram URL</Label>
                <Input id="instagram_url" {...form.register("instagram_url")} placeholder="https://instagram.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktok_url">TikTok URL</Label>
                <Input id="tiktok_url" {...form.register("tiktok_url")} placeholder="https://tiktok.com/@..." />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting} className="bg-nss-primary hover:bg-nss-primary/90 min-w-[120px]">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
