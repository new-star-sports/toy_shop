import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeBannerLink(link: string | null | undefined, locale: string) {
  if (!link) return null;
  
  // 1. Fix plural to singular for category and brand
  let normalized = link
    .replace("/categories/", "/category/")
    .replace("/brands/", "/brand/");
    
  // 2. Ensure locale prefix if navigating to an internal absolute path
  if (normalized.startsWith("/") && !normalized.startsWith(`/${locale}/`) && normalized !== `/${locale}`) {
    if (normalized === "/") {
      normalized = `/${locale}`;
    } else {
      normalized = `/${locale}${normalized}`;
    }
  }
  
  return normalized;
}
