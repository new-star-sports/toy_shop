"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/app/_actions/auth";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { Checkbox } from "@/components/ui";
import { Alert, AlertDescription } from "@/components/ui";
import { CheckCircle2 } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface RegisterFormProps {
  locale: Locale;
  onSuccess?: () => void;
}

export function RegisterForm({ locale, onSuccess }: RegisterFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const isAr = locale === "ar";
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await register(formData, locale);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result?.success) {
      if (result.needsConfirmation) {
        setConfirmed(true);
        setLoading(false);
      } else {
        router.refresh();
        onSuccess?.();
      }
    }
  }

  if (confirmed) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-16 h-16 rounded-full bg-clay-mint/40 clay-shadow-mint flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-clay-mint-deep" />
        </div>
        <h3 className="text-lg font-black text-foreground">
          {isAr ? "تحقق من بريدك الإلكتروني" : "Check your email"}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isAr
            ? "تم إنشاء حسابك. يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب."
            : "Account created! Please check your email to confirm your account before signing in."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2 text-start">
        <Label htmlFor="reg-fullName">{isAr ? "الاسم الكامل" : "Full Name"}</Label>
        <Input
          id="reg-fullName"
          name="fullName"
          type="text"
          placeholder={isAr ? "أحمد علي" : "John Doe"}
          required
          autoComplete="name"
          className="h-11 rounded-xl"
        />
      </div>

      <div className="space-y-2 text-start">
        <Label htmlFor="reg-email">{isAr ? "البريد الإلكتروني" : "Email"}</Label>
        <Input
          id="reg-email"
          name="email"
          type="email"
          placeholder="name@example.com"
          required
          autoComplete="email"
          className="h-11 rounded-xl"
        />
      </div>

      <div className="space-y-2 text-start">
        <Label htmlFor="reg-phone">{isAr ? "رقم الهاتف" : "Phone"}</Label>
        <Input
          id="reg-phone"
          name="phone"
          type="tel"
          placeholder="+965 1234 5678"
          required
          autoComplete="tel"
          className="h-11 rounded-xl"
        />
      </div>

      <div className="space-y-2 text-start">
        <Label htmlFor="reg-password">{isAr ? "كلمة المرور" : "Password"}</Label>
        <Input
          id="reg-password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          className="h-11 rounded-xl"
        />
      </div>

      <div className="flex items-start gap-2 pt-1">
        <Checkbox id="reg-terms" name="terms" required className="mt-1" />
        <Label
          htmlFor="reg-terms"
          className="text-xs leading-normal font-normal text-muted-foreground"
        >
          {isAr ? (
            <>
              أوافق على{" "}
              <Link href={`/${locale}/terms`} className="text-primary hover:underline">الشروط والأحكام</Link>{" "}
              و{" "}
              <Link href={`/${locale}/privacy`} className="text-primary hover:underline">سياسة الخصوصية</Link>
            </>
          ) : (
            <>
              I agree to the{" "}
              <Link href={`/${locale}/terms`} className="text-primary hover:underline">Terms & Conditions</Link>{" "}
              and{" "}
              <Link href={`/${locale}/privacy`} className="text-primary hover:underline">Privacy Policy</Link>
            </>
          )}
        </Label>
      </div>

      <Button type="submit" className="w-full h-11 rounded-full font-bold" disabled={loading}>
        {loading ? (isAr ? "جاري التسجيل..." : "Creating Account...") : (isAr ? "إنشاء حساب" : "Create Account")}
      </Button>
    </form>
  );
}
