"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@nss/db/client"
import type { Category } from "@nss/db/types"

export async function upsertCategoryAction(data: Partial<Category>) {
  const supabase = createServiceClient()
  
  const isNew = !data.id
  
  if (isNew) {
    const { error } = await supabase
      .from("categories")
      .insert([data as any])
    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await supabase
      .from("categories")
      .update(data as any)
      .eq("id", data.id)
    if (error) return { success: false, error: error.message }
  }

  revalidatePath("/categories")
  revalidatePath("/products") // Categories impact product forms
  return { success: true }
}

export async function deleteCategoryAction(id: string) {
  const supabase = createServiceClient()
  
  // Check for children or products first (or let DB handles it via FK)
  const { data: products } = await supabase
    .from("products")
    .select("id")
    .eq("category_id", id)
    .limit(1)

  if (products && products.length > 0) {
    return { success: false, error: "Cannot delete category with associated products." }
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/categories")
  return { success: true }
}
