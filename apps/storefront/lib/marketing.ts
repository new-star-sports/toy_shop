import { getSetting } from "@nss/db/queries";

export interface FlashSaleInfo {
  isActive: boolean;
  titleEn: string;
  titleAr: string;
  endTime: string;
}

/**
 * Check if the flash sale is globally active and within time bounds
 */
export async function getActiveFlashSale(): Promise<FlashSaleInfo | null> {
  const settings = await getSetting("flash_sale");
  if (!settings || !settings.enabled) return null;

  const now = new Date();
  const start = new Date(settings.start_time);
  const end = new Date(settings.end_time);

  if (now >= start && now <= end) {
    return {
      isActive: true,
      titleEn: settings.title_en,
      titleAr: settings.title_ar,
      endTime: settings.end_time,
    };
  }

  return null;
}

/**
 * Calculate the actual price after flash sale discount if applicable
 */
export function getFlashSalePrice(originalPrice: number, discountPercent: number | null): number {
  if (!discountPercent) return originalPrice;
  return originalPrice * (1 - discountPercent / 100);
}
