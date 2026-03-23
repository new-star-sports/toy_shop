"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@nss/db/client"
import { updateSetting, type FlashSaleSettings } from "@nss/db/queries"

/**
 * Update global flash sale settings
 */
export async function updateFlashSaleSettings(data: FlashSaleSettings) {
  const result = await updateSetting("flash_sale", data)
  if (result.success) {
    revalidatePath("/")
    revalidatePath("/(dashboard)/marketing/flash-sale")
  }
  return result
}

/**
 * Toggle product flash sale participation
 */
export async function toggleProductFlashSale(productId: string, include: boolean, discount?: number) {
  const supabase = createServiceClient()
  const { error } = await (supabase
    .from("products" as any)
    .update({ 
      include_in_flash_sale: include,
      flash_sale_discount_percent: include ? discount : null
    } as any) as any)
    .eq("id", productId)

  if (error) {
    console.error("Error toggling product flash sale:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/(dashboard)/marketing/flash-sale")
  return { success: true }
}

/**
 * Bulk add products to flash sale
 */
export async function addProductsToFlashSale(productIds: string[], discount: number) {
  const supabase = createServiceClient()
  const { error } = await (supabase
    .from("products" as any)
    .update({ 
      include_in_flash_sale: true,
      flash_sale_discount_percent: discount
    } as any) as any)
    .in("id", productIds)

  if (error) {
    console.error("Error bulk adding products to flash sale:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/(dashboard)/marketing/flash-sale")
  return { success: true }
}

/**
 * Get products currently in flash sale
 */
export async function getFlashSaleProducts() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from("products")
    .select("id, name_en, name_ar, sku, price_kwd, flash_sale_discount_percent")
    .eq("include_in_flash_sale", true)

  if (error) {
    console.error("Error fetching flash sale products:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

/**
 * Search products for flash sale addition
 */
export async function searchProducts(query: string) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from("products")
    .select("id, name_en, name_ar, sku, price_kwd")
    .or(`name_en.ilike.%${query}%,name_ar.ilike.%${query}%,sku.ilike.%${query}%`)
    .eq("status", "published")
    .limit(10)

  if (error) {
    console.error("Error searching products:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
