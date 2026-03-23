import { createServiceClient } from "../client";
import type { Banner } from "../types";

/** Fetch active hero banners (ordered) */
export async function getHeroBanners(): Promise<Banner[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("banner_type", "hero")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(5);

  if (error) throw error;
  return (data ?? []) as Banner[];
}

/** Fetch active announcement bar messages */
export async function getAnnouncementBar(): Promise<Banner | null> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("banner_type", "announcement")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) return null;
  return data as Banner | null;
}

/** Fetch editorial mid-page banner */
export async function getEditorialBanner(): Promise<Banner | null> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("banner_type", "editorial")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) return null;
  return data as Banner | null;
}

/** Fetch split promo banners (left + right) */
export async function getPromoBanners(): Promise<Banner[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("banner_type", "split_promo")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(2);

  if (error) throw error;
  return (data ?? []) as Banner[];
}
/** Fetch all banners for admin with optional filtering */
export async function getAdminBanners({
  type,
  isActive,
}: {
  type?: string;
  isActive?: boolean;
} = {}): Promise<Banner[]> {
  const supabase = createServiceClient();

  let query = supabase.from("banners").select("*");

  if (type && type !== "all") {
    query = query.eq("banner_type", type);
  }

  if (isActive !== undefined) {
    query = query.eq("is_active", isActive);
  }

  const { data, error } = await query.order("display_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Banner[];
}
/** Fetch a single banner by ID for admin */
export async function getAdminBannerById(id: string): Promise<Banner | null> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Banner | null;
}
