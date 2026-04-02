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
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          {isAr ? "تسجيل الدخول" : "Welcome Back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isAr
            ? "سجل دخولك للوصول إلى حسابك وطلباتك"
            : "Sign in to access your account and orders"}
        </p>
      </div>

      <LoginForm locale={locale} />

      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          {isAr ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
        </span>
        <Link
          href={`/${locale}/register`}
          className="font-medium text-primary hover:text-primary transition-colors"
        >
          {isAr ? "إنشاء حساب جديد" : "Create a new account"}
        </Link>
      </div>
    </div>
  );
}
