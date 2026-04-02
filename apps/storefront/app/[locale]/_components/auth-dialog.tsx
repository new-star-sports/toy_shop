"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { LoginForm } from "../(auth)/login/_components/login-form"
import { RegisterForm } from "../(auth)/register/_components/register-form"
import type { Locale } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

interface AuthDialogProps {
  locale: Locale
  trigger?: React.ReactNode
  defaultView?: "login" | "register"
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AuthDialog({ locale, trigger, defaultView = "login", open: controlledOpen, onOpenChange }: AuthDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [view, setView] = useState<"login" | "register">(defaultView)
  const isAr = locale === "ar"

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  function handleOpenChange(val: boolean) {
    if (!val) setView(defaultView)
    if (isControlled) {
      onOpenChange?.(val)
    } else {
      setInternalOpen(val)
    }
  }

  function handleAuthSuccess() {
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      {!trigger && (
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            <User size={20} />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[440px] p-0 overflow-hidden border-none clay-shadow-white rounded-[2rem]">
        <div className="p-6 sm:p-8 space-y-5">
          <DialogHeader className="text-center space-y-1">
            <DialogTitle className="text-2xl font-black tracking-tight text-center">
              {view === "login"
                ? (isAr ? "تسجيل الدخول" : "Welcome Back")
                : (isAr ? "إنشاء حساب جديد" : "Create Account")
              }
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              {view === "login"
                ? (isAr ? "سجل دخولك للوصول إلى حسابك وطلباتك" : "Sign in to access your account and orders")
                : (isAr ? "انضم إلينا اليوم للحصول على أفضل الألعاب والعروض" : "Join us today for the best toys and offers")
              }
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            {view === "login" ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                <LoginForm locale={locale} onSuccess={handleAuthSuccess} />
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                <RegisterForm locale={locale} onSuccess={handleAuthSuccess} />
              </div>
            )}
          </div>

          <div className="text-center text-sm border-t border-border/30 pt-4">
            <span className="text-muted-foreground">
              {view === "login"
                ? (isAr ? "ليس لديك حساب؟" : "Don't have an account?")
                : (isAr ? "لديك حساب بالفعل؟" : "Already have an account?")
              }
            </span>
            {" "}
            <button
              onClick={() => setView(view === "login" ? "register" : "login")}
              className="font-black text-primary hover:underline transition-all"
            >
              {view === "login"
                ? (isAr ? "إنشاء حساب جديد" : "Sign up")
                : (isAr ? "تسجيل الدخول" : "Sign in")
              }
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
