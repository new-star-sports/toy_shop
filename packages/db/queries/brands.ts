import { createServiceClient } from "../client";
import type { Brand } from "../types";

/** Fetch all active brands */
export async function getBrands(): Promise<Brand[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("name_en");

  if (error) throw error;
  return (data ?? []) as Brand[];
}

/** Fetch a single brand by slug */
export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as Brand;
}

/** Fetch featured brands (for homepage brand strip) */
export async function getFeaturedBrands(): Promise<Brand[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Brand[];
}
