"use server";

import { revalidatePath } from "next/cache";
import { updateStock } from "@nss/db/queries";

export async function updateStockAction(
  id: string,
  type: "product" | "variant",
  quantity: number
) {
  try {
    await updateStock(id, type, quantity);
    revalidatePath("/inventory");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to update stock:", error);
    return { success: false, error: "Failed to update stock quantity" };
  }
}
