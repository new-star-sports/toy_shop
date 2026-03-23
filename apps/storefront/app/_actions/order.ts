"use server";

import { createClient } from "@/lib/supabase/server";
import { getAddressById, getSetting } from "@nss/db/queries";
import { createServiceClient } from "@nss/db";
import { revalidatePath } from "next/cache";

interface OrderItemInput {
  productId: string;
  variantId: string | null;
  quantity: number;
}

interface CreateOrderData {
  locale: string;
  addressId: string;
  paymentMethod: string;
  items: OrderItemInput[];
  couponCode?: string;
  idempotencyKey?: string;
}

// Type for the variant query result
interface VariantQueryResult {
  id: string;
  sku: string;
  name_en: string;
  name_ar: string;
  price_override_kwd: number | null;
  product_id: string;
  products: {
    id: string;
    name_en: string;
    name_ar: string;
    price_kwd: number;
    slug: string;
  } | null;
}

export async function createOrder(data: CreateOrderData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Create an admin/service client for sensitive database operations (RLS bypass)
  const adminClient = createServiceClient();

  // 1. Get and Snapshot Address
  const addressResult = await getAddressById(supabase, data.addressId);
  if (!addressResult || addressResult.user_id !== user.id) {
    throw new Error("Invalid address");
  }

  const shippingAddressSnapshot = {
    recipient_name: addressResult.recipient_name,
    recipient_phone: addressResult.recipient_phone,
    governorate: addressResult.governorate?.name_en || "",
    area: addressResult.area?.name_en || "",
    block: addressResult.block,
    street: addressResult.street,
    building: addressResult.building,
    floor: addressResult.floor,
    apartment: addressResult.apartment,
    landmark: addressResult.landmark,
  };

  // 2. Fetch Prices and Calculate Totals (Securely)
  const variantIds = data.items.map(i => i.variantId).filter(Boolean) as string[];
  const { data: variantsRaw, error: variantError } = await supabase
    .from("product_variants")
    .select(`
      id,
      sku,
      name_en,
      name_ar,
      price_override_kwd,
      product_id,
      products (
         id,
         name_en,
         name_ar,
         price_kwd,
         slug,
         category_id
      )
    `)
    .in("id", variantIds);

  if (variantError || !variantsRaw) {
    throw new Error("Failed to fetch product details");
  }

  const variants = variantsRaw as unknown as VariantQueryResult[];

  let subtotal = 0;
  const orderItemsInsert: any[] = [];

  for (const item of data.items) {
    const variant = variants.find(v => v.id === item.variantId);
    if (!variant) throw new Error(`Variant ${item.variantId} not found`);

    const product = variant.products;
    const unitPrice = variant.price_override_kwd || product?.price_kwd || 0;
    const lineTotal = unitPrice * item.quantity;
    subtotal += lineTotal;

    orderItemsInsert.push({
      product_id: product?.id,
      variant_id: variant.id,
      name_en: `${product?.name_en} - ${variant.name_en}`,
      name_ar: `${product?.name_ar} - ${variant.name_ar}`,
      sku: variant.sku,
      quantity: item.quantity,
      unit_price_kwd: unitPrice,
      line_total_kwd: lineTotal,
    });
  }

  // Get shipping settings from DB
  const shippingData = await getSetting("shipping");
  const shippingFee = shippingData?.standard_rate_kwd ?? 2;
  const threshold = shippingData?.free_delivery_threshold_kwd ?? 10;
  
  const shipping = subtotal >= threshold ? 0 : shippingFee;
  
  // -- Coupon Logic --
  let discount = 0;
  let appliedCouponId: string | null = null;
  
  if (data.couponCode) {
    const { validateCouponAction } = await import("./coupon");
    const result = await validateCouponAction(
      data.couponCode, 
      subtotal, 
      orderItemsInsert.map((i: any) => {
        const v = variants.find(vnt => vnt.id === i.variant_id);
        return { 
          productId: i.product_id as string, 
          categoryId: (v?.products as any)?.category_id || null, 
          price: i.unit_price_kwd, 
          quantity: i.quantity 
        };
      }),
      user.id
    );
    
    if (result.success) {
      discount = result.discountAmount || 0;
      appliedCouponId = result.coupon?.id || null;
    }
  }

  const total = Math.max(0, subtotal - discount + shipping);

  // 3. Generate Order Number
  const { data: orderNumber, error: seqError } = await supabase.rpc("generate_order_number");
  if (seqError || !orderNumber) {
    throw new Error("Failed to generate order number");
  }

  // 4. Insert Order
  const { data: order, error: orderError } = await (adminClient as any)
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      status: "pending",
      payment_status: "pending",
      payment_method: data.paymentMethod,
      subtotal_kwd: subtotal,
      shipping_kwd: shipping,
      discount_kwd: discount,
      coupon_code: data.couponCode,
      coupon_discount_kwd: discount,
      total_kwd: total,
      customer_name: user.user_metadata.full_name || user.email?.split("@")[0] || "Customer",
      customer_email: user.email || "",
      customer_phone: addressResult.recipient_phone,
      shipping_address: shippingAddressSnapshot as any,
      idempotency_key: data.idempotencyKey,
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("Order Creation Error:", orderError);
    if (orderError?.code === "23505") throw new Error("Duplicate order detected");
    throw new Error(`Failed to create order: ${orderError?.message || 'Unknown error'}`);
  }

  // 5. Create Order Items
  const { error: itemsError } = await (adminClient as any)
    .from("order_items")
    .insert(orderItemsInsert.map(item => ({ ...item, order_id: (order as any).id })));

  if (itemsError) {
    console.error("Order Items Insertion Error:", itemsError);
    throw new Error(`Failed to create order items: ${itemsError.message}`);
  }

  // 6. Update Stock (Atomic)
  for (const item of data.items) {
    if (item.variantId) {
       const { error: rpcError } = await (adminClient as any).rpc("decrement_stock", {
         p_variant_id: item.variantId,
         p_quantity: item.quantity
       });
       if (rpcError) {
         console.warn(`Stock decrement failed for variant ${item.variantId}:`, rpcError);
       }
    }
  }

  // 7. Add Timeline Entry
  await (adminClient as any).from("order_timeline").insert({
    order_id: (order as any).id,
    status: "pending",
    note: "Order created successfully",
  });

  // 8. Record Coupon Usage (Atomic)
  if (appliedCouponId) {
    const { incrementCouponUsage } = await import("@nss/db/queries");
    await incrementCouponUsage(appliedCouponId);
    
    // Create record in coupon_usage table
    await (adminClient as any).from("coupon_usage").insert({
      coupon_id: appliedCouponId,
      user_id: user.id,
      order_id: (order as any).id,
    });
  }

  revalidatePath(`/${data.locale}/account/orders`);
  
  return { orderId: (order as any).id, orderNumber: (order as any).order_number };
}
