import { z } from "zod";

/** Order item — snapshotted at purchase time */
export const orderItemSchema = z.object({
  product_id: z.string().uuid(),
  variant_id: z.string().uuid().optional(),
  name_en: z.string(),
  name_ar: z.string(),
  sku: z.string(),
  hs_code: z.string().optional(),
  quantity: z.number().int().positive(),
  unit_price_kwd: z.number().positive().multipleOf(0.001),
  line_total_kwd: z.number().positive().multipleOf(0.001),
  image_url: z.string().url().optional(),
});

/** Order creation schema */
export const createOrderSchema = z.object({
  user_id: z.string().uuid(),
  items: z.array(orderItemSchema).min(1),
  shipping_address: z.object({
    governorate: z.string(),
    area: z.string(),
    block: z.string(),
    street: z.string(),
    building: z.string(),
    floor: z.string().optional(),
    apartment: z.string().optional(),
    landmark: z.string().optional(),
  }),
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  customer_phone: z.string().min(1),
  shipping_method: z.enum(["standard", "express", "same_day"]),
  payment_method: z.enum(["knet", "visa_mc", "apple_pay", "cod"]),
  coupon_code: z.string().optional(),
  gift_wrap: z.boolean().optional(),
  gift_message: z.string().max(500).optional(),
  idempotency_key: z.string().uuid(),
});

/** Order status update (admin) */
export const updateOrderStatusSchema = z.object({
  status: z.enum(["confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]),
  tracking_number: z.string().optional(),
  courier_name: z.string().optional(),
  internal_note: z.string().max(1000).optional(),
  cancel_reason: z.string().optional(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;
export type CreateOrder = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatus = z.infer<typeof updateOrderStatusSchema>;
