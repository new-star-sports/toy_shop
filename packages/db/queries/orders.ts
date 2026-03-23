import { createServiceClient } from "../client";
import { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Order, OrderItem, OrderTimeline } from "../types";

/**
 * Fetch a single order by its order number and user ID.
 * Used for the checkout success page.
 */
export async function getOrderByNumber(
  supabase: SupabaseClient<Database>,
  orderNumber: string,
  userId: string
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_number", orderNumber)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching order by number:", error);
    return null;
  }

  return data as (Order & { order_items: OrderItem[] });
}

/**
 * Fetch all orders for a specific user.
 * Used for the account orders list page.
 */
export async function getUserOrders(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }

  return data as Order[];
}

/**
 * Fetch full order details including items and timeline.
 * Used for the order detail page.
 */
export async function getOrderDetails(
  supabase: SupabaseClient<Database>,
  orderId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*), order_timeline(*)")
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching order details:", error);
    return null;
  }

  // Sort timeline by date
  if ((data as any).order_timeline) {
    (data as any).order_timeline.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  return data as (Order & { 
    order_items: OrderItem[], 
    order_timeline: OrderTimeline[] 
  });
}

/** Admin: Fetch all orders with pagination and status filters */
export async function getAdminOrders(options?: {
  page?: number;
  perPage?: number;
  orderStatus?: Order["status"];
  paymentStatus?: Order["payment_status"];
  search?: string;
}) {
  const supabase = createServiceClient();
  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("orders")
    .select("*, order_items(*)", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (options?.orderStatus) {
    query = query.eq("status", options.orderStatus);
  }

  if (options?.paymentStatus) {
    query = query.eq("payment_status", options.paymentStatus);
  }

  if (options?.search) {
    query = query.or(`order_number.ilike.%${options.search}%,customer_name.ilike.%${options.search}%,customer_email.ilike.%${options.search}%`);
  }

  const { data, count, error } = await query;
  if (error) throw error;

  return { 
    data: data as (Order & { order_items: OrderItem[] })[], 
    count: count ?? 0 
  };
}

/** Admin: Update order status with timeline event */
export async function updateOrderStatus(
  supabase: SupabaseClient<Database>,
  orderId: string,
  status: Order["status"],
  note?: string
) {
  // 1. Update order status
  const { error: updateError } = await (supabase
    .from("orders" as any)
    .update({ status: status } as any) as any)
    .eq("id", orderId);

  if (updateError) throw updateError;

  // 2. Add timeline event
  const { error: timelineError } = await supabase
    .from("order_timeline")
    .insert({
      order_id: orderId,
      status: status,
      note: note || `Order status updated to ${status}`,
    } as any);

  if (timelineError) throw timelineError;

  return { success: true };
}

/** Admin: Add custom timeline event */
export async function addOrderTimelineEvent(
  supabase: SupabaseClient<Database>,
  orderId: string,
  status: Order["status"],
  note: string
) {
  const { error } = await supabase
    .from("order_timeline")
    .insert({
      order_id: orderId,
      status: status,
      note: note,
    } as any);

  if (error) throw error;
  return { success: true };
}
