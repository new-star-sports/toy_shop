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
