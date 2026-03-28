"use client";

import Link from "next/link"
import type { Locale } from "@/lib/i18n"
import { AuthDialog } from "../[locale]/_components/auth-dialog"
import { Button } from "@/components/ui"
import { IconUser } from "@tabler/icons-react"

interface AccountButtonProps {
  locale: Locale
  user?: {
    email?: string
    user_metadata?: {
      full_name?: string
    }
  } | null
}

export function AccountButton({ locale, user }: AccountButtonProps) {
  const isAr = locale === "ar"
  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split("@")[0]

  if (user) {
    return (
      <Link
        href={`/${locale}/account/profile`}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-all duration-200"
        aria-label={isAr ? "الحساب" : "Account"}
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-primary/5">
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
          className="rounded-full h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300"
          aria-label={isAr ? "تسجيل الدخول" : "Login"}
        >
          <IconUser size={22} stroke={1.5} />
        </Button>
      }
    />
  )
}
