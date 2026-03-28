"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Save, Trash2, ImageIcon, Layout } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Blog, BlogCategory } from "@nss/db/queries"
import { saveBlogAction, deleteBlogAction } from "../_actions"
import { translateToArabic } from "../../_lib/translate"

const blogSchema = z.object({
  title_en: z.string().min(5, "English title is too short"),
  title_ar: z.string().min(5, "Arabic title is too short"),
  slug: z.string().min(3, "Slug is required"),
  excerpt_en: z.string().optional(),
  excerpt_ar: z.string().optional(),
  content_en: z.string().min(10, "English content is required"),
  content_ar: z.string().min(10, "Arabic content is required"),
  image_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
  category_id: z.string().optional().nullable(),
  is_published: z.boolean(),
})

type BlogFormValues = z.infer<typeof blogSchema>

interface BlogFormProps {
  initialData?: Blog | null
  categories: BlogCategory[]
}

export function BlogForm({ initialData, categories }: BlogFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title_en: initialData?.title_en || "",
      title_ar: initialData?.title_ar || "",
      slug: initialData?.slug || "",
      excerpt_en: initialData?.excerpt_en || "",
      excerpt_ar: initialData?.excerpt_ar || "",
      content_en: initialData?.content_en || "",
      content_ar: initialData?.content_ar || "",
      image_url: initialData?.image_url || "",
      category_id: initialData?.category_id || null,
      is_published: initialData?.is_published ?? false,
    },
  })

  const onSubmit = async (values: BlogFormValues) => {
    setIsSubmitting(true)
    try {
      // Automate Arabic translations
      const translatedData = {
        ...values,
        title_ar: await translateToArabic(values.title_en),
        excerpt_ar: values.excerpt_en ? await translateToArabic(values.excerpt_en) : values.title_ar,
        content_ar: await translateToArabic(values.content_en),
      }

      const result = await saveBlogAction({
        ...translatedData,
        id: initialData?.id,
        published_at: values.is_published && !initialData?.published_at ? new Date().toISOString() : initialData?.published_at
      } as any)

      if (result.success) {
        toast.success(initialData ? "Article updated" : "Article created")
        router.push("/blogs")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to save article")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const onDelete = async () => {
    if (!initialData?.id || !confirm("Are you sure you want to delete this article?")) return
    setIsDeleting(true)
    const result = await deleteBlogAction(initialData.id)
    if (result.success) {
      toast.success("Article deleted")
      router.push("/blogs")
      router.refresh()
    } else {
      toast.error(result.error || "Failed to delete article")
      setIsDeleting(false)
    }
  }

  // Auto-generate slug from English title if slug is empty
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    form.setValue("title_en", title)
    if (!initialData && !form.getValues("slug")) {
      form.setValue("slug", title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-nss-text-primary">
          {initialData ? "Edit Article" : "New Blog Article"}
        </h1>
        <div className="flex items-center gap-3">
          {initialData && (
            <Button
              type="button"
              variant="outline"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={onDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {initialData ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Areas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Article Title</Label>
                  <Input 
                    {...form.register("title_en")} 
                    onChange={onTitleChange}
                    placeholder="e.g. Top 10 Educational Toys for Toddlers in 2025" 
                  />
                  {form.formState.errors.title_en && <p className="text-xs text-red-500">{form.formState.errors.title_en.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Excerpt</Label>
                  <Textarea 
                    {...form.register("excerpt_en")} 
                    placeholder="Short summary for the blog listing card..." 
                    className="h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Content (Markdown/HTML Support)</Label>
                  <Textarea 
                    {...form.register("content_en")} 
                    placeholder="Main article content..." 
                    className="min-h-[400px] font-mono text-sm"
                  />
                  {form.formState.errors.content_en && <p className="text-xs text-red-500">{form.formState.errors.content_en.message}</p>}
                </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Card className="border-nss-border shadow-sm">
            <CardHeader className="pb-3 border-b border-nss-border mb-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Layout className="h-4 w-4 text-nss-primary" /> Publishing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-nss-surface border border-nss-border">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Published Status</Label>
                  <p className="text-[10px] text-nss-text-secondary">Visible to everyone</p>
                </div>
                <Switch 
                  checked={form.watch("is_published")} 
                  onCheckedChange={(checked) => form.setValue("is_published", checked)} 
                />
              </div>

              <div className="space-y-2">
                <Label>Entry Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-nss-text-secondary">/blog/</span>
                  <Input {...form.register("slug")} className="h-8 text-xs font-mono" placeholder="article-url-slug" />
                </div>
                {form.formState.errors.slug && <p className="text-xs text-red-500">{form.formState.errors.slug.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.watch("category_id") || "none"}
                  onValueChange={(val) => form.setValue("category_id", val === "none" ? null : val)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Category</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name_en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-nss-border shadow-sm">
            <CardHeader className="pb-3 border-b border-nss-border mb-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-nss-primary" /> Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Featured Image URL</Label>
                <Input {...form.register("image_url")} placeholder="https://..." className="text-xs" />
                {form.watch("image_url") && (
                  <div className="mt-2 relative aspect-video rounded-md overflow-hidden bg-nss-surface">
                    <img src={form.watch("image_url")!} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
