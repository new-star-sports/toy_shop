import { createServiceClient } from "../client";
import type { Coupon } from "../types";

/**
 * Get all coupons for admin
 */
export async function getAdminCoupons() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Coupon[];
}

/**
 * Get coupon by ID for admin
 */
export async function getAdminCouponById(id: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Coupon;
}

/**
 * Get coupon by code (for storefront)
 */
export async function getCouponByCode(code: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as Coupon;
}

/**
 * Upsert coupon
 */
export async function upsertCoupon(coupon: Partial<Coupon>) {
  const supabase = createServiceClient();
  const { data, error } = await (supabase.from("coupons") as any)
    .upsert({
      ...coupon,
      code: coupon.code?.toUpperCase(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as Coupon;
}

/**
 * Delete coupon
 */
export async function deleteCoupon(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("coupons")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}

/**
 * Increment coupon usage count
 */
export async function incrementCouponUsage(id: string) {
  const supabase = createServiceClient();
  const { error } = await (supabase.rpc as any)("increment_coupon_usage", { p_coupon_id: id });
  if (error) throw error;
}
