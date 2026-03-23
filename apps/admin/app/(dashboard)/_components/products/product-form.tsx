"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, type Product } from "@nss/validators/product"
import { createProduct, updateProduct } from "../../products/_actions"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@nss/ui/components/tabs"
import { Button } from "@nss/ui/components/button"
import { Card } from "@nss/ui/components/card"
import { Input } from "@nss/ui/components/input"
import { Label } from "@nss/ui/components/label"
import { Textarea } from "@nss/ui/components/textarea"
import { Badge } from "@nss/ui/components/badge"
import { Switch } from "@nss/ui/components/switch"
import { Plus, Trash2, Image as ImageIcon, X, UploadCloud } from "lucide-react"
import type { Category, Brand } from "@nss/db/types"

interface ProductFormProps {
  initialData?: any
  categories?: Category[]
  brands?: Brand[]
}

export function ProductForm({ initialData, categories = [], brands = [] }: ProductFormProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const router = useRouter()

  const form = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: "draft",
      price_kwd: 0,
      stock_quantity: 0,
      min_age: 0,
      weight_grams: 0,
      length_cm: 0,
      width_cm: 0,
      height_cm: 0,
      return_eligibility: "eligible",
      tax_status: "taxable",
      track_inventory: true,
      out_of_stock_behaviour: "show_out_of_stock",
      ...initialData,
    },
  })

  // Mock media state for preview
  const [images, setImages] = useState<string[]>([])
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  // Variants management
  const [variants, setVariants] = useState<any[]>([])
  const addVariant = () => {
    setVariants(prev => [...prev, { id: Math.random().toString(), name_en: "", sku: "", price: 0, stock: 0 }])
  }
  const removeVariant = (id: string) => {
    setVariants(prev => prev.filter(v => v.id !== id))
  }

  const onSubmit = async (data: Product) => {
    try {
      if (initialData?.id) {
        const result = await updateProduct(initialData.id, data, images, variants)
        if (result.success) {
          router.push("/products")
          router.refresh()
        } else {
          alert("Error updating product: " + result.error)
        }
      } else {
        const result = await createProduct(data, images, variants)
        if (result.success) {
          router.push("/products")
          router.refresh()
        } else {
          alert("Error creating product: " + result.error)
        }
      }
    } catch (err) {
      console.error(err)
      alert("An unexpected error occurred.")
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-20">
      <div className="flex items-center justify-between sticky top-0 z-10 bg-nss-surface/80 backdrop-blur-md py-4 border-b border-nss-border">
        <div>
          <h2 className="text-xl font-bold text-nss-text-primary">
            {initialData ? "Edit Product" : "New Product"}
          </h2>
          <div className="flex items-center gap-2 mt-1">
             <Badge variant="outline" className="capitalize">
               {form.watch("status")}
             </Badge>
             {form.formState.isDirty && (
               <span className="text-xs text-nss-accent animate-pulse">• Unsaved Changes</span>
             )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" type="button" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-max bg-transparent h-auto p-0 flex gap-1">
            {[
              { id: "basic", label: "Basic Info" },
              { id: "media", label: "Media" },
              { id: "pricing", label: "Pricing" },
              { id: "inventory", label: "Inventory" },
              { id: "variants", label: "Variants" },
              { id: "organisation", label: "Organisation" },
              { id: "safety", label: "Safety & Legal" },
              { id: "shipping", label: "Shipping" },
              { id: "seo", label: "SEO" },
              { id: "customs", label: "Customs" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-nss-primary data-[state=active]:text-white rounded-full px-6 py-2 bg-white border border-nss-border"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="mt-6">
          {/* Tab 1: Basic Information */}
          <TabsContent value="basic" className="space-y-6">
            <Card className="p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* English Section */}
                  <div className="space-y-4 border-e border-nss-border pe-8">
                    <h3 className="font-semibold text-nss-text-primary flex items-center gap-2">
                       <span className="text-xl">🇬🇧</span> English Details
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name_en">Product Name</Label>
                      <Input
                        id="name_en"
                        {...form.register("name_en")}
                        placeholder="e.g. Remote Control Racing Car"
                      />
                      {form.formState.errors.name_en && (
                        <p className="text-xs text-nss-danger">{form.formState.errors.name_en.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="short_description_en">Short Description (SEO)</Label>
                      <Input
                        id="short_description_en"
                        {...form.register("short_description_en")}
                        placeholder="Brief summary for list views"
                      />
                      <p className="text-[10px] text-nss-text-secondary text-end">
                        {form.watch("short_description_en")?.length || 0}/160
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description_en">Detailed Description</Label>
                      <Textarea
                        id="description_en"
                        className="min-h-[200px]"
                        {...form.register("description_en")}
                        placeholder="Full product story and specifications..."
                      />
                    </div>
                  </div>

                  {/* Arabic Section */}
                  <div className="space-y-4" dir="rtl">
                    <h3 className="font-semibold text-nss-text-primary flex items-center gap-2 font-arabic">
                       <span className="text-xl">🇰🇼</span> التفاصيل بالعربية
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name_ar" className="font-arabic">اسم المنتج</Label>
                      <Input
                        id="name_ar"
                        className="font-arabic"
                        {...form.register("name_ar")}
                        placeholder="مثال: سيارة سباق بالتحكم عن بعد"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="short_description_ar" className="font-arabic">وصف قصير</Label>
                      <Input
                        id="short_description_ar"
                        className="font-arabic"
                        {...form.register("short_description_ar")}
                        placeholder="ملخص موجز للمنتج"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description_ar" className="font-arabic">وصف تفصيلي</Label>
                      <Textarea
                        id="description_ar"
                        className="min-h-[200px] font-arabic"
                        {...form.register("description_ar")}
                        placeholder="قصة المنتج الكاملة والمواصفات..."
                      />
                    </div>
                  </div>
               </div>

               <div className="mt-8 pt-8 border-t border-nss-border">
                  <div className="max-w-md space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <div className="flex items-center gap-2 group">
                      <span className="text-sm text-nss-text-secondary">/products/</span>
                      <Input
                        id="slug"
                        {...form.register("slug")}
                        className="bg-nss-surface"
                      />
                    </div>
                  </div>
               </div>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="price_kwd">Regular Price (KWD)</Label>
                    <div className="relative">
                      <Input
                        id="price_kwd"
                        type="number"
                        step="0.001"
                        {...form.register("price_kwd", { valueAsNumber: true })}
                        className="ps-10"
                      />
                      <span className="absolute start-3 top-1/2 -translate-y-1/2 text-nss-text-secondary text-xs">KD</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="compare_at_price_kwd">Compare-at Price (Strike-through)</Label>
                    <div className="relative">
                      <Input
                        id="compare_at_price_kwd"
                        type="number"
                        step="0.001"
                        {...form.register("compare_at_price_kwd", { valueAsNumber: true })}
                        className="ps-10"
                      />
                      <span className="absolute start-3 top-1/2 -translate-y-1/2 text-nss-text-secondary text-xs">KD</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost_price_kwd">Cost Price (Private)</Label>
                    <div className="relative">
                      <Input
                        id="cost_price_kwd"
                        type="number"
                        step="0.001"
                        {...form.register("cost_price_kwd", { valueAsNumber: true })}
                        className="ps-10"
                      />
                      <span className="absolute start-3 top-1/2 -translate-y-1/2 text-nss-text-secondary text-xs">KD</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 bg-nss-surface p-6 rounded-xl border border-nss-border">
                  <h3 className="font-semibold text-nss-text-primary">Flash Sale & Tax</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Include in Flash Sale</Label>
                      <p className="text-xs text-nss-text-secondary">Show this product in flash sale sections</p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-nss-border text-nss-primary"
                      {...form.register("include_in_flash_sale")}
                    />
                  </div>

                  {form.watch("include_in_flash_sale") && (
                    <div className="space-y-2 animate-in slide-in-from-top-2">
                      <Label htmlFor="flash_sale_discount_percent">Discount Percentage (%)</Label>
                      <Input
                        id="flash_sale_discount_percent"
                        type="number"
                        {...form.register("flash_sale_discount_percent", { valueAsNumber: true })}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="tax_status">Tax Status</Label>
                    <select
                      id="tax_status"
                      className="w-full h-10 px-3 py-2 rounded-md border border-nss-border bg-nss-card text-sm"
                      {...form.register("tax_status")}
                    >
                      <option value="taxable">Taxable</option>
                      <option value="tax_exempt">Tax Exempt</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Tab 4: Inventory */}
          <TabsContent value="inventory" className="space-y-6">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-nss-text-primary">Stock Control</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                    <Input
                      id="sku"
                      {...form.register("sku")}
                      placeholder="e.g. TOY-RC-001"
                    />
                    {form.formState.errors.sku && (
                      <p className="text-xs text-nss-danger">{form.formState.errors.sku.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode (EAN/UPC)</Label>
                    <Input
                      id="barcode"
                      {...form.register("barcode")}
                      placeholder="e.g. 501234567890"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-nss-border">
                    <div className="space-y-0.5">
                      <Label>Track Inventory</Label>
                      <p className="text-xs text-nss-text-secondary">Automatically decrement stock on orders</p>
                    </div>
                    <Switch
                      checked={form.watch("track_inventory")}
                      onCheckedChange={(checked) => form.setValue("track_inventory", checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-nss-text-primary">Quantities & Alerts</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Current Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      {...form.register("stock_quantity", { valueAsNumber: true })}
                      disabled={!form.watch("track_inventory")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                    <Input
                      id="low_stock_threshold"
                      type="number"
                      {...form.register("low_stock_threshold", { valueAsNumber: true })}
                      disabled={!form.watch("track_inventory")}
                    />
                    <p className="text-[10px] text-nss-text-secondary">Admin alert fires when stock drops below this</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="out_of_stock_behaviour">Out-of-Stock Behaviour</Label>
                    <select
                      id="out_of_stock_behaviour"
                      className="w-full h-10 px-3 py-2 rounded-md border border-nss-border bg-nss-card text-sm"
                      {...form.register("out_of_stock_behaviour")}
                    >
                      <option value="show_out_of_stock">Show as Out of Stock</option>
                      <option value="hide">Hide from Storefront</option>
                      <option value="continue_selling">Continue Selling (Backorders)</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab 6: Organisation */}
          <TabsContent value="organisation">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category_id">Primary Category</Label>
                    <select
                      id="category_id"
                      className="w-full h-10 px-3 py-2 rounded-md border border-nss-border bg-nss-card text-sm"
                      {...form.register("category_id" as any)}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name_en} / {cat.name_ar}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand_id">Brand</Label>
                    <select
                      id="brand_id"
                      className="w-full h-10 px-3 py-2 rounded-md border border-nss-border bg-nss-card text-sm"
                      {...form.register("brand_id" as any)}
                    >
                      <option value="">Select a brand</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name_en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-semibold text-nss-text-primary">Flags & Visibility</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Arrival</Label>
                      <p className="text-xs text-nss-text-secondary">Show "New" badge on storefront</p>
                    </div>
                    <Switch
                      checked={form.watch("is_new_arrival")}
                      onCheckedChange={(checked) => form.setValue("is_new_arrival", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Homepage Featured</Label>
                      <p className="text-xs text-nss-text-secondary">Display in featured sections on home</p>
                    </div>
                    <Switch
                      checked={form.watch("is_homepage_featured")}
                      onCheckedChange={(checked) => form.setValue("is_homepage_featured", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Best Seller Override</Label>
                      <p className="text-xs text-nss-text-secondary">Force "Best Seller" badge</p>
                    </div>
                    <Switch
                      checked={form.watch("is_best_seller_override")}
                      onCheckedChange={(checked) => form.setValue("is_best_seller_override", checked)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab 7: Safety & Legal */}
          <TabsContent value="safety">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-nss-text-primary">Age & Origin</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min_age">Min Age (Years)</Label>
                      <Input
                        id="min_age"
                        type="number"
                        {...form.register("min_age", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max_age">Max Age (Optional)</Label>
                      <Input
                        id="max_age"
                        type="number"
                        {...form.register("max_age", { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country_of_origin">Country of Origin</Label>
                    <Input id="country_of_origin" {...form.register("country_of_origin")} placeholder="e.g. Germany" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manufacturer_name">Manufacturer Name</Label>
                    <Input id="manufacturer_name" {...form.register("manufacturer_name")} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-nss-text-primary">Kuwait Compliance (KUCAS)</h3>
                  <div className="space-y-2">
                    <Label htmlFor="kucas_certificate">KUCAS Certificate Number</Label>
                    <Input id="kucas_certificate" {...form.register("kucas_certificate")} placeholder="Required for import" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kucas_expiry">KUCAS Expiry Date</Label>
                    <Input id="kucas_expiry" type="date" {...form.register("kucas_expiry")} />
                  </div>

                  <div className="pt-4 border-t border-nss-border">
                    <div className="flex items-center justify-between mb-2">
                      <Label>Battery Required</Label>
                      <Switch
                        checked={form.watch("battery_required")}
                        onCheckedChange={(checked) => form.setValue("battery_required", checked)}
                      />
                    </div>
                    {form.watch("battery_required") && (
                      <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                        <Input id="battery_type" {...form.register("battery_type")} placeholder="Type (e.g. AA)" />
                        <div className="flex items-center gap-2">
                          <input type="checkbox" {...form.register("battery_included")} />
                          <span className="text-xs">Included</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab 8: Shipping */}
          <TabsContent value="shipping">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-nss-text-primary">Package Dimensions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight_grams">Weight (Grams)</Label>
                      <Input
                        id="weight_grams"
                        type="number"
                        {...form.register("weight_grams", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="length_cm">Length (cm)</Label>
                      <Input
                        id="length_cm"
                        type="number"
                        step="0.1"
                        {...form.register("length_cm", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width_cm">Width (cm)</Label>
                      <Input
                        id="width_cm"
                        type="number"
                        step="0.1"
                        {...form.register("width_cm", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height_cm">Height (cm)</Label>
                      <Input
                        id="height_cm"
                        type="number"
                        step="0.1"
                        {...form.register("height_cm", { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                   <h3 className="font-semibold text-nss-text-primary">Handling</h3>
                   <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Requires Special Handling</Label>
                      <p className="text-xs text-nss-text-secondary">e.g. Fragile, oversized, or hazardous</p>
                    </div>
                    <Switch
                      checked={form.watch("requires_special_handling")}
                      onCheckedChange={(checked) => form.setValue("requires_special_handling", checked)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab 9: SEO */}
          <TabsContent value="seo">
            <Card className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h3 className="font-semibold text-nss-text-primary">English SEO</h3>
                    <div className="space-y-2">
                      <Label htmlFor="seo_title_en">SEO Title</Label>
                      <Input id="seo_title_en" {...form.register("seo_title_en")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seo_description_en">SEO Description</Label>
                      <Textarea id="seo_description_en" {...form.register("seo_description_en")} />
                    </div>
                 </div>
                 <div className="space-y-4" dir="rtl">
                    <h3 className="font-semibold text-nss-text-primary font-arabic">SEO بالعربية</h3>
                    <div className="space-y-2">
                      <Label htmlFor="seo_title_ar" className="font-arabic">عنوان SEO</Label>
                      <Input id="seo_title_ar" className="font-arabic" {...form.register("seo_title_ar")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seo_description_ar" className="font-arabic">وصف SEO</Label>
                      <Textarea id="seo_description_ar" className="font-arabic" {...form.register("seo_description_ar")} />
                    </div>
                 </div>
              </div>
              <div className="space-y-2 max-w-xl">
                 <Label htmlFor="canonical_url">Canonical URL</Label>
                 <Input id="canonical_url" {...form.register("canonical_url")} placeholder="https://..." />
              </div>
            </Card>
          </TabsContent>

          {/* Tab 2: Media */}
          <TabsContent value="media">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="font-semibold text-nss-text-primary">Product Gallery</h3>
                   <Label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 bg-nss-primary text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity">
                         <UploadCloud size={16} />
                         Upload Images
                      </div>
                      <input id="image-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                   </Label>
                </div>

                {images.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-nss-border rounded-xl bg-nss-surface">
                     <ImageIcon size={48} className="mx-auto text-nss-text-secondary mb-4 opacity-20" />
                     <p className="text-nss-text-secondary">No images uploaded yet.</p>
                     <p className="text-xs text-nss-text-secondary mt-1">Recommended size: 1000x1000px</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in">
                     {images.map((img, i) => (
                       <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border border-nss-border bg-white shadow-sm hover:shadow-md transition-all">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Button
                               type="button"
                               variant="destructive"
                               size="icon"
                               className="h-8 w-8 rounded-full"
                               onClick={() => removeImage(i)}
                             >
                               <X size={14} />
                             </Button>
                          </div>
                          {i === 0 && (
                            <div className="absolute top-2 start-2 bg-nss-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                               PRIMARY
                            </div>
                          )}
                       </div>
                     ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Tab 5: Variants */}
          <TabsContent value="variants">
            <Card className="p-6">
               <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-nss-text-primary">Product Variants</h3>
                    <p className="text-xs text-nss-text-secondary">Manage sizes, colours, or multi-packs</p>
                  </div>
                  <Button type="button" onClick={addVariant} className="gap-2">
                     <Plus size={16} />
                     Add Variant
                  </Button>
               </div>

               {variants.length === 0 ? (
                 <div className="text-center py-12 bg-nss-surface rounded-xl border border-nss-border italic text-nss-text-secondary">
                    This product has no variants (Simple Product)
                 </div>
               ) : (
                 <div className="space-y-4">
                    {variants.map((variant) => (
                      <div key={variant.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 rounded-xl border border-nss-border bg-white animate-in slide-in-from-left-2 shadow-sm">
                         <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-nss-text-secondary">Name (e.g. Red / Large)</Label>
                            <Input placeholder="Variant name" className="h-9" />
                         </div>
                         <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-nss-text-secondary">SKU</Label>
                            <Input placeholder="SKU" className="h-9" />
                         </div>
                         <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-nss-text-secondary">Price (KWD)</Label>
                            <Input type="number" step="0.001" placeholder="0.000" className="h-9" />
                         </div>
                         <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-nss-text-secondary">Stock</Label>
                            <Input type="number" placeholder="0" className="h-9" />
                         </div>
                         <div className="flex items-end justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-nss-danger hover:bg-nss-danger/10 h-9 px-3"
                              onClick={() => removeVariant(variant.id)}
                            >
                               <Trash2 size={16} />
                            </Button>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </Card>
          </TabsContent>

          {/* Tab 10: Customs */}
          <TabsContent value="customs">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hs_code_6">HS Code (6 digits)</Label>
                      <Input id="hs_code_6" {...form.register("hs_code_6")} maxLength={6} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gcc_tariff_12">GCC Tariff Code (12 digits)</Label>
                      <Input id="gcc_tariff_12" {...form.register("gcc_tariff_12")} maxLength={12} />
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Import Licence Required</Label>
                        <p className="text-xs text-nss-text-secondary">Required for certain toy categories in Kuwait</p>
                      </div>
                      <Switch
                        checked={form.watch("import_licence_required")}
                        onCheckedChange={(checked) => form.setValue("import_licence_required", checked)}
                      />
                    </div>
                    {form.watch("import_licence_required") && (
                      <div className="space-y-2 animate-in fade-in">
                        <Label htmlFor="import_licence_number">Licence Number</Label>
                        <Input id="import_licence_number" {...form.register("import_licence_number")} />
                      </div>
                    )}
                 </div>
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </form>
  )
}
