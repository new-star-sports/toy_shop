"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { flashSaleSettingsSchema, type FlashSaleSettings } from "@nss/validators/marketing"
import { updateFlashSaleSettings } from "../_actions"
import { Button } from "@nss/ui/components/button"
import { Card } from "@nss/ui/components/card"
import { Input } from "@nss/ui/components/input"
import { Label } from "@nss/ui/components/label"
import { Switch } from "@nss/ui/components/switch"
import { toast } from "sonner"

interface FlashSaleFormProps {
  initialData?: any
}

export function FlashSaleForm({ initialData }: FlashSaleFormProps) {
  const form = useForm<any>({
    resolver: zodResolver(flashSaleSettingsSchema),
    defaultValues: {
      enabled: false,
      title_en: "Flash Sale!",
      title_ar: "عرض خاطف!",
      start_time: new Date().toISOString().slice(0, 16),
      end_time: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      ...initialData,
    } as any,
  })

  const onSubmit = async (data: any) => {
    const settingsData = data as FlashSaleSettings
    try {
      const result = await updateFlashSaleSettings(settingsData)
      if (result.success) {
        toast.success("Flash sale settings updated")
      } else {
        toast.error("Failed to update settings: " + result.error)
      }
    } catch (err) {
      console.error(err)
      toast.error("An unexpected error occurred.")
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-nss-text-primary">Global Settings</h3>
          <Switch
            checked={form.watch("enabled")}
            onCheckedChange={(checked) => form.setValue("enabled", checked)}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title_en">Title (English)</Label>
            <Input id="title_en" {...form.register("title_en")} />
            {form.formState.errors.title_en && <p className="text-xs text-nss-danger">{(form.formState.errors.title_en as any).message}</p>}
          </div>

          <div className="space-y-2" dir="rtl">
            <Label htmlFor="title_ar" className="font-arabic">العنوان (بالعربية)</Label>
            <Input id="title_ar" className="font-arabic" {...form.register("title_ar")} />
            {form.formState.errors.title_ar && <p className="text-xs text-nss-danger">{(form.formState.errors.title_ar as any).message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input id="start_time" type="datetime-local" {...form.register("start_time")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input id="end_time" type="datetime-local" {...form.register("end_time")} />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </Card>
  )
}
