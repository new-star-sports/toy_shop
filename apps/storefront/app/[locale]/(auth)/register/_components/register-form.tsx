"use client";

import { useState } from "react";
import Link from "next/link";
import { register } from "@/app/_actions/auth";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { Checkbox } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { Alert, AlertDescription } from "@/components/ui";
import type { Locale } from "@/lib/i18n";

export function RegisterForm({ locale }: { locale: Locale }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isAr = locale === "ar";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await register(formData, locale);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-lg border-border/50">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2 text-start">
            <Label htmlFor="fullName">{isAr ? "الاسم الكامل" : "Full Name"}</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder={isAr ? "أحمد علي" : "John Doe"}
              required
              autoComplete="name"
            />
          </div>

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
            <Label htmlFor="phone">{isAr ? "رقم الهاتف" : "Phone"}</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+965 1234 5678"
              required
              autoComplete="tel"
            />
          </div>

          <div className="space-y-2 text-start">
            <Label htmlFor="password">{isAr ? "كلمة المرور" : "Password"}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-start space-x-2 rtl:space-x-reverse pt-2">
            <Checkbox id="terms" name="terms" required className="mt-1" />
            <Label
              htmlFor="terms"
              className="text-xs leading-normal font-normal text-muted-foreground"
            >
              {isAr ? (
                <>
                  أوافق على{" "}
                  <Link href="/ar/terms" className="text-primary hover:underline">
                    الشروط والأحكام
                  </Link>{" "}
                  و{" "}
                  <Link href="/ar/privacy" className="text-primary hover:underline">
                    سياسة الخصوصية
                  </Link>{" "}
                  (بما في ذلك قانون حماية البيانات الكويتي PDPL)
                </>
              ) : (
                <>
                  I agree to the{" "}
                  <Link href="/en/terms" className="text-primary hover:underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/en/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  (including Kuwait PDPL compliance).
                </>
              )}
            </Label>
          </div>

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? (isAr ? "جاري التسجيل..." : "Creating Account...") : (isAr ? "إنشاء حساب" : "Create Account")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
