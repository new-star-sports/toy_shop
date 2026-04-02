"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Save, Trash2, ImageIcon, Layout, Plus, FolderOpen, Edit2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/ui/file-upload"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

import { Blog, BlogCategory } from "@nss/db/queries"
import { blogSchema, type Blog as BlogType } from "@nss/validators/blog"
import { saveBlogAction, deleteBlogAction, saveBlogCategoryAction } from "../_actions"
import { translateToArabic } from "../../_lib/translate"

type BlogFormValues = BlogType

function CharacterCounter({ current, max }: { current: number; max: number }) {
  const percentage = (current / max) * 100
  const colorClass = percentage > 100 ? "text-red-500" : percentage > 90 ? "text-amber-500" : "text-muted-foreground"
  return (
    <span className={`text-xs ${colorClass}`}>
      {current}/{max}
    </span>
  )
}

interface BlogFormProps {
  initialData?: Blog | null
  categories: BlogCategory[]
}

export function BlogForm({ initialData, categories: initialCategories }: BlogFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [categories, setCategories] = useState<BlogCategory[]>(initialCategories)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null)
  const [categoryFormData, setCategoryFormData] = useState({ name_en: "", name_ar: "", slug: "" })
  const [isSavingCategory, setIsSavingCategory] = useState(false)

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema) as any,
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
        excerpt_ar: values.excerpt_en ? await translateToArabic(values.excerpt_en) : null,
        content_ar: await translateToArabic(values.content_en),
        image_url: values.image_url || null,
      }

      const result = await saveBlogAction({
        ...translatedData,
        id: initialData?.id,
        published_at: values.is_published && !initialData?.published_at ? new Date().toISOString() : initialData?.published_at
      } as any)

      if (result.success) {
        toast.success(initialData ? "Article updated successfully" : "Article published successfully")
        router.push("/blogs")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to save article")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred"
      toast.error(message)
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

  // Category management handlers
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const handleSaveCategory = async () => {
    if (!categoryFormData.name_en.trim()) {
      toast.error("Category name is required")
      return
    }
    
    setIsSavingCategory(true)
    try {
      const slug = categoryFormData.slug.trim() || categoryFormData.name_en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      const name_ar = categoryFormData.name_ar.trim() || categoryFormData.name_en
      
      const result = await saveBlogCategoryAction({
        id: editingCategory?.id,
        name_en: categoryFormData.name_en.trim(),
        name_ar,
        slug
      })
      
      if (result.success) {
        toast.success(editingCategory ? "Category updated" : "Category created")
        // Refresh categories
        const response = await fetch('/api/blog-categories')
        if (response.ok) {
          const newCategories = await response.json()
          setCategories(newCategories)
        }
        setCategoryDialogOpen(false)
        setEditingCategory(null)
        setCategoryFormData({ name_en: "", name_ar: "", slug: "" })
      } else {
        toast.error(result.error || "Failed to save category")
      }
    } catch (error) {
      toast.error("An error occurred while saving category")
    } finally {
      setIsSavingCategory(false)
    }
  }

  const handleAddNewCategory = () => {
    setEditingCategory(null)
    setShowCategoryForm(false)
    setCategoryFormData({ name_en: "", name_ar: "", slug: "" })
    setCategoryDialogOpen(true)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-8 max-w-5xl mx-auto pb-20">
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
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="min-w-[120px] bg-emerald-500 hover:bg-emerald-600 text-white"
          >
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
                  <div className="flex items-center justify-between">
                    <Label>Article Title</Label>
                    <CharacterCounter current={form.watch("title_en")?.length || 0} max={200} />
                  </div>
                  <Input 
                    {...form.register("title_en")} 
                    onChange={onTitleChange}
                    placeholder="e.g. Top 10 Educational Toys for Toddlers in 2025" 
                    maxLength={200}
                  />
                  {form.formState.errors.title_en && <p className="text-xs text-red-500">{form.formState.errors.title_en.message}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Excerpt</Label>
                    <CharacterCounter current={form.watch("excerpt_en")?.length || 0} max={300} />
                  </div>
                  <Textarea 
                    {...form.register("excerpt_en")} 
                    placeholder="Short summary for the blog listing card..." 
                    className="h-20"
                    maxLength={300}
                  />
                  <p className="text-[11px] text-muted-foreground">Brief summary shown in blog listing cards (max 300 characters)</p>
                  {form.formState.errors.excerpt_en && <p className="text-xs text-red-500">{form.formState.errors.excerpt_en.message}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Content (Markdown/HTML Support)</Label>
                    <CharacterCounter current={form.watch("content_en")?.length || 0} max={50000} />
                  </div>
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
                <div className="flex items-center justify-between">
                  <Label>Entry Slug</Label>
                  <CharacterCounter current={form.watch("slug")?.length || 0} max={100} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-nss-text-secondary">/blog/</span>
                  <Input {...form.register("slug")} className="h-8 text-xs font-mono" placeholder="article-url-slug" maxLength={100} />
                </div>
                {form.formState.errors.slug && <p className="text-xs text-red-500">{form.formState.errors.slug.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Category</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleAddNewCategory}
                    className="h-7 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
                </div>
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

              {/* Category Management Dialog */}
              <Dialog open={categoryDialogOpen} onOpenChange={(open) => {
                setCategoryDialogOpen(open)
                if (!open) {
                  setEditingCategory(null)
                  setShowCategoryForm(false)
                  setCategoryFormData({ name_en: "", name_ar: "", slug: "" })
                }
              }}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5" />
                      {showCategoryForm ? (editingCategory ? "Edit Category" : "Add New Category") : "Blog Categories"}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="py-4">
                    {!showCategoryForm ? (
                      /* List View */
                      <div className="space-y-4">
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {categories.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No categories yet</p>
                          ) : (
                            categories.map((cat) => (
                              <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                                <div>
                                  <p className="text-sm font-medium">{cat.name_en}</p>
                                  <p className="text-xs text-muted-foreground">/{cat.slug}</p>
                                </div>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => {
                                    setEditingCategory(cat)
                                    setCategoryFormData({
                                      name_en: cat.name_en || "",
                                      name_ar: cat.name_ar || "",
                                      slug: cat.slug || ""
                                    })
                                    setShowCategoryForm(true)
                                  }}
                                  className="h-7 w-7 p-0"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setEditingCategory(null)
                            setCategoryFormData({ name_en: "", name_ar: "", slug: "" })
                            setShowCategoryForm(true)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Category
                        </Button>
                      </div>
                    ) : (
                      /* Form View */
                      <div className="space-y-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowCategoryForm(false)
                            setEditingCategory(null)
                            setCategoryFormData({ name_en: "", name_ar: "", slug: "" })
                          }}
                          className="mb-2"
                        >
                          ← Back to list
                        </Button>
                        
                        <div className="space-y-3">
                          <Label>Category Name (English)</Label>
                          <Input 
                            placeholder="e.g. Educational Toys" 
                            value={categoryFormData.name_en}
                            onChange={(e) => {
                              const name = e.target.value
                              const slug = name
                                .toLowerCase()
                                .replace(/[^a-z0-9\s-]/g, '')
                                .replace(/\s+/g, '-')
                                .replace(/-+/g, '-')
                                .substring(0, 50)
                              setCategoryFormData({
                                ...categoryFormData,
                                name_en: name,
                                slug: editingCategory ? categoryFormData.slug : slug
                              })
                            }}
                          />
                          
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Slug (URL)</Label>
                            <Input 
                              value={categoryFormData.slug}
                              onChange={(e) => setCategoryFormData({...categoryFormData, slug: e.target.value})}
                              className="text-xs bg-muted/50"
                              readOnly={!editingCategory}
                            />
                          </div>
                          
                          <p className="text-xs text-muted-foreground">Arabic translation will be auto-generated</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {showCategoryForm && (
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => {
                          setShowCategoryForm(false)
                          setEditingCategory(null)
                          setCategoryFormData({ name_en: "", name_ar: "", slug: "" })
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleSaveCategory}
                        disabled={isSavingCategory || !categoryFormData.name_en.trim()}
                      >
                        {isSavingCategory ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        {editingCategory ? "Update" : "Create"}
                      </Button>
                    </DialogFooter>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="border-nss-border shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-nss-border mb-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-nss-primary" /> Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 overflow-hidden">
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <FileUpload
                  bucket="blogs"
                  value={form.watch("image_url") || undefined}
                  onChange={(url: string | null) => form.setValue("image_url", url || "")}
                  maxSize={5 * 1024 * 1024}
                  className="aspect-video w-full"
                />
                <p className="text-[11px] text-muted-foreground">JPEG, PNG, WebP up to 5MB. Used as the article header image.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
