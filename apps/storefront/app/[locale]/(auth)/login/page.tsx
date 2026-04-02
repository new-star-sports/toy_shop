import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./_components/login-form";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Login | NewStarSports",
  description: "Login to your NewStarSports account",
};

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div className="clay-shadow-white rounded-[2rem] bg-white p-8 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-black text-foreground tracking-tight">
          {isAr ? "تسجيل الدخول" : "Welcome Back"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isAr
            ? "سجل دخولك للوصول إلى حسابك وطلباتك"
            : "Sign in to access your account and orders"}
        </p>
      </div>

      <LoginForm locale={locale} />

      <div className="text-center text-sm border-t border-border/30 pt-4">
        <span className="text-muted-foreground">
          {isAr ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
        </span>
        <Link
          href={`/${locale}/register`}
          className="font-black text-primary hover:underline transition-colors"
        >
          {isAr ? "إنشاء حساب جديد" : "Sign up"}
        </Link>
      </div>
    </div>
  );
}
