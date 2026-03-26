import { createServiceClient } from "../client"

export interface BlogCategory {
  id: string
  name_en: string
  name_ar: string
  slug: string
}

export interface Blog {
  id: string
  slug: string
  title_en: string
  title_ar: string
  excerpt_en?: string
  excerpt_ar?: string
  content_en: string
  content_ar: string
  image_url?: string
  category_id?: string
  author_id?: string
  is_published: boolean
  published_at?: string
  display_order: number
  created_at: string
  updated_at: string
  category?: BlogCategory
}

export async function getBlogs(options?: { publishedOnly?: boolean }) {
  const supabase = createServiceClient()
  let query = supabase
    .from("blogs")
    .select("*, category:blog_categories(*)")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })

  if (options?.publishedOnly) {
    query = query.eq("is_published", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching blogs:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    })
    return []
  }

  return data as Blog[]
}

export async function getBlogBySlug(slug: string) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from("blogs")
    .select("*, category:blog_categories(*)")
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching blog by slug:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    })
    return null
  }

  return data as Blog
}

export async function getBlogById(id: string) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from("blogs")
    .select("*, category:blog_categories(*)")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching blog by id:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    })
    return null
  }

  return data as Blog
}

export async function getBlogCategories() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .order("name_en")

  if (error) {
    console.error("Error fetching blog categories:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    })
    return []
  }

  return data as BlogCategory[]
}
