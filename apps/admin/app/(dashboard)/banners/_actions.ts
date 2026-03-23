"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@nss/db/client"
import { bannerSchema, type Banner } from "@nss/validators/banner"

/**
 * Fetch all banners
 */
export async function getBanners() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching banners:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

/**
 * Create a new banner
 */
export async function createBanner(data: Banner) {
  const supabase = createServiceClient()
  const { data: newBanner, error } = await (supabase.from("banners") as any)
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error("Error creating banner:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/banners")
  return { success: true, data: newBanner }
}

/**
 * Update an existing banner
 */
export async function updateBanner(id: string, data: Partial<Banner>) {
  const supabase = createServiceClient()
  const { error } = await (supabase.from("banners") as any)
    .update(data)
    .eq("id", id)

  if (error) {
    console.error("Error updating banner:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/banners")
  return { success: true }
}

/**
 * Delete a banner
 */
export async function deleteBanner(id: string) {
  const supabase = createServiceClient()
  const { error } = await (supabase.from("banners") as any)
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting banner:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/banners")
  return { success: true }
}

/**
 * Toggle banner active status
 */
export async function toggleBannerActive(id: string, isActive: boolean) {
  const supabase = createServiceClient()
  const { error } = await (supabase.from("banners") as any)
    .update({ is_active: isActive })
    .eq("id", id)

  if (error) {
    console.error("Error toggling banner status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/banners")
  return { success: true }
}
