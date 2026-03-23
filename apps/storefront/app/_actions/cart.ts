"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function reserveStock(items: { variantId: string; quantity: number }[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return; // Only reserve for logged in users in this flow

  // 1. Clear existing reservations for this user
  await supabase.from("stock_reservations").delete().eq("session_id", user.id);

  // 2. Insert new reservations
  const reservations = items.map(item => ({
    variant_id: item.variantId,
    quantity: item.quantity,
    session_id: user.id,
    expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  }));

  const { error } = await supabase.from("stock_reservations").insert(reservations as any);
  if (error) {
    console.error("Stock Reservation Error:", error);
  }
}

export async function clearReservations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("stock_reservations").delete().eq("session_id", user.id);
  }
}
