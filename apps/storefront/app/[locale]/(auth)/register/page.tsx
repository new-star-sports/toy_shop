import { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "./_components/register-form";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Register | NewStarSports",
  description: "Create your NewStarSports account",
};

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-nss-primary tracking-tight">
          {isAr ? "إنشاء حساب جديد" : "Create Account"}
        </h1>
        <p className="mt-2 text-sm text-nss-text-secondary">
          {isAr
            ? "انضم إلينا اليوم للحصول على أفضل الألعاب والعروض"
            : "Join us today for the best toys and offers"}
        </p>
      </div>

      <RegisterForm locale={locale} />

      <div className="text-center text-sm">
        <span className="text-nss-text-secondary">
          {isAr ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
        </span>
        <Link
          href={`/${locale}/login`}
          className="font-medium text-nss-primary hover:text-nss-accent transition-colors"
        >
          {isAr ? "تسجيل الدخول" : "Sign in here"}
        </Link>
      </div>
    </div>
  );
}
