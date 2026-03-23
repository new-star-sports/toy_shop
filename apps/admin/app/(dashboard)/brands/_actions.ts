"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@nss/db/client"
import type { Brand } from "@nss/db/types"

export async function upsertBrandAction(data: Partial<Brand>) {
  const supabase = createServiceClient()
  
  const isNew = !data.id
  
  if (isNew) {
    const { error } = await supabase
      .from("brands")
      .insert([data as any])
    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await supabase
      .from("brands")
      .update(data as any)
      .eq("id", data.id)
    if (error) return { success: false, error: error.message }
  }

  revalidatePath("/brands")
  revalidatePath("/products") // Brands impact product forms
  return { success: true }
}

export async function deleteBrandAction(id: string) {
  const supabase = createServiceClient()
  
  // Check for products first
  const { data: products } = await supabase
    .from("products")
    .select("id")
    .eq("brand_id", id)
    .limit(1)

  if (products && products.length > 0) {
    return { success: false, error: "Cannot delete brand with associated products." }
  }

  const { error } = await supabase
    .from("brands")
    .delete()
    .eq("id", id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/brands")
  return { success: true }
}
