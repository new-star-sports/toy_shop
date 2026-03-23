import { z } from "zod";

export const couponSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(3, "Code must be at least 3 characters").max(20).toUpperCase(),
  coupon_type: z.enum(["percentage", "fixed_kwd"]),
  value: z.number().positive("Value must be positive"),
  min_order_value_kwd: z.number().nullable().optional(),
  max_uses_total: z.number().int().positive().nullable().optional(),
  max_uses_per_user: z.number().int().positive().default(1),
  applies_to: z.enum(["all", "category", "product"]).default("all"),
  applies_to_ids: z.array(z.string().uuid()).nullable().optional(),
  starts_at: z.string().nullable().optional(),
  expires_at: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type CouponFormValues = z.infer<typeof couponSchema>;
