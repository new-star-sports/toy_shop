import { createServiceClient } from "../client";
import type { Review } from "../types";

/**
 * Get all reviews for admin moderation
 */
export async function getAdminReviews() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      products (
        id,
        name_en,
        name_ar,
        slug
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as (Review & { products: { id: string, name_en: string, name_ar: string, slug: string } })[];
}

/**
 * Update review approval status
 */
export async function updateReviewStatus(id: string, isApproved: boolean) {
  const supabase = createServiceClient();
  // @ts-ignore - Supabase update type mismatch in monorepo
  const { error } = (await supabase.from("reviews").update({ is_approved: isApproved, updated_at: new Date().toISOString() }).eq("id", id)) as any;

  if (error) throw error;
  return true;
}

/**
 * Toggle review home page pin
 */
export async function toggleReviewPin(id: string, isPinned: boolean) {
  const supabase = createServiceClient();
  // @ts-ignore - Supabase update type mismatch in monorepo
  const { error } = (await supabase.from("reviews").update({ is_pinned_home: isPinned, updated_at: new Date().toISOString() }).eq("id", id)) as any;

  if (error) throw error;
  return true;
}

/**
 * Save official admin reply to a review
 */
export async function saveReviewReply(id: string, reply: string) {
  const supabase = createServiceClient();
  // @ts-ignore - Supabase update type mismatch in monorepo
  const { error } = (await supabase.from("reviews").update({ admin_reply: reply, admin_reply_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", id)) as any;

  if (error) throw error;
  return true;
}

/**
 * Delete a review
 */
export async function deleteReview(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
