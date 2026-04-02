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
}

export function AuthDialog({ locale, trigger, defaultView = "login" }: AuthDialogProps) {
  const [view, setView] = useState<"login" | "register">(defaultView)
  const isAr = locale === "ar"

  // Reset view when dialog closes/opens? 
  // Probably better to keep it as passed or default

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 border-border/40">
            <User size={20} strokeWidth={1.5} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-border/40 shadow-2xl backdrop-blur-xl bg-background/95 rounded-3xl">
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight text-center">
                {view === "login" 
                  ? (isAr ? "تسجيل الدخول" : "Welcome Back") 
                  : (isAr ? "إنشاء حساب جديد" : "Create Account")
                }
              </DialogTitle>
              <DialogDescription className="text-center">
                {view === "login"
                  ? (isAr ? "سجل دخولك للوصول إلى حسابك وطلباتك" : "Sign in to access your account and orders")
                  : (isAr ? "انضم إلينا اليوم للحصول على أفضل الألعاب والعروض" : "Join us today for the best toys and offers")
                }
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="relative">
            {view === "login" ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <LoginForm locale={locale} />
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <RegisterForm locale={locale} />
              </div>
            )}
          </div>

          <div className="text-center text-sm pt-2">
            <span className="text-muted-foreground">
              {view === "login" 
                ? (isAr ? "ليس لديك حساب؟" : "Don't have an account?") 
                : (isAr ? "لديك حساب بالفعل؟" : "Already have an account?")
              }
            </span>
            {" "}
            <button
              onClick={() => setView(view === "login" ? "register" : "login")}
              className="font-semibold text-primary hover:underline transition-all"
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
