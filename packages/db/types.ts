/**
 * NewStarSports — Database Types
 *
 * These types mirror the Supabase database schema.
 * In production, auto-generate from: npx supabase gen types typescript
 */

// ── Enums ────────────────────────────────────────────────────────────────────
export type StaffRole = 'super_admin' | 'manager' | 'editor' | 'fulfillment' | 'support';
export type ProductStatus = 'draft' | 'published' | 'archived';
export type OutOfStockBehaviour = 'hide' | 'show_out_of_stock' | 'continue_selling';
export type ReturnEligibility = 'eligible' | 'not_eligible';
export type VariantType = 'colour' | 'size' | 'pack_size' | 'age_group' | 'custom';
export type AddressType = 'home' | 'work' | 'other';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'refunded';
export type ReturnStatus = 'requested' | 'approved' | 'rejected' | 'received' | 'refunded';
export type BannerType = 'hero' | 'announcement' | 'editorial' | 'split_promo';
export type CouponType = 'percentage' | 'fixed_kwd';
export type LoyaltyAction = 'earned_purchase' | 'earned_review' | 'earned_birthday' | 'redeemed' | 'expired' | 'adjusted';

// ── Table Row Types ──────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  locale_preference: 'en' | 'ar';
  marketing_consent: boolean;
  created_at: string;
  updated_at: string;
}

export interface StaffMember {
  id: string;
  user_id: string;
  role: StaffRole;
  full_name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  description_en: string | null;
  description_ar: string | null;
  parent_id: string | null;
  image_url: string | null;
  is_homepage_pinned: boolean;
  homepage_order: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  logo_url: string | null;
  description_en: string | null;
  description_ar: string | null;
  is_featured: boolean;
  display_order: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  short_description_en: string;
  short_description_ar: string;
  description_en: string;
  description_ar: string;
  status: ProductStatus;
  price_kwd: number;
  compare_at_price_kwd: number | null;
  cost_price_kwd: number | null;
  tax_status: 'taxable' | 'tax_exempt';
  include_in_flash_sale: boolean;
  flash_sale_discount_percent: number | null;
  sku: string;
  barcode: string | null;
  track_inventory: boolean;
  stock_quantity: number;
  low_stock_threshold: number | null;
  out_of_stock_behaviour: OutOfStockBehaviour;
  allow_backorders: boolean;
  category_id: string | null;
  brand_id: string | null;
  is_new_arrival: boolean;
  is_best_seller_override: boolean;
  is_homepage_featured: boolean;
  min_age: number;
  max_age: number | null;
  safety_warnings_en: string;
  safety_warnings_ar: string;
  kucas_certificate: string;
  kucas_expiry: string | null;
  country_of_origin: string;
  materials_en: string;
  materials_ar: string;
  battery_required: boolean;
  battery_type: string | null;
  battery_included: boolean;
  manufacturer_name: string;
  weight_grams: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  seo_title_en: string | null;
  seo_title_ar: string | null;
  seo_description_en: string | null;
  seo_description_ar: string | null;
  hs_code_6: string;
  gcc_tariff_12: string;
  return_eligibility: ReturnEligibility;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_type: VariantType;
  name_en: string;
  name_ar: string;
  sku: string;
  barcode: string | null;
  price_override_kwd: number | null;
  compare_at_price_kwd: number | null;
  stock_quantity: number;
  weight_grams: number | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  variant_id: string | null;
  url: string;
  alt_text_en: string;
  alt_text_ar: string;
  display_order: number;
  created_at: string;
}

export interface Tag {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
}

export interface Governorate {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  is_active: boolean;
  created_at: string;
}

