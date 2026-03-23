"use server"

import { getCouponByCode } from "@nss/db/queries"
import type { Coupon } from "@nss/db/types"

interface CartItem {
  productId: string
  categoryId?: string | null
  price: number
  quantity: number
}

interface ValidationResult {
  success: boolean
  message: string
  discountAmount?: number
  coupon?: Coupon
}

/**
 * Validate a coupon code against a cart
 */
export async function validateCouponAction(
  code: string, 
  subtotal: number, 
  items: CartItem[],
  userId?: string
): Promise<ValidationResult> {
  if (!code) return { success: false, message: "Code is required" }

  const coupon = await getCouponByCode(code)
  
  if (!coupon) {
    return { success: false, message: "Invalid or expired coupon code" }
  }

  // 1. Check active status and dates
  const now = new Date()
  if (!coupon.is_active) return { success: false, message: "This coupon is no longer active" }
  if (coupon.starts_at && new Date(coupon.starts_at) > now) return { success: false, message: "This coupon is not yet active" }
  if (coupon.expires_at && new Date(coupon.expires_at) < now) return { success: false, message: "This coupon has expired" }

  // 2. Check total usage limits
  if (coupon.max_uses_total && coupon.used_count >= coupon.max_uses_total) {
    return { success: false, message: "This coupon has reached its maximum usage limit" }
  }

  // 2b. Check per-user usage limits
  if (userId && coupon.max_uses_per_user) {
    const { createServiceClient } = await import("@nss/db")
    const supabase = createServiceClient()
    const { count, error } = await supabase
      .from("coupon_usage")
      .select("*", { count: 'exact', head: true })
      .eq("coupon_id", coupon.id)
      .eq("user_id", userId)

    if (!error && count !== null && count >= coupon.max_uses_per_user) {
      return { success: false, message: "You have already used this coupon the maximum number of times" }
    }
  }

  // 3. Check minimum order value
  if (coupon.min_order_value_kwd && subtotal < coupon.min_order_value_kwd) {
    return { 
      success: false, 
      message: `Minimum order value of ${coupon.min_order_value_kwd} KWD is required for this coupon` 
    }
  }

  // 4. Check Restrictions (Product/Category)
  let eligibleSubtotal = 0
  
  if (coupon.applies_to === "all") {
    eligibleSubtotal = subtotal
  } else if (coupon.applies_to === "product") {
    const restrictedIds = coupon.applies_to_ids || []
    const eligibleItems = items.filter(item => restrictedIds.includes(item.productId))
    if (eligibleItems.length === 0) {
      return { success: false, message: "This coupon is not applicable to the products in your cart" }
    }
    eligibleSubtotal = eligibleItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  } else if (coupon.applies_to === "category") {
    const restrictedIds = coupon.applies_to_ids || []
    const eligibleItems = items.filter(item => item.categoryId && restrictedIds.includes(item.categoryId))
    if (eligibleItems.length === 0) {
      return { success: false, message: "This coupon is not applicable to the categories in your cart" }
    }
    eligibleSubtotal = eligibleItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  }

  // 5. Calculate Discount
  let discount = 0
  if (coupon.coupon_type === "percentage") {
    discount = (eligibleSubtotal * coupon.value) / 100
  } else {
    // Fixed discount cannot exceed the eligible subtotal
    discount = Math.min(coupon.value, eligibleSubtotal)
  }

  return {
    success: true,
    message: "Coupon applied successfully!",
    discountAmount: Number(discount.toFixed(3)),
    coupon
  }
}
