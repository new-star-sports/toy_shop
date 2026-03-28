"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { saveAnnouncementBarAction, saveTrustBarAction } from "../_actions"
import { Loader2, Plus, Trash2, Megaphone, ShieldCheck, Save, GripVertical } from "lucide-react"

interface MarketingFormProps {
  announcementBar?: any
  trustBar?: any
}

export function MarketingForm({ announcementBar, trustBar }: MarketingFormProps) {
  const [isAnnSubmitting, setIsAnnSubmitting] = useState(false)
  const [isTrustSubmitting, setIsTrustSubmitting] = useState(false)

  // -- Announcement Bar Form --
  const annForm = useForm({
    defaultValues: announcementBar || {
      enabled: true,
      bg_color: "#1B3A6B",
      text_color: "#FFFFFF",
      rotation_speed: 4,
      dismissible: true,
      messages: [
        { text_en: "Free delivery on orders above 10 KD 🚚", text_ar: "توصيل مجاني للطلبات أعلى من 10 د.ك 🚚", enabled: true }
      ]
    }
  })

  const { fields: annMessages, append: appendAnn, remove: removeAnn } = useFieldArray({
    control: annForm.control,
    name: "messages"
  })

  // -- Trust Bar Form --
  const trustForm = useForm({
    defaultValues: trustBar || {
      enabled: true,
      items: [
        { icon: "truck", text_en: "Fast Delivery", text_ar: "توصيل سريع", enabled: true },
        { icon: "shield", text_en: "Secure Payment", text_ar: "دفع آمن", enabled: true },
        { icon: "refresh", text_en: "14 Days Return", text_ar: "14 يوم استرجاع", enabled: true },
      ]
    }
  })

  const { fields: trustItems, append: appendTrust, remove: removeTrust } = useFieldArray({
    control: trustForm.control,
    name: "items"
  })

  const onSaveAnnouncementBar = async (values: any) => {
    setIsAnnSubmitting(true)
    const result = await saveAnnouncementBarAction(values)
    setIsAnnSubmitting(false)
    if (result.success) toast.success("Announcement bar settings saved")
    else toast.error(result.error || "Failed to save")
  }

  const onSaveTrustBar = async (values: any) => {
    setIsTrustSubmitting(true)
    const result = await saveTrustBarAction(values)
    setIsTrustSubmitting(false)
    if (result.success) toast.success("Trust bar settings saved")
    else toast.error(result.error || "Failed to save")
  }

  const trustIcons = [
    { value: "truck", label: "Delivery" },
    { value: "shield", label: "Security" },
    { value: "refresh", label: "Returns" },
    { value: "map", label: "Local" },
    { value: "help", label: "Support" },
  ]

  return (
    <div className="space-y-8">
      {/* ── Announcement Bar Section ── */}
      <Card className="border-nss-border shadow-none">
        <CardHeader className="flex flex-row items-center justify-between border-b border-nss-border pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-nss-primary" /> Announcement Bar
            </CardTitle>
            <CardDescription>Top-of-page rotating messages for promotions and alerts.</CardDescription>
          </div>
          <Switch 
            checked={annForm.watch("enabled")} 
            onCheckedChange={(checked) => annForm.setValue("enabled", checked)}
          />
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={annForm.handleSubmit(onSaveAnnouncementBar)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Background Colour</Label>
                <div className="flex gap-2">
                  <Input type="color" {...annForm.register("bg_color")} className="h-10 w-20 p-1" />
                  <Input {...annForm.register("bg_color")} className="uppercase font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Text Colour</Label>
                <div className="flex gap-2">
                  <Input type="color" {...annForm.register("text_color")} className="h-10 w-20 p-1" />
                  <Input {...annForm.register("text_color")} className="uppercase font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Rotation Speed (seconds)</Label>
                <Input type="number" {...annForm.register("rotation_speed")} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Messages</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => appendAnn({ text_en: "", text_ar: "", enabled: true })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Message
                </Button>
              </div>

              <div className="space-y-4">
                {annMessages.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start bg-nss-surface p-4 rounded-lg border border-nss-border relative group">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-nss-text-secondary">Message (English)</Label>
                        <Input {...annForm.register(`messages.${index}.text_en`)} placeholder="Free delivery..." />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-nss-text-secondary text-right block">الرسالة (العربية)</Label>
                        <Input {...annForm.register(`messages.${index}.text_ar`)} dir="rtl" className="text-right" placeholder="توصيل مجاني..." />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                       <Switch 
                         checked={annForm.watch(`messages.${index}.enabled`)} 
                         onCheckedChange={(val) => annForm.setValue(`messages.${index}.enabled`, val)}
                       />
                       <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-red-500" onClick={() => removeAnn(index)}>
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end border-t border-nss-border pt-4">
              <Button type="submit" disabled={isAnnSubmitting} className="min-w-[120px]">
                {isAnnSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Bar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Trust Bar Section ── */}
      <Card className="border-nss-border shadow-none">
        <CardHeader className="flex flex-row items-center justify-between border-b border-nss-border pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-nss-primary" /> Trust Bar
            </CardTitle>
            <CardDescription>Value propositions shown at the top of every page or homepage.</CardDescription>
          </div>
          <Switch 
            checked={trustForm.watch("enabled")} 
            onCheckedChange={(checked) => trustForm.setValue("enabled", checked)}
          />
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={trustForm.handleSubmit(onSaveTrustBar)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Trust Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => appendTrust({ icon: "Check", text_en: "", text_ar: "", enabled: true })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {trustItems.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-center bg-nss-surface p-4 rounded-lg border border-nss-border">
                    <GripVertical className="h-4 w-4 text-nss-text-secondary cursor-grab" />
                    <select 
                      {...trustForm.register(`items.${index}.icon`)}
                      className="w-24 px-2 py-1 bg-white rounded border border-nss-border text-xs"
                    >
                      {trustIcons.map(icon => (
                        <option key={icon.value} value={icon.value}>{icon.label}</option>
                      ))}
                    </select>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input {...trustForm.register(`items.${index}.text_en`)} placeholder="Label (EN)" />
                      <Input {...trustForm.register(`items.${index}.text_ar`)} dir="rtl" className="text-right" placeholder="العنوان (AR)" />
                    </div>
                    <div className="flex items-center gap-2">
                       <Switch 
                         checked={trustForm.watch(`items.${index}.enabled`)} 
                         onCheckedChange={(val) => trustForm.setValue(`items.${index}.enabled`, val)}
                       />
                       <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-red-500" onClick={() => removeTrust(index)}>
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end border-t border-nss-border pt-4">
              <Button type="submit" disabled={isTrustSubmitting} className="min-w-[120px]">
                {isTrustSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Trust Bar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
