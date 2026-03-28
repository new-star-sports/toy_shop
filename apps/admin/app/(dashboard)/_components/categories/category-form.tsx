"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { categorySchema } from "@nss/validators/product"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { Check, ChevronsUpDown } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { upsertCategoryAction } from "../../categories/_actions"
import { toast } from "sonner"
import { FileUpload } from "@/components/ui/file-upload"
import type { Category } from "@nss/db/types"
import { translateToArabic } from "../../_lib/translate"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CategoryFormProps {
  initialData?: Category | null;
  categories?: Category[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categoryFormSchema = categorySchema.extend({
  name_ar: z.string().optional(),
  description_ar: z.string().optional().nullable(),
  parent_id: z.string().nullable().optional(),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

const slugify = (text: string) => 
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function CategoryForm({ initialData, categories, onSuccess, onCancel }: CategoryFormProps) {
  const router = useRouter()
  
  // Image upload state
  const [categoryImage, setCategoryImage] = useState<string>(initialData?.image_url || "")
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema) as any,
    mode: "onChange",
    defaultValues: initialData ? {
      name_en: initialData.name_en,
      name_ar: initialData.name_ar || "",
      slug: initialData.slug,
      description_en: initialData.description_en || "",
      description_ar: initialData.description_ar || "",
      parent_id: initialData.parent_id,
      is_homepage_pinned: initialData.is_homepage_pinned,
      homepage_order: initialData.homepage_order,
      is_active: initialData.is_active,
      image_url: initialData.image_url || "",
    } : {
      name_en: "",
      name_ar: "",
      slug: "",
      description_en: "",
      description_ar: "",
      parent_id: null,
      is_homepage_pinned: false,
      homepage_order: 0,
      is_active: true,
      image_url: "",
    },
  })
  
  // Sync image preview with form field
  useEffect(() => {
    const imageUrl = form.watch("image_url")
    if (imageUrl !== categoryImage) {
      setCategoryImage(imageUrl || "")
    }
  }, [form.watch("image_url")])
  
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

  async function onSubmit(values: CategoryFormValues) {
    try {
      const translatedData = {
        ...values,
        name_ar: await translateToArabic(values.name_en),
        description_ar: values.description_en
          ? await translateToArabic(values.description_en)
          : await translateToArabic(values.name_en),
      }

      const result = await upsertCategoryAction({
        ...initialData,
        ...translatedData,
        image_url: categoryImage,
        parent_id: values.parent_id === "null" ? null : values.parent_id,
      } as Partial<Category>)

      if (result.success) {
        toast.success(initialData ? "Category updated successfully!" : "Category created successfully!")
        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/categories")
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
                <FormLabel>Category Name (English)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g. Action Figures" 
                    maxLength={200}
                  />
                </FormControl>
                <FormDescription>
                  Category name (max 200 characters). {field.value?.length || 0}/200 characters used
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
                      placeholder="toys" 
                      onChange={(e) => {
                        isSlugModified.current = true
                        field.onChange(e)
                      }}
                    />
                  </FormControl>
                  <FormDescription>The unique URL identifier.</FormDescription>
                  <FormMessage />
                </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parent_id"
            render={({ field }: { field: any }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Parent Category</FormLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between font-normal items-center",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value === "null" || !field.value
                        ? "None (Root)"
                        : categories?.find(
                            (category) => category.id === field.value
                          )?.name_en}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 z-popover">
                  <DropdownMenuItem
                    onClick={() => {
                      form.setValue("parent_id", "null")
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        field.value === "null" || !field.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    None (Root)
                  </DropdownMenuItem>
                  {categories?.filter(c => c.id !== initialData?.id).map((category) => (
                      <DropdownMenuItem
                        key={category.id}
                        onClick={() => {
                          form.setValue("parent_id", category.id)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            category.id === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {category.name_en}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <FormDescription>
                Select a parent category if this is a sub-category.
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
                    placeholder="Describe this category..." 
                    maxLength={500}
                    rows={4}
                  />
                </FormControl>
                <FormDescription>
                  Brief description of the category (max 500 characters).
                  {field.value?.length || 0}/500 characters used
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        </FieldGroup>

        {/* Image Upload Section */}
        <FieldGroup>
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Image</FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value || undefined}
                    onChange={field.onChange}
                    bucket="categories"
                    maxSize={5 * 1024 * 1024} // 5MB
                    allowedTypes={['jpeg', 'jpg', 'png', 'webp']}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Upload a category image. Recommended size: 400x400px. Max file size: 5MB.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Card>
            <CardHeader>
              <CardTitle>Category Settings</CardTitle>
              <CardDescription>Configure how this category appears on the homepage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="is_homepage_pinned"
                render={({ field }: { field: any }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Pin to Homepage</FormLabel>
                      <FormDescription>Show this category in the homepage grid.</FormDescription>
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

              {form.watch("is_homepage_pinned") && (
                <FormField
                  control={form.control}
                  name="homepage_order"
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
                      <FormDescription>Enable or disable this category.</FormDescription>
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
            {initialData ? "Update Category" : "Create Category"}
          </Button>

          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
