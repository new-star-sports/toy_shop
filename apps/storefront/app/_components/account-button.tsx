"use client";

import Link from "next/link"
import type { Locale } from "@/lib/i18n"
import { AuthDialog } from "../[locale]/_components/auth-dialog"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccountButtonProps {
  locale: Locale
  user?: {
    email?: string
    user_metadata?: {
      full_name?: string
    }
  } | null
  scrolled?: boolean
}

export function AccountButton({ locale, user, scrolled }: AccountButtonProps) {
  const isAr = locale === "ar"
  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split("@")[0]

  if (user) {
    return (
      <Link
        href={`/${locale}/account/profile`}
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-full transition-all duration-200",
          scrolled
            ? "text-foreground/70 hover:text-foreground hover:bg-muted"
            : "text-white/80 hover:text-white hover:bg-white/10"
        )}
        aria-label={isAr ? "الحساب" : "Account"}
      >
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
          {userDisplayName?.charAt(0).toUpperCase()}
        </div>
        <span className="hidden lg:block text-xs font-semibold max-w-[100px] truncate">
          {userDisplayName}
        </span>
      </Link>
    )
  }

  return (
    <AuthDialog 
      locale={locale} 
      trigger={
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "rounded-full h-9 w-9 transition-all duration-200",
            scrolled
              ? "text-foreground/70 hover:text-primary hover:bg-primary/5"
              : "text-white/80 hover:text-white hover:bg-white/10"
          )}
          aria-label={isAr ? "تسجيل الدخول" : "Login"}
        >
          <User size={20} />
        </Button>
      }
    />
  )
}
