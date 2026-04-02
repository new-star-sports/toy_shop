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
    <div className="clay-shadow-white rounded-[2rem] bg-white p-8 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-black text-foreground tracking-tight">
          {isAr ? "إنشاء حساب جديد" : "Create Account"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isAr
            ? "انضم إلينا اليوم للحصول على أفضل الألعاب والعروض"
            : "Join us today for the best toys and offers"}
        </p>
      </div>

      <RegisterForm locale={locale} />

      <div className="text-center text-sm border-t border-border/30 pt-4">
        <span className="text-muted-foreground">
          {isAr ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
        </span>
        <Link
          href={`/${locale}/login`}
          className="font-black text-primary hover:underline transition-colors"
        >
          {isAr ? "تسجيل الدخول" : "Sign in"}
        </Link>
      </div>
    </div>
  );
}
