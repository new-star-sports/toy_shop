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

interface BrandFormProps {
  initialData?: Brand | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type BrandFormValues = z.infer<typeof brandSchema>

const slugify = (text: string) => 
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function BrandForm({ initialData, onSuccess, onCancel }: BrandFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Image upload state
  const [brandLogo, setBrandLogo] = useState<string>(initialData?.logo_url || "")
  
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema) as any,
    mode: "onChange",
    defaultValues: initialData ? {
      name_en: initialData.name_en,
      name_ar: initialData.name_ar || "",
      slug: initialData.slug,
      description_en: initialData.description_en,
      description_ar: initialData.description_ar,
      logo_url: initialData.logo_url || "",
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
    setIsSubmitting(true)
    try {
      // Automate Arabic translations in background - using category pattern
      const translatedNameAr = values.name_ar || await translateToArabic(values.name_en)
      const translatedDescAr = values.description_ar || (values.description_en ? await translateToArabic(values.description_en) : translatedNameAr)

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
        const errorMessage = result.error || "Something went wrong"
        toast.error(errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={async (e) => {
          e.preventDefault()
          
          // Get current form values
          const currentValues = form.getValues()
          
          // Apply translation before validation if Arabic fields are empty
          if (!currentValues.name_ar || currentValues.name_ar.trim() === '') {
            const translatedName = await translateToArabic(currentValues.name_en)
            form.setValue("name_ar", translatedName, { shouldValidate: false })
          }
          
          if (!currentValues.description_ar || currentValues.description_ar.trim() === '') {
            const translatedDesc = currentValues.description_en ? await translateToArabic(currentValues.description_en) : ''
            form.setValue("description_ar", translatedDesc, { shouldValidate: false })
          }
          
          // Wait a tick for form to update
          setTimeout(async () => {
            // Manual validation check
            const isValid = await form.trigger()
            
            if (!isValid) {
              const errors = form.formState.errors
              const errorMessages = Object.values(errors).map(err => err.message).join(", ")
              toast.error(`Validation failed: ${errorMessages}`)
              return
            }
            
            // If valid, call onSubmit
            onSubmit(form.getValues())
          }, 100)
        }} 
        className="space-y-8 max-w-2xl"
      >
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
            name="name_ar"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Brand Name (Arabic)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="مثلاً: ليغو" 
                    maxLength={200}
                  />
                </FormControl>
                <FormDescription>
                  Arabic brand name (optional - will be auto-translated if empty)
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
                    disabled={isSubmitting}
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
          <FormField
            control={form.control}
            name="description_ar"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Description (Arabic)</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="صف هذا العلامة التجارية..." 
                    maxLength={500}
                    rows={4}
                  />
                </FormControl>
                <FormDescription>
                  Arabic description (optional - will be auto-translated if empty)
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
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                {initialData ? "Update Brand" : "Create Brand"}
              </>
            )}
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
