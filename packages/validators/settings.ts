import { z } from "zod";

/** Store information settings */
export const storeInfoSchema = z.object({
  store_name_en: z.string().min(1),
  store_name_ar: z.string().min(1),
  store_tagline_en: z.string().optional(),
  store_tagline_ar: z.string().optional(),
  contact_email: z.string().email(),
  contact_phone: z.string(),
  whatsapp_number: z.string().regex(/^\+965\d{8}$/),
  physical_address_en: z.string().optional(),
  physical_address_ar: z.string().optional(),
  working_hours_en: z.string().optional(),
  working_hours_ar: z.string().optional(),
  cr_number: z.string().min(1),
});

/** Announcement bar settings */
export const announcementBarSchema = z.object({
  enabled: z.boolean(),
  bg_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  text_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  rotation_speed: z.number().int().min(1).max(30),
  dismissible: z.boolean(),
  messages: z.array(z.object({
    text_en: z.string().min(1),
    text_ar: z.string().min(1),
    link: z.string().url().optional(),
    enabled: z.boolean(),
    schedule_start: z.string().datetime().optional(),
    schedule_end: z.string().datetime().optional(),
  })).max(3),
});

/** Trust bar settings */
export const trustBarSchema = z.object({
  enabled: z.boolean(),
  free_delivery_threshold_kwd: z.number().positive().multipleOf(0.001),
  return_policy_days: z.number().int().positive(),
  items: z.array(z.object({
    icon: z.string(),
    text_en: z.string(),
    text_ar: z.string(),
    link: z.string().url().optional(),
    enabled: z.boolean(),
  })).max(6),
});

/** Shipping zone settings */
export const shippingZoneSchema = z.object({
  governorate_id: z.string().uuid(),
  enabled: z.boolean(),
  standard_rate_kwd: z.number().min(0).multipleOf(0.001),
  express_rate_kwd: z.number().min(0).multipleOf(0.001),
  sameday_rate_kwd: z.number().min(0).multipleOf(0.001).optional(),
  standard_days: z.number().int().positive(),
  express_days: z.number().int().positive(),
  sameday_cutoff_time: z.string().optional(),
});

/** Loyalty programme settings */
export const loyaltySchema = z.object({
  enabled: z.boolean(),
  points_per_100_fils: z.number().int().positive(),
  kwd_per_redemption_point: z.number().positive().multipleOf(0.001),
  min_points_to_redeem: z.number().int().positive(),
  points_expiry_months: z.number().int().min(0),
  birthday_reward_enabled: z.boolean(),
  birthday_reward_kwd: z.number().min(0).multipleOf(0.001).optional(),
});

export type StoreInfo = z.infer<typeof storeInfoSchema>;
export type AnnouncementBar = z.infer<typeof announcementBarSchema>;
export type TrustBar = z.infer<typeof trustBarSchema>;
export type ShippingZone = z.infer<typeof shippingZoneSchema>;
export type Loyalty = z.infer<typeof loyaltySchema>;
