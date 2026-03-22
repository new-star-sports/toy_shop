// ── Locale & i18n helpers for NewStarSports ──────────────────────────────────

// ── Type helpers for bilingual fields ────────────────────────────────────────
export type Locale = "en" | "ar";

/** Get localized value from an object with _en and _ar fields */
export function t<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  locale: Locale
): string {
  const key = `${field}_${locale}` as keyof T;
  return (obj[key] as string) ?? (obj[`${field}_en` as keyof T] as string) ?? "";
}

/** Format KWD currency with 3 decimal places */
export function formatKWD(amount: number, locale: Locale = "en"): string {
  if (locale === "ar") {
    return `${amount.toFixed(3)} د.ك`;
  }
  return `KD ${amount.toFixed(3)}`;
}

/** Get discount percentage between compare and sale price */
export function getDiscountPercent(price: number, compareAt: number | null): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

/** Check if product is on sale */
export function isOnSale(price: number, compareAt: number | null): boolean {
  return compareAt !== null && compareAt > price;
}

/** Generate age range text */
export function ageRangeText(minAge: number, maxAge?: number | null, locale: Locale = "en"): string {
  if (locale === "ar") {
    if (maxAge) return `من ${minAge} إلى ${maxAge} سنوات`;
    return `${minAge}+ سنوات`;
  }
  if (maxAge) return `${minAge}–${maxAge} years`;
  return `${minAge}+ years`;
}
