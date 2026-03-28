"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "@/app/_actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Locale } from "@/lib/i18n";

export function LoginForm({ locale }: { locale: Locale }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isAr = locale === "ar";
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData, locale);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-lg border-nss-border/50">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {message === "check-email" && (
            <Alert variant="success" className="mb-4">
              <AlertDescription>
                {isAr
                  ? "تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب."
                  : "Account created successfully. Please check your email to confirm your account."}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2 text-start">
            <Label htmlFor="email">{isAr ? "البريد الإلكتروني" : "Email"}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2 text-start">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{isAr ? "كلمة المرور" : "Password"}</Label>
              <Link
                href={`/${locale}/forgot-password`}
                className="text-xs text-nss-primary hover:underline"
              >
                {isAr ? "نسيت كلمة المرور؟" : "Forgot password?"}
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? (isAr ? "جاري التحميل..." : "Signing in...") : (isAr ? "تسجيل الدخول" : "Sign In")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
