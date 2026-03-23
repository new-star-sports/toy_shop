"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { categorySchema } from "@nss/validators/product"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@nss/ui/components/select"
import { Switch } from "@nss/ui/components/switch"
import { useRouter } from "next/navigation"
import { upsertCategoryAction } from "../../categories/_actions"
import { toast } from "sonner"
import type { Category } from "@nss/db/types"

interface CategoryFormProps {
  initialData?: Category | null
  categories: Category[]
}

type CategoryFormValues = z.infer<typeof categorySchema>

export function CategoryForm({ initialData, categories }: CategoryFormProps) {
  const router = useRouter()
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: initialData ? {
      name_en: initialData.name_en,
      name_ar: initialData.name_ar,
      slug: initialData.slug,
      description_en: initialData.description_en,
      description_ar: initialData.description_ar,
      parent_id: initialData.parent_id,
      is_homepage_pinned: initialData.is_homepage_pinned,
      homepage_order: initialData.homepage_order,
      is_active: initialData.is_active,
      image_url: initialData.image_url,
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

  async function onSubmit(values: CategoryFormValues) {
    const result = await upsertCategoryAction({
      ...initialData,
      ...values,
      parent_id: values.parent_id === "null" ? null : values.parent_id,
    } as Partial<Category>)

    if (result.success) {
      toast.success(initialData ? "Category updated" : "Category created")
      router.push("/categories")
    } else {
      toast.error(result.error || "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name_en"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Name (English)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Toys" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name_ar"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Name (Arabic)</FormLabel>
                <FormControl>
                   <Input {...field} dir="rtl" placeholder="ألعاب" />
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
                <Input {...field} placeholder="toys" />
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
            <FormItem>
              <FormLabel>Parent Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || "null"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parent category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null">None (Root)</SelectItem>
                  {categories
                    .filter(c => c.id !== initialData?.id) // Don't allow parenting to itself
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name_en}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="description_en"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Description (English)</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description_ar"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Description (Arabic)</FormLabel>
                <FormControl>
                  <Textarea {...field} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 p-4 border rounded-lg bg-nss-surface/30">
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
                    <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
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
        </div>

        <div className="flex gap-4">
          <Button type="submit">
            {initialData ? "Update Category" : "Create Category"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/categories")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
