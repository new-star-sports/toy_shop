import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with clsx — the cn() utility */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in Kuwaiti Dinar — always 3 decimal places.
 * @example formatKWD(5.5, 'en') → "KD 5.500"
 * @example formatKWD(5.5, 'ar') → "5.500 د.ك"
 */
export function formatKWD(amount: number, locale: "en" | "ar" = "en"): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-KW" : "en-KW", {
    style: "currency",
    currency: "KWD",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount);
}
