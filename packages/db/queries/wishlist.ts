import { createServiceClient } from "../client";
import type { ProductCard } from "./products";

/** Fetch products in a user's wishlist formatted as ProductCards */
export async function getWishlistProducts(userId: string): Promise<ProductCard[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("wishlist_items")
    .select(`
      product:products (
        id, name_en, name_ar, slug, short_description_en, short_description_ar,
        price_kwd, compare_at_price_kwd, is_new_arrival, include_in_flash_sale,
        flash_sale_discount_percent, min_age, stock_quantity,
        brands ( name_en, name_ar ),
        categories ( slug ),
        product_images ( url ),
        reviews ( rating )
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  return (data ?? []).map((item: any) => {
    const p = item.product;
    if (!p) return null;

    const brand = p.brands as { name_en: string; name_ar: string } | null;
    const category = p.categories as { slug: string } | null;
    const images = (p.product_images as { url: string }[]) ?? [];
    const reviews = (p.reviews as { rating: number }[]) ?? [];
    const avgRating = reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : null;

    return {
      id: p.id,
      name_en: p.name_en,
      name_ar: p.name_ar,
      slug: p.slug,
      short_description_en: p.short_description_en,
      short_description_ar: p.short_description_ar,
      price_kwd: p.price_kwd,
      compare_at_price_kwd: p.compare_at_price_kwd,
      is_new_arrival: p.is_new_arrival,
      include_in_flash_sale: p.include_in_flash_sale,
      flash_sale_discount_percent: p.flash_sale_discount_percent,
      min_age: p.min_age,
      primary_image_url: images[0]?.url ?? null,
      brand_name_en: brand?.name_en ?? null,
      brand_name_ar: brand?.name_ar ?? null,
      category_slug: category?.slug ?? null,
      avg_rating: avgRating,
      review_count: reviews.length,
      stock_quantity: p.stock_quantity,
    } as ProductCard;
  }).filter(Boolean) as ProductCard[];
}

/** Check if a product is in user's wishlist */
export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) return false;
  return !!data;
}

/** Add product to wishlist */
export async function addToWishlist(userId: string, productId: string): Promise<void> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("wishlist_items")
    .upsert({ user_id: userId, product_id: productId } as any, { onConflict: "user_id,product_id" });

  if (error) throw error;
}

/** Remove product from wishlist */
export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) throw error;
}
