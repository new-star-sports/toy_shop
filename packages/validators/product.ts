import { z } from "zod";

/**
 * Product validation schema — covers all 10 tabs from the master document.
 * Used in admin product create/edit forms (React Hook Form + Zod).
 */

// ── Tab 1: Basic Information ──
export const productBasicSchema = z.object({
  name_en: z.string().min(1).max(200),
  name_ar: z.string().min(1).max(200),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  short_description_en: z.string().min(1).max(160),
  short_description_ar: z.string().min(1).max(160),
  description_en: z.string().min(1),
  description_ar: z.string().min(1),
  status: z.enum(["draft", "published", "archived"]),
});

// ── Tab 3: Pricing ──
export const productPricingSchema = z.object({
  price_kwd: z.number().positive().multipleOf(0.001),
  compare_at_price_kwd: z.number().positive().multipleOf(0.001).nullable().optional(),
  cost_price_kwd: z.number().positive().multipleOf(0.001).nullable().optional(),
  tax_status: z.enum(["taxable", "tax_exempt"]),
  include_in_flash_sale: z.boolean().optional(),
  flash_sale_discount_percent: z.number().int().min(1).max(99).nullable().optional(),
});

// ── Tab 4: Inventory ──
export const productInventorySchema = z.object({
  sku: z.string().min(1),
  barcode: z.string().optional(),
  track_inventory: z.boolean(),
  stock_quantity: z.number().int().min(0).optional(),
  low_stock_threshold: z.number().int().min(1).optional(),
  out_of_stock_behaviour: z.enum(["hide", "show_out_of_stock", "continue_selling"]),
  allow_backorders: z.boolean().optional(),
});

// ── Tab 5: Variants ──
export const productVariantSchema = z.object({
  variant_types: z.array(z.enum(["colour", "size", "pack_size", "age_group", "custom"])).optional(),
  options: z.array(z.object({
    name_en: z.string().min(1),
    name_ar: z.string().min(1),
    price_override_kwd: z.number().positive().multipleOf(0.001).nullable().optional(),
    compare_at_price_kwd: z.number().positive().multipleOf(0.001).nullable().optional(),
    sku: z.string().min(1),
    barcode: z.string().optional(),
    stock_quantity: z.number().int().min(0),
    weight_grams: z.number().int().positive().optional(),
  })).optional(),
});

// ── Tab 6: Organisation ──
export const productOrganisationSchema = z.object({
  category_ids: z.array(z.string().uuid()).min(1),
  brand_id: z.string().uuid(),
  tags: z.array(z.string()).optional(),
  is_new_arrival: z.boolean().optional(),
  is_best_seller_override: z.boolean().optional(),
  is_homepage_featured: z.boolean().optional(),
  related_product_ids: z.array(z.string().uuid()).max(8).optional(),
});

// ── Tab 7: Safety & Legal (Kuwait mandatory) ──
export const productSafetySchema = z.object({
  min_age: z.number().int().min(0),
  max_age: z.number().int().min(0).optional(),
  safety_warnings_en: z.string().min(1),
  safety_warnings_ar: z.string().min(1),
  kucas_certificate: z.string().min(1),
  kucas_expiry: z.string().datetime(),
  country_of_origin: z.string().min(1),
  materials_en: z.string().min(1),
  materials_ar: z.string().min(1),
  battery_required: z.boolean().optional(),
  battery_type: z.string().optional(),
  battery_included: z.boolean().optional(),
  manufacturer_name: z.string().min(1),
  manufacturer_address: z.string().optional(),
  warranty_months: z.number().int().min(0).optional(),
  return_eligibility: z.enum(["eligible", "not_eligible"]),
  return_exclusion_reason_en: z.string().optional(),
  return_exclusion_reason_ar: z.string().optional(),
});

// ── Tab 8: Shipping ──
export const productShippingSchema = z.object({
  weight_grams: z.number().int().positive(),
  length_cm: z.number().positive(),
  width_cm: z.number().positive(),
  height_cm: z.number().positive(),
  requires_special_handling: z.boolean().optional(),
  delivery_restriction_zones: z.array(z.string().uuid()).optional(),
});

// ── Tab 9: SEO ──
export const productSeoSchema = z.object({
  seo_title_en: z.string().min(1).max(70),
  seo_title_ar: z.string().min(1).max(70),
  seo_description_en: z.string().min(1).max(160),
  seo_description_ar: z.string().min(1).max(160),
  canonical_url: z.string().url().optional(),
});

// ── Tab 10: Customs / HS Codes ──
export const productCustomsSchema = z.object({
  hs_code_6: z.string().length(6).regex(/^\d{6}$/),
  gcc_tariff_12: z.string().length(12).regex(/^\d{12}$/),
  customs_description_en: z.string().optional(),
  import_licence_required: z.boolean().optional(),
  import_licence_number: z.string().optional(),
});

// ── Full product schema (all tabs combined) ──
export const productSchema = productBasicSchema
  .merge(productPricingSchema)
  .merge(productInventorySchema)
  .merge(productOrganisationSchema)
  .merge(productSafetySchema)
  .merge(productShippingSchema)
  .merge(productSeoSchema)
  .merge(productCustomsSchema);

export type Product = z.infer<typeof productSchema>;
export type ProductBasic = z.infer<typeof productBasicSchema>;
export type ProductPricing = z.infer<typeof productPricingSchema>;
export type ProductInventory = z.infer<typeof productInventorySchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type ProductOrganisation = z.infer<typeof productOrganisationSchema>;
export type ProductSafety = z.infer<typeof productSafetySchema>;
export type ProductShipping = z.infer<typeof productShippingSchema>;
export type ProductSeo = z.infer<typeof productSeoSchema>;
export type ProductCustoms = z.infer<typeof productCustomsSchema>;
