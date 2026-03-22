import { createServiceClient } from "../client";
import type { Product, ProductImage, ProductVariant } from "../types";

/** Product with its images, variants, category, and brand names */
export interface ProductWithRelations extends Product {
  images: ProductImage[];
  variants: ProductVariant[];
  category: { name_en: string; name_ar: string; slug: string } | null;
  brand: { name_en: string; name_ar: string; slug: string; logo_url: string | null } | null;
  avg_rating: number | null;
  review_count: number;
}

/** Product card data (lightweight, for listings) */
export interface ProductCard {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  short_description_en: string;
  short_description_ar: string;
  price_kwd: number;
  compare_at_price_kwd: number | null;
  is_new_arrival: boolean;
  include_in_flash_sale: boolean;
  flash_sale_discount_percent: number | null;
  min_age: number;
  primary_image_url: string | null;
  brand_name_en: string | null;
  brand_name_ar: string | null;
  category_slug: string | null;
  avg_rating: number | null;
  review_count: number;
  stock_quantity: number;
}

/** Fetch paginated products with filters */
export async function getProducts(options?: {
  page?: number;
  perPage?: number;
  categorySlug?: string;
  brandSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  minAge?: number;
  maxAge?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'best_sellers';
  search?: string;
}): Promise<{ data: ProductCard[]; count: number }> {
  const supabase = createServiceClient();
  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("products")
    .select(`
      id, name_en, name_ar, slug, short_description_en, short_description_ar,
      price_kwd, compare_at_price_kwd, is_new_arrival, include_in_flash_sale,
      flash_sale_discount_percent, min_age, stock_quantity,
      brands ( name_en, name_ar ),
      categories ( slug ),
      product_images ( url ),
      reviews ( rating )
    `, { count: "exact" })
    .eq("status", "published")
    .range(from, to);

  // Filters
  if (options?.categorySlug) {
    query = query.eq("categories.slug", options.categorySlug);
  }
  if (options?.brandSlug) {
    query = query.eq("brands.slug", options.brandSlug);
  }
  if (options?.minPrice !== undefined) {
    query = query.gte("price_kwd", options.minPrice);
  }
  if (options?.maxPrice !== undefined) {
    query = query.lte("price_kwd", options.maxPrice);
  }
  if (options?.minAge !== undefined) {
    query = query.gte("min_age", options.minAge);
  }

  // Sort
  switch (options?.sort) {
    case "price_asc":
      query = query.order("price_kwd", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price_kwd", { ascending: false });
      break;
    case "name_asc":
      query = query.order("name_en", { ascending: true });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data, count, error } = await query;
  if (error) throw error;

  const products: ProductCard[] = (data ?? []).map((p: Record<string, unknown>) => {
    const brand = p.brands as { name_en: string; name_ar: string } | null;
    const category = p.categories as { slug: string } | null;
    const images = (p.product_images as { url: string }[]) ?? [];
    const reviews = (p.reviews as { rating: number }[]) ?? [];
    const avgRating = reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : null;

    return {
      id: p.id as string,
      name_en: p.name_en as string,
      name_ar: p.name_ar as string,
      slug: p.slug as string,
      short_description_en: p.short_description_en as string,
      short_description_ar: p.short_description_ar as string,
      price_kwd: p.price_kwd as number,
      compare_at_price_kwd: p.compare_at_price_kwd as number | null,
      is_new_arrival: p.is_new_arrival as boolean,
      include_in_flash_sale: p.include_in_flash_sale as boolean,
      flash_sale_discount_percent: p.flash_sale_discount_percent as number | null,
      min_age: p.min_age as number,
      primary_image_url: images[0]?.url ?? null,
      brand_name_en: brand?.name_en ?? null,
      brand_name_ar: brand?.name_ar ?? null,
      category_slug: category?.slug ?? null,
      avg_rating: avgRating,
      review_count: reviews.length,
      stock_quantity: p.stock_quantity as number,
    };
  });

  return { data: products, count: count ?? 0 };
}

/** Fetch a single product by slug (PDP) */
export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images ( * ),
      product_variants ( * ),
      brands ( name_en, name_ar, slug, logo_url ),
      categories ( name_en, name_ar, slug ),
      reviews ( rating )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return null;

  const reviews = ((data as Record<string, unknown>).reviews as { rating: number }[]) ?? [];
  const avgRating = reviews.length > 0
    ? Math.round((reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : null;

  return {
    ...(data as unknown as Product),
    images: (((data as Record<string, unknown>).product_images as ProductImage[]) ?? []).sort((a, b) => a.display_order - b.display_order),
    variants: (((data as Record<string, unknown>).product_variants as ProductVariant[]) ?? []).sort((a, b) => a.display_order - b.display_order),
    category: (data as Record<string, unknown>).categories as ProductWithRelations["category"],
    brand: (data as Record<string, unknown>).brands as ProductWithRelations["brand"],
    avg_rating: avgRating,
    review_count: reviews.length,
  };
}

/** Fetch new arrival products (flagged or created within 30 days) */
export async function getNewArrivals(limit = 10): Promise<ProductCard[]> {
  const { data } = await getProducts({
    perPage: limit,
    sort: "newest",
  });
  // TODO: Filter by is_new_arrival flag after Supabase supports OR in nested queries
  return data.filter((p) => p.is_new_arrival).slice(0, limit);
}

/** Fetch products for flash sale */
export async function getFlashSaleProducts(limit = 10): Promise<ProductCard[]> {
  const { data } = await getProducts({ perPage: limit });
  return data.filter((p) => p.include_in_flash_sale).slice(0, limit);
}

/** Fetch homepage featured products */
export async function getHomepageFeatured(limit = 8): Promise<ProductCard[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name_en, name_ar, slug, short_description_en, short_description_ar,
      price_kwd, compare_at_price_kwd, is_new_arrival, include_in_flash_sale,
      flash_sale_discount_percent, min_age, stock_quantity,
      brands ( name_en, name_ar ),
      product_images ( url ),
      reviews ( rating )
    `)
    .eq("status", "published")
    .eq("is_homepage_featured", true)
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((p: Record<string, unknown>) => {
    const brand = p.brands as { name_en: string; name_ar: string } | null;
    const images = (p.product_images as { url: string }[]) ?? [];
    const reviews = (p.reviews as { rating: number }[]) ?? [];
    const avgRating = reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : null;

    return {
      id: p.id as string,
      name_en: p.name_en as string,
      name_ar: p.name_ar as string,
      slug: p.slug as string,
      short_description_en: p.short_description_en as string,
      short_description_ar: p.short_description_ar as string,
      price_kwd: p.price_kwd as number,
      compare_at_price_kwd: p.compare_at_price_kwd as number | null,
      is_new_arrival: p.is_new_arrival as boolean,
      include_in_flash_sale: p.include_in_flash_sale as boolean,
      flash_sale_discount_percent: p.flash_sale_discount_percent as number | null,
      min_age: p.min_age as number,
      primary_image_url: images[0]?.url ?? null,
      brand_name_en: brand?.name_en ?? null,
      brand_name_ar: brand?.name_ar ?? null,
      category_slug: null,
      avg_rating: avgRating,
      review_count: reviews.length,
      stock_quantity: p.stock_quantity as number,
    };
  });
}
