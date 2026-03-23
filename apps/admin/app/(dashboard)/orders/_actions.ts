"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@nss/db/client"
import type { OrderStatus } from "@nss/db/types"

/**
 * Update the status of an order and add a timeline event
 */
export async function updateOrderStatusAction(orderId: string, status: OrderStatus, note?: string) {
  const supabase = createServiceClient()

  // 1. Update order
  // @ts-ignore
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status } as any)
    .eq("id", orderId)

  if (updateError) return { success: false, error: updateError.message }

  // 2. Add timeline event
  // @ts-ignore
  const { error: timelineError } = await supabase
    .from("order_timeline")
    .insert({
      order_id: orderId,
      status,
      note: note || `Order status updated to ${status}`,
    } as any)

  if (timelineError) console.error("Timeline error:", timelineError)

  revalidatePath(`/orders/${orderId}`)
  revalidatePath("/orders")
  return { success: true }
}

/**
 * Update shipping/tracking information
 */
export async function updateTrackingAction(orderId: string, data: { tracking_number?: string, courier_name?: string }) {
  const supabase = createServiceClient()

  // @ts-ignore
  const { error } = await supabase
    .from("orders")
    .update(data as any)
    .eq("id", orderId)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/orders/${orderId}`)
  return { success: true }
}
