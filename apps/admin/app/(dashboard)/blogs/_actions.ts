"use strict"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@nss/db"
import { Blog } from "@nss/db/queries"

export async function saveBlogAction(data: Partial<Blog>) {
  const supabase = createServiceClient()

  const blogData = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  // Remove relation data if present
  delete (blogData as any).category

  let error
  if (blogData.id) {
    const { error: updateError } = await (supabase.from("blogs") as any)
      .update(blogData as any)
      .eq("id", blogData.id)
    error = updateError
  } else {
    const { error: insertError } = await (supabase.from("blogs") as any)
      .insert(blogData as any)
    error = insertError
  }

  if (error) {
    console.error("Error saving blog:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/(dashboard)/blogs", "page")
  revalidatePath("/[locale]/blog", "page")
  return { success: true }
}

export async function deleteBlogAction(id: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from("blogs").delete().eq("id", id)

  if (error) {
    console.error("Error deleting blog:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/(dashboard)/blogs", "page")
  return { success: true }
}

export async function saveBlogCategoryAction(data: { name_en: string, name_ar: string, slug: string, id?: string }) {
  const supabase = createServiceClient()
  
  let error
  if (data.id) {
    const { error: updateError } = await (supabase.from("blog_categories") as any)
      .update(data as any)
      .eq("id", data.id)
    error = updateError
  } else {
    const { error: insertError } = await (supabase.from("blog_categories") as any)
      .insert(data as any)
    error = insertError
  }

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
