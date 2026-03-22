import { z } from "zod";

/**
 * Kuwait address validation schema.
 * Kuwait has no postcode system — addresses use:
 * Governorate → Area → Block → Street → Building → Floor/Apartment
 */

export const KUWAIT_GOVERNORATES = [
  "capital",
  "hawalli",
  "farwaniya",
  "ahmadi",
  "jahra",
  "mubarak_al_kabeer",
] as const;

export const ADDRESS_TYPES = ["home", "work", "other"] as const;

/** Kuwait phone: +965 followed by 8 digits */
const kuwaitPhoneRegex = /^\+965\d{8}$/;

export const addressSchema = z.object({
  governorate: z.enum(KUWAIT_GOVERNORATES),
  area_id: z.string().uuid(),
  block: z.string().min(1).regex(/^\d+$/, "Block must be numeric"),
  street: z.string().min(1).max(200),
  building: z.string().min(1).max(100),
  floor: z.string().max(20).optional(),
  apartment: z.string().max(20).optional(),
  landmark: z.string().max(200).optional(),
  recipient_name: z.string().min(1).max(100),
  recipient_phone: z.string().regex(kuwaitPhoneRegex, "Must be a Kuwait phone number: +965XXXXXXXX"),
  address_type: z.enum(ADDRESS_TYPES),
  is_default: z.boolean().optional(),
});

export type Address = z.infer<typeof addressSchema>;
export type KuwaitGovernorate = (typeof KUWAIT_GOVERNORATES)[number];
export type AddressType = (typeof ADDRESS_TYPES)[number];
