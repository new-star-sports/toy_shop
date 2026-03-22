import { z } from "zod";

/** Checkout Step 1: Address selection */
export const checkoutAddressSchema = z.object({
  address_id: z.string().uuid().optional(),
  new_address: z.object({
    governorate: z.string(),
    area_id: z.string().uuid(),
    block: z.string(),
    street: z.string(),
    building: z.string(),
    floor: z.string().optional(),
    apartment: z.string().optional(),
    landmark: z.string().optional(),
    recipient_name: z.string(),
    recipient_phone: z.string(),
  }).optional(),
}).refine(
  (data) => data.address_id || data.new_address,
  { message: "Either select a saved address or enter a new one" }
);

/** Checkout Step 2: Shipping method */
export const checkoutShippingSchema = z.object({
  shipping_method: z.enum(["standard", "express", "same_day"]),
});

/** Checkout Step 3: Payment */
export const checkoutPaymentSchema = z.object({
  payment_method: z.enum(["knet", "visa_mc", "apple_pay", "cod"]),
  gift_wrap: z.boolean().optional(),
  gift_message: z.string().max(500).optional(),
});

/** Checkout Step 4: Review (coupon) */
export const checkoutReviewSchema = z.object({
  coupon_code: z.string().optional(),
  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

export type CheckoutAddress = z.infer<typeof checkoutAddressSchema>;
export type CheckoutShipping = z.infer<typeof checkoutShippingSchema>;
export type CheckoutPayment = z.infer<typeof checkoutPaymentSchema>;
export type CheckoutReview = z.infer<typeof checkoutReviewSchema>;
