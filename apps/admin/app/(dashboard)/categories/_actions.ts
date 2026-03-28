"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@nss/db/client"
import type { Category } from "@nss/db/types"

export async function upsertCategoryAction(data: Partial<Category>) {
  console.log('=== DATABASE DEBUG START ===');
  console.log('Environment variables:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
  
  const supabase = createServiceClient()
  console.log('Database client created successfully');
  
  const isNew = !data.id
  
  if (isNew) {
    const { error } = await (supabase.from("categories") as any)
      .insert([data as any])

    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await (supabase.from("categories") as any)
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
  const { data: products, error: checkError } = await (supabase
    .from("products") as any)
    .select("id")
    .eq("category_id", id)
    .limit(1)

  if (checkError) console.error("Check error:", checkError)

  if (products && products.length > 0) {
    return { success: false, error: "Cannot delete category with associated products." }
  }


  const { error } = await (supabase.from("categories") as any)
    .delete()
    .eq("id", id)


  if (error) return { success: false, error: error.message }

  revalidatePath("/categories")
  return { success: true }
}
