import { z } from "zod";

export const flashSaleSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  title_en: z.string().min(1, "Title (English) is required"),
  title_ar: z.string().min(1, "Title (Arabic) is required"),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
});

export type FlashSaleSettings = z.infer<typeof flashSaleSettingsSchema>;
