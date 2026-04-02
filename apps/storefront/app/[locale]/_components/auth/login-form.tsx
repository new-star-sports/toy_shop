"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/_actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Locale } from "@/lib/i18n";

interface LoginFormProps {
  locale: Locale;
  onSuccess?: () => void;
}

export function LoginForm({ locale, onSuccess }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isAr = locale === "ar";
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData, locale);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result?.success) {
      router.refresh();
      onSuccess?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2 text-start">
        <Label htmlFor="login-email">{isAr ? "البريد الإلكتروني" : "Email"}</Label>
        <Input
          id="login-email"
          name="email"
          type="email"
          placeholder="name@example.com"
          required
          autoComplete="email"
          className="h-11 rounded-xl"
        />
      </div>

      <div className="space-y-2 text-start">
        <Label htmlFor="login-password">{isAr ? "كلمة المرور" : "Password"}</Label>
        <Input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-11 rounded-xl"
        />
      </div>

      <Button type="submit" className="w-full h-11 rounded-full font-bold" disabled={loading}>
        {loading ? (isAr ? "جاري التحميل..." : "Signing in...") : (isAr ? "تسجيل الدخول" : "Sign In")}
      </Button>
    </form>
  );
}
