"use client"

import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { brandSchema } from "@nss/validators/product"
import { Button } from "@nss/ui/components/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@nss/ui/components/form"
import { Input } from "@nss/ui/components/input"
import { Textarea } from "@nss/ui/components/textarea"
import { Switch } from "@nss/ui/components/switch"
import { useRouter } from "next/navigation"
import { upsertBrandAction } from "../../brands/_actions"
import { toast } from "sonner"
import type { Brand } from "@nss/db/types"
import { translateToArabic } from "../../_lib/translate"

interface BrandFormProps {
  initialData?: Brand | null
  onSuccess?: () => void
}

type BrandFormValues = z.infer<typeof brandSchema>

const slugify = (text: string) => 
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function BrandForm({ initialData, onSuccess }: BrandFormProps) {
  const router = useRouter()
  
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema) as any,
    defaultValues: initialData ? {
      name_en: initialData.name_en,
      name_ar: initialData.name_ar,
      slug: initialData.slug,
      description_en: initialData.description_en,
      description_ar: initialData.description_ar,
      logo_url: initialData.logo_url,
      is_featured: initialData.is_featured,
      display_order: initialData.display_order,
      is_active: initialData.is_active,
    } : {
      name_en: "",
      name_ar: "",
      slug: "",
      description_en: "",
      description_ar: "",
      logo_url: "",
      is_featured: false,
      display_order: 0,
      is_active: true,
    },
  })

  const watchAll = form.watch()
  const nameEn = watchAll.name_en
  
  // Track if slug has been manually modified
  const isSlugModified = useRef(initialData ? !!initialData.slug : false)

  // Auto-generate slug
  useEffect(() => {
    if (nameEn && !isSlugModified.current) {
      form.setValue("slug", slugify(nameEn), { shouldValidate: true })
    }
  }, [nameEn, form])

  async function onSubmit(values: BrandFormValues) {
    // Automate Arabic translations in background
    const translatedNameAr = await translateToArabic(values.name_en)
    const translatedDescAr = values.description_en ? await translateToArabic(values.description_en) : values.name_ar

    const result = await upsertBrandAction({
      ...initialData,
      ...values,
      name_ar: translatedNameAr,
      description_ar: translatedDescAr,
    } as Partial<Brand>)

    if (result.success) {
      toast.success(initialData ? "Brand updated" : "Brand created")
      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/brands")
      }
    } else {
      toast.error(result.error || "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="name_en"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Brand Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. LEGO" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="slug"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="lego" 
                  onChange={(e) => {
                    isSlugModified.current = true
                    field.onChange(e)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo_url"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} placeholder="https://..." />
              </FormControl>
              <FormDescription>Link to the brand logo image.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="description_en"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Describe this brand..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 p-4 border rounded-lg bg-nss-surface/30">
          <FormField
            control={form.control}
            name="is_featured"
            render={({ field }: { field: any }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Featured Brand</FormLabel>
                  <FormDescription>Show this brand and its logo on the homepage.</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("is_featured") && (
            <FormField
              control={form.control}
              name="display_order"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }: { field: any }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Active Status</FormLabel>
                  <FormDescription>Enable or disable this brand.</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" loading={form.formState.isSubmitting}>
            {initialData ? "Update Brand" : "Create Brand"}
          </Button>

          <Button type="button" variant="outline" onClick={() => router.push("/brands")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
