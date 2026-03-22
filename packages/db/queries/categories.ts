import { createServiceClient } from "../client";
import type { Category } from "../types";

/** Category with product count and children */
export interface CategoryWithChildren extends Category {
  children: Category[];
  product_count: number;
}

/** Fetch all active categories */
export async function getCategories(): Promise<Category[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name_en");

  if (error) throw error;
  return (data ?? []) as Category[];
}

/** Fetch a single category by slug */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as Category;
}

/** Build the category tree (parent → children) */
export async function getCategoryTree(): Promise<CategoryWithChildren[]> {
  const categories = await getCategories();

  const roots = categories.filter((c) => !c.parent_id);
  return roots.map((root) => ({
    ...root,
    children: categories.filter((c) => c.parent_id === root.id),
    product_count: 0, // TODO: Count from products table
  }));
}

/** Fetch homepage pinned categories (ordered) */
export async function getHomepagePinnedCategories(): Promise<Category[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .eq("is_homepage_pinned", true)
    .order("homepage_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Category[];
}
