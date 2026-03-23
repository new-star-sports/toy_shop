"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@nss/db/client"
import { productSchema, type Product } from "@nss/validators/product"
import type { ProductStatus } from "@nss/db/types"

/**
 * Update the status of a single product
 */
export async function updateProductStatus(productId: string, status: ProductStatus) {
  const supabase = createServiceClient()

  const { error } = await supabase
    .from("products")
    .update({ status })
    .eq("id", productId)

  if (error) {
    console.error("Error updating product status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/products")
  return { success: true }
}

/**
 * Delete a product (Soft delete by archiving, or hard delete if draft)
 */
export async function deleteProduct(productId: string) {
  const supabase = createServiceClient()

  // For this project, we'll do a hard delete if it's a draft, otherwise archive it
  const { data: product } = await supabase
    .from("products")
    .select("status")
    .eq("id", productId)
    .single()

  if (product?.status === "draft") {
    const { error } = await supabase.from("products").delete().eq("id", productId)
    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await supabase
      .from("products")
      .update({ status: "archived" })
      .eq("id", productId)
    if (error) return { success: false, error: error.message }
  }

  revalidatePath("/products")
  return { success: true }
}

/**
 * Create a new product with variants and images
 */
export async function createProduct(data: Product, images?: string[], variants?: any[]) {
  const supabase = createServiceClient()

  // 1. Insert Product
  // We map the incoming data to the DB schema fields
  const productToInsert: any = {
    name_en: data.name_en,
    name_ar: data.name_ar,
    slug: data.slug,
    short_description_en: data.short_description_en,
    short_description_ar: data.short_description_ar,
    description_en: data.description_en,
    description_ar: data.description_ar,
    status: data.status,
    price_kwd: data.price_kwd,
    compare_at_price_kwd: data.compare_at_price_kwd,
    cost_price_kwd: data.cost_price_kwd,
    tax_status: data.tax_status,
    include_in_flash_sale: data.include_in_flash_sale,
    flash_sale_discount_percent: data.flash_sale_discount_percent,
    sku: data.sku,
    barcode: data.barcode,
    track_inventory: data.track_inventory,
    stock_quantity: data.stock_quantity,
    low_stock_threshold: data.low_stock_threshold,
    out_of_stock_behaviour: data.out_of_stock_behaviour,
    category_id: (data as any).category_id,
    brand_id: (data as any).brand_id,
    is_new_arrival: data.is_new_arrival,
    is_homepage_featured: data.is_homepage_featured,
    is_best_seller_override: data.is_best_seller_override,
    min_age: data.min_age,
    max_age: data.max_age,
    country_of_origin: data.country_of_origin,
    manufacturer_name: data.manufacturer_name,
    weight_grams: data.weight_grams,
    length_cm: data.length_cm,
    width_cm: data.width_cm,
    height_cm: data.height_cm,
    return_eligibility: data.return_eligibility,
    hs_code_6: (data as any).hs_code_6 || "000000",
    gcc_tariff_12: (data as any).gcc_tariff_12 || "000000000000",
  }

  const { data: newProduct, error: productError } = await supabase
    .from("products")
    .insert(productToInsert)
    .select()
    .single()

  if (productError) {
    console.error("Error creating product:", productError)
    return { success: false, error: productError.message }
  }

  const productId = (newProduct as any).id

  // 2. Insert Variants if any
  if (variants && variants.length > 0) {
    const variantsToInsert = variants.map((v, i) => ({
      product_id: productId,
      name_en: v.name_en,
      name_ar: v.name_ar || v.name_en,
      sku: v.sku,
      price_override_kwd: v.price || null,
      stock_quantity: v.stock || 0,
      display_order: i,
      variant_type: "custom" as any,
    }))

    const { error: variantError } = await supabase
      .from("product_variants")
      .insert(variantsToInsert as any)

    if (variantError) {
      console.error("Error creating variants:", variantError)
    }
  }

  // 3. Insert Images if any
  if (images && images.length > 0) {
    const imagesToInsert = images.map((url, i) => ({
      product_id: productId,
      url,
      display_order: i,
    }))

    const { error: imageError } = await supabase
      .from("product_images")
      .insert(imagesToInsert as any)

    if (imageError) {
      console.error("Error creating images:", imageError)
    }
  }

  revalidatePath("/products")
  return { success: true, id: productId }
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, data: Product, images?: string[], variants?: any[]) {
  const supabase = createServiceClient()

  const productToUpdate: any = {
    name_en: data.name_en,
    name_ar: data.name_ar,
    slug: data.slug,
    short_description_en: data.short_description_en,
    short_description_ar: data.short_description_ar,
    description_en: data.description_en,
    description_ar: data.description_ar,
    status: data.status,
    price_kwd: data.price_kwd,
    compare_at_price_kwd: data.compare_at_price_kwd,
    cost_price_kwd: data.cost_price_kwd,
    tax_status: data.tax_status,
    include_in_flash_sale: data.include_in_flash_sale,
    flash_sale_discount_percent: data.flash_sale_discount_percent,
    sku: data.sku,
    barcode: data.barcode,
    track_inventory: data.track_inventory,
    stock_quantity: data.stock_quantity,
    low_stock_threshold: data.low_stock_threshold,
    out_of_stock_behaviour: data.out_of_stock_behaviour,
    category_id: (data as any).category_id,
    brand_id: (data as any).brand_id,
    is_new_arrival: data.is_new_arrival,
    is_homepage_featured: data.is_homepage_featured,
    is_best_seller_override: data.is_best_seller_override,
    min_age: data.min_age,
    max_age: data.max_age,
    country_of_origin: data.country_of_origin,
    manufacturer_name: data.manufacturer_name,
    weight_grams: data.weight_grams,
    length_cm: data.length_cm,
    width_cm: data.width_cm,
    height_cm: data.height_cm,
    return_eligibility: data.return_eligibility,
    hs_code_6: (data as any).hs_code_6,
    gcc_tariff_12: (data as any).gcc_tariff_12,
  }

  const { error: productError } = await supabase
    .from("products")
    .update(productToUpdate)
    .eq("id", id)

  if (productError) {
    console.error("Error updating product:", productError)
    return { success: false, error: productError.message }
  }

  // TODO: Update Variants and Images (this would require a more complex sync logic)
  // For now we assume they are handled by separate child components or we overwrite them
  // For MVP focus, we'll just revalidate

  revalidatePath("/products")
  revalidatePath(`/products/${id}`)
  return { success: true }
}
