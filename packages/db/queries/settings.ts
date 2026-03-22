import { createServiceClient } from "../client";
import type { Setting } from "../types";

// ── Typed setting keys with their value shapes ───────────────────────────────
export interface StoreInfoSettings {
  store_name_en: string;
  store_name_ar: string;
  tagline_en: string;
  tagline_ar: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  cr_number: string;
}

export interface TrustBarSettings {
  enabled: boolean;
  free_delivery_threshold_kwd: number;
  return_policy_days: number;
  items: {
    icon: string;
    text_en: string;
    text_ar: string;
    enabled: boolean;
  }[];
}

export interface AnnouncementBarSettings {
  enabled: boolean;
  bg_color: string;
  text_color: string;
  rotation_speed: number;
  dismissible: boolean;
  messages: {
    text_en: string;
    text_ar: string;
    enabled: boolean;
  }[];
}

export interface ShippingSettings {
  standard_rate_kwd: number;
  express_rate_kwd: number;
  sameday_rate_kwd: number;
  standard_days: number;
  express_days: number;
  sameday_cutoff: string;
  free_delivery_threshold_kwd: number;
}

export interface LoyaltySettings {
  enabled: boolean;
  points_per_kwd: number;
  kwd_per_100_points: number;
  min_points_to_redeem: number;
  points_expiry_months: number;
  birthday_reward_enabled: boolean;
  birthday_reward_kwd: number;
}

export interface PaymentMethodSettings {
  knet: boolean;
  visa_mc: boolean;
  apple_pay: boolean;
  cod: boolean;
  cod_extra_kwd: number;
}

// ── Setting key → type mapping ───────────────────────────────────────────────
interface SettingKeyMap {
  store_info: StoreInfoSettings;
  trust_bar: TrustBarSettings;
  announcement_bar: AnnouncementBarSettings;
  shipping: ShippingSettings;
  loyalty: LoyaltySettings;
  payment_methods: PaymentMethodSettings;
}

/** Fetch a single typed setting by key */
export async function getSetting<K extends keyof SettingKeyMap>(
  key: K
): Promise<SettingKeyMap[K] | null> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", key)
    .single();

  if (error || !data) return null;
  return (data as Setting).value as unknown as SettingKeyMap[K];
}

/** Fetch multiple settings at once */
export async function getSettings<K extends keyof SettingKeyMap>(
  keys: K[]
): Promise<Partial<Record<K, SettingKeyMap[K]>>> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", keys);

  if (error) throw error;

  const result: Partial<Record<K, SettingKeyMap[K]>> = {};
  for (const row of (data ?? []) as Setting[]) {
    result[row.key as K] = row.value as unknown as SettingKeyMap[K];
  }
  return result;
}
