"use server"

import { revalidatePath } from "next/cache"
import { updateSetting } from "@nss/db/queries"
import type { 
  StoreInfoSettings, 
  AnnouncementBarSettings, 
  TrustBarSettings,
  ShippingSettings,
  LoyaltySettings
} from "@nss/db/queries"

export async function saveStoreInfoAction(data: StoreInfoSettings) {
  try {
    await updateSetting("store_info", data)
    revalidatePath("/", "layout")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function saveAnnouncementBarAction(data: AnnouncementBarSettings) {
  try {
    await updateSetting("announcement_bar", data)
    revalidatePath("/", "layout")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function saveTrustBarAction(data: TrustBarSettings) {
  try {
    await updateSetting("trust_bar", data)
    revalidatePath("/", "layout")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function saveShippingSettingsAction(data: ShippingSettings) {
  try {
    await updateSetting("shipping", data)
    revalidatePath("/", "layout")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function saveLoyaltySettingsAction(data: LoyaltySettings) {
  try {
    await updateSetting("loyalty", data)
    revalidatePath("/", "layout")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
