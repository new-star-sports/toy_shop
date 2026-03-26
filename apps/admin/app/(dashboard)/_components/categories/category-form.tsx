"use client"

import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@nss/ui/lib/utils"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nss/ui/components/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@nss/ui/components/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { Switch } from "@nss/ui/components/switch"
import { useRouter } from "next/navigation"
import { upsertCategoryAction } from "../../categories/_actions"
import { toast } from "sonner"
import type { Category } from "@nss/db/types"
import { translateToArabic } from "../../_lib/translate"

interface CategoryFormProps {
  initialData?: Category | null
  categories: Category[]
  onSuccess?: () => void
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

export function CategoryForm({ initialData, categories, onSuccess }: CategoryFormProps) {
  const router = useRouter()
  
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
    // Automate Arabic translations in background
    const translatedNameAr = values.name_ar || await translateToArabic(values.name_en)
    const translatedDescAr = values.description_ar || (values.description_en ? await translateToArabic(values.description_en) : values.name_ar)

    const result = await upsertCategoryAction({
      ...initialData,
      ...values,
      name_ar: translatedNameAr,
      description_ar: translatedDescAr,
      parent_id: values.parent_id === "null" ? null : values.parent_id,
    } as Partial<Category>)

    if (result.success) {
      toast.success(initialData ? "Category updated" : "Category created")
      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/categories")
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
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Action Figures" />
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
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Parent Category</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value === "null" || !field.value
                        ? "None (Root)"
                        : categories.find(
                            (category) => category.id === field.value
                          )?.name_en}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="null"
                          onSelect={() => {
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
                        </CommandItem>
                        {categories
                          .filter(c => c.id !== initialData?.id)
                          .map((category) => (
                            <CommandItem
                              key={category.id}
                              value={category.name_en}
                              onSelect={() => {
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
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select a parent category if this is a sub-category.
              </FormDescription>
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
                  <Textarea {...field} placeholder="Describe this category..." />
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
          <Button 
            type="submit" 
            loading={form.formState.isSubmitting}
            disabled={!form.formState.isValid}
          >
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