export interface Area {
  id: string;
  governorate_id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  is_active: boolean;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  governorate_id: string;
  area_id: string;
  block: string;
  street: string;
  building: string;
  floor: string | null;
  apartment: string | null;
  landmark: string | null;
  recipient_name: string;
  recipient_phone: string;
  address_type: AddressType;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  subtotal_kwd: number;
  shipping_kwd: number;
  discount_kwd: number;
  total_kwd: number;
  coupon_code: string | null;
  coupon_discount_kwd: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: Record<string, unknown>;
  gift_wrap: boolean;
  gift_message: string | null;
  shipping_method: string;
  tracking_number: string | null;
  courier_name: string | null;
  estimated_delivery: string | null;
  idempotency_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  name_en: string;
  name_ar: string;
  sku: string;
  hs_code: string | null;
  image_url: string | null;
  quantity: number;
  unit_price_kwd: number;
  line_total_kwd: number;
  created_at: string;
}

export interface OrderTimeline {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string | null;
  changed_by: string | null;
  created_at: string;
}

export interface StockReservation {
  id: string;
  variant_id: string;
  quantity: number;
  session_id: string;
  expires_at: string;
  created_at: string;
}

export interface Banner {
  id: string;
  banner_type: BannerType;
  title_en: string;
  title_ar: string;
  subtitle_en: string | null;
  subtitle_ar: string | null;
  image_desktop_url: string | null;
  image_mobile_url: string | null;
  cta_text_en: string | null;
  cta_text_ar: string | null;
  cta_link: string | null;
  cta2_text_en: string | null;
  cta2_text_ar: string | null;
  cta2_link: string | null;
  bg_color: string | null;
  text_color: string | null;
  countdown_end: string | null;
  display_order: number;
  is_active: boolean;
  schedule_start: string | null;
  schedule_end: string | null;
  slot: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_item_id: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  is_verified: boolean;
  is_approved: boolean;
  is_pinned_home: boolean;
  admin_reply: string | null;
  admin_reply_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
  updated_by: string | null;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  coupon_type: CouponType;
  value: number;
  min_order_value_kwd: number | null;
  max_uses_total: number | null;
  max_uses_per_user: number | null;
  used_count: number;
  applies_to: string;
  applies_to_ids: string[] | null;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Supabase Database type (simplified for query typing) ─────────────────────
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      staff_members: { Row: StaffMember; Insert: Partial<StaffMember>; Update: Partial<StaffMember> };
      categories: { Row: Category; Insert: Partial<Category>; Update: Partial<Category> };
      brands: { Row: Brand; Insert: Partial<Brand>; Update: Partial<Brand> };
      products: { Row: Product; Insert: Partial<Product>; Update: Partial<Product> };
      product_variants: { Row: ProductVariant; Insert: Partial<ProductVariant>; Update: Partial<ProductVariant> };
      product_images: { Row: ProductImage; Insert: Partial<ProductImage>; Update: Partial<ProductImage> };
      tags: { Row: Tag; Insert: Partial<Tag>; Update: Partial<Tag> };
      governorates: { Row: Governorate; Insert: Partial<Governorate>; Update: Partial<Governorate> };
      areas: { Row: Area; Insert: Partial<Area>; Update: Partial<Area> };
      addresses: { Row: Address; Insert: Partial<Address>; Update: Partial<Address> };
      orders: { Row: Order; Insert: Partial<Order>; Update: Partial<Order> };
      order_items: { Row: OrderItem; Insert: Partial<OrderItem>; Update: Partial<OrderItem> };
      order_timeline: { Row: OrderTimeline; Insert: Partial<OrderTimeline>; Update: Partial<OrderTimeline> };
      stock_reservations: { Row: StockReservation; Insert: Partial<StockReservation>; Update: Partial<StockReservation> };
      banners: { Row: Banner; Insert: Partial<Banner>; Update: Partial<Banner> };
      reviews: { Row: Review; Insert: Partial<Review>; Update: Partial<Review> };
      settings: { Row: Setting; Insert: Partial<Setting>; Update: Partial<Setting> };
      wishlist_items: { Row: WishlistItem; Insert: Partial<WishlistItem>; Update: Partial<WishlistItem> };
      coupons: { Row: Coupon; Insert: Partial<Coupon>; Update: Partial<Coupon> };
    };
    Functions: {
      decrement_stock: {
        Args: {
          p_variant_id: string;
          p_quantity: number;
        };
        Returns: boolean;
      };
      generate_order_number: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: {
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      address_type: AddressType;
    };
  };
}
