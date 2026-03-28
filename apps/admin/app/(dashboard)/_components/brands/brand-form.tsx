"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { brandSchema } from "@nss/validators/product"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { FieldGroup } from "@/components/ui/field-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { upsertBrandAction } from "../../brands/_actions"
import { toast } from "sonner"
import { FileUpload } from "@/components/ui/file-upload"
import type { Brand } from "@nss/db/types"
import { translateToArabic } from "../../_lib/translate"

const brandFormSchema = brandSchema.extend({
  name_ar: z.string().optional(),
  description_ar: z.string().optional().nullable(),
})

type BrandFormValues = z.infer<typeof brandFormSchema>

interface BrandFormProps {
  initialData?: Brand | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const slugify = (text: string) => 
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function BrandForm({ initialData, onSuccess, onCancel }: BrandFormProps) {
  const router = useRouter()

  // Image upload state
  const [brandLogo, setBrandLogo] = useState<string>(initialData?.logo_url || "")
  
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema) as any,
    mode: "onChange",
    defaultValues: initialData ? {
      name_en: initialData.name_en,
      slug: initialData.slug,
      description_en: initialData.description_en || "",
      logo_url: initialData.logo_url || "",
      is_featured: initialData.is_featured,
      display_order: initialData.display_order,
      is_active: initialData.is_active,
    } : {
      name_en: "",
      slug: "",
      description_en: "",
      logo_url: "",
      is_featured: false,
      display_order: 0,
      is_active: true,
    },
  })
  
  // Sync logo preview with form field
  useEffect(() => {
    const logoUrl = form.watch("logo_url")
    if (logoUrl !== brandLogo) {
      setBrandLogo(logoUrl || "")
    }
  }, [form.watch("logo_url")])

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
    try {
      const name_ar = await translateToArabic(values.name_en)
      const description_ar = values.description_en
        ? await translateToArabic(values.description_en)
        : name_ar

      const result = await upsertBrandAction({
        ...initialData,
        ...values,
        name_ar,
        description_ar,
      } as Partial<Brand>)

      if (result.success) {
        toast.success(initialData ? "Brand updated successfully!" : "Brand created successfully!")
        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/brands")
        }
      } else {
        toast.error(result.error || "Something went wrong")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      toast.error("Unexpected error: " + message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <FieldGroup>
          <FormField
            control={form.control}
            name="name_en"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Brand Name (English)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g. LEGO" 
                    maxLength={200}
                  />
                </FormControl>
                <FormDescription>
                  Brand name (max 200 characters). {field.value?.length || 0}/200 characters used
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </FieldGroup>

        {/* Image Upload Section */}
        <FieldGroup>
          <FormField
            control={form.control}
            name="logo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Logo</FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value || undefined}
                    onChange={field.onChange}
                    bucket="brands"
                    disabled={form.formState.isSubmitting}
                    maxSize={5 * 1024 * 1024} // 5MB (after compression)
                    allowedTypes={['jpeg', 'jpg', 'png', 'svg', 'webp']}
                  />
                </FormControl>
                <FormDescription>
                  Upload a brand logo. Square format recommended. Max file size: 5MB.
                </FormDescription>
                <FormMessage />
              </FormItem>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <FormField
              control={form.control}
              name="description_en"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Description (English)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Describe this brand..." 
                      maxLength={500}
                      rows={4}
                    />
                  </FormControl>
                  <FormDescription>
                    Brief description of the brand (max 500 characters).
                    {field.value?.length || 0}/500 characters used
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldGroup>

        <FieldGroup>
          <Card>
            <CardHeader>
              <CardTitle>Brand Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
  <Input 
    type="text" 
    {...field} 
    onChange={e => {
      const value = e.target.value
      // Allow empty string or valid numbers
      if (value === "" || /^\d+$/.test(value)) {
        field.onChange(value === "" ? "" : +value)
      }
    }}
    onKeyDown={(e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
      }
    }}
    onWheel={(e) => e.currentTarget.blur()}
    placeholder="0"
  />
</FormControl>
                      <FormDescription>Determines order on homepage.</FormDescription>
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
            </CardContent>
          </Card>
        </FieldGroup>

        <div className="flex gap-4">
          <Button 
            type="submit"
            loading={form.formState.isSubmitting}
          >
            {initialData ? "Update Brand" : "Create Brand"}
          </Button>

          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
