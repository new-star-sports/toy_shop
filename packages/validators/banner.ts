import { z } from "zod";

const datetimeOrEmpty = z
  .string()
  .or(z.literal(""))
  .transform(v => {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d.toISOString();
  })
  .optional()
  .nullable();

export const bannerSchema = z.object({
  banner_type: z.enum(["hero", "announcement", "editorial", "split_promo"]),
  title_en: z.string().max(500).optional().nullable(),
  title_ar: z.string().optional().nullable(),
  subtitle_en: z.string().optional().nullable(),
  subtitle_ar: z.string().optional().nullable(),
  image_desktop_url: z.string().url().or(z.literal("")).optional().nullable(),
  image_mobile_url: z.string().url().or(z.literal("")).optional().nullable(),
  video_desktop_url: z.string().url().or(z.literal("")).optional().nullable(),
  video_mobile_url: z.string().url().or(z.literal("")).optional().nullable(),
  cta_text_en: z.string().optional().nullable(),
  cta_text_ar: z.string().optional().nullable(),
  cta_link: z.string().optional().nullable(),
  cta2_text_en: z.string().optional().nullable(),
  cta2_text_ar: z.string().optional().nullable(),
  cta2_link: z.string().optional().nullable(),
  bg_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color").optional().nullable(),
  text_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color").optional().nullable(),
  countdown_end: datetimeOrEmpty,
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  schedule_start: datetimeOrEmpty,
  schedule_end: datetimeOrEmpty,
  slot: z.string().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  brand_id: z.string().uuid().optional().nullable(),
});

export type Banner = z.infer<typeof bannerSchema>;
