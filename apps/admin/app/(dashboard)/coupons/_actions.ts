"use server"

import { revalidatePath } from "next/cache"
import { upsertCoupon, deleteCoupon } from "@nss/db/queries"
import { couponSchema, type CouponFormValues } from "@nss/validators/coupon"

/**
 * Create or update a coupon
 */
export async function saveCoupon(data: CouponFormValues) {
  const validated = couponSchema.parse(data)
  
  try {
    const result = await upsertCoupon(validated as any)
    revalidatePath("/coupons")
    return { success: true, data: result }
  } catch (error: any) {
    console.error("Save Coupon Error:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete a coupon
 */
export async function removeCoupon(id: string) {
  try {
    await deleteCoupon(id)
    revalidatePath("/coupons")
    return { success: true }
  } catch (error: any) {
    console.error("Delete Coupon Error:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Toggle coupon active status
 */
export async function toggleCouponStatus(id: string, currentlyActive: boolean) {
  try {
    await upsertCoupon({ id, is_active: !currentlyActive })
    revalidatePath("/coupons")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Search products for coupon targeting
 */
export async function searchProducts(query: string) {
  const { createServiceClient } = await import("@nss/db")
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from("products")
    .select("id, name_en, sku, price_kwd")
    .or(`name_en.ilike.%${query}%,sku.ilike.%${query}%`)
    .limit(10)

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

/**
 * Search categories for coupon targeting
 */
export async function searchCategories(query: string) {
  const { createServiceClient } = await import("@nss/db")
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from("categories")
    .select("id, name_en, slug")
    .ilike("name_en", `%${query}%`)
    .limit(10)

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}
