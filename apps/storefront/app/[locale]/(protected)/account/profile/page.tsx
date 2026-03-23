import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/_actions/auth";
import { Button } from "@nss/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@nss/ui/components/card";
import type { Locale } from "@/lib/i18n";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-nss-primary tracking-tight">
          {isAr ? "حسابي" : "My Account"}
        </h1>
        <p className="mt-2 text-sm text-nss-text-secondary">
          {isAr
            ? "إدارة معلومات حسابك وطلباتك"
            : "Manage your account information and orders"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Account Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <nav className="space-y-1">
            <a
              href={`/${locale}/account/profile`}
              className="block px-4 py-2 text-sm font-medium text-nss-primary bg-nss-surface rounded-lg"
            >
              {isAr ? "الملف الشخصي" : "Profile Settings"}
            </a>
            <a
              href={`/${locale}/account/orders`}
              className="block px-4 py-2 text-sm font-medium text-nss-text-secondary hover:text-nss-primary hover:bg-nss-surface rounded-lg transition-colors"
            >
              {isAr ? "طلباتي" : "My Orders"}
            </a>
            <a
              href={`/${locale}/account/addresses`}
              className="block px-4 py-2 text-sm font-medium text-nss-text-secondary hover:text-nss-primary hover:bg-nss-surface rounded-lg transition-colors"
            >
              {isAr ? "دفتر العناوين" : "Address Book"}
            </a>
          </nav>

          <div className="pt-4 border-t border-nss-border">
            <form action={logout.bind(null, locale)}>
              <Button
                variant="destructive"
                className="w-full justify-start text-red-600 bg-red-50 hover:bg-red-100 border-none"
                type="submit"
              >
                {isAr ? "تسجيل الخروج" : "Logout"}
              </Button>
            </form>
          </div>
        </div>

        {/* Profile Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isAr ? "المعلومات الشخصية" : "Personal Information"}</CardTitle>
              <CardDescription>
                {isAr ? "بياناتك الأساسية المسجلة لدينا" : "Your basic account information"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b border-nss-border/50 pb-4">
                <span className="text-sm font-medium text-nss-text-secondary">
                  {isAr ? "الاسم الكامل" : "Full Name"}
                </span>
                <span className="text-sm text-nss-text-primary">
                  {user.user_metadata?.full_name || "—"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 border-b border-nss-border/50 pb-4">
                <span className="text-sm font-medium text-nss-text-secondary">
                  {isAr ? "البريد الإلكتروني" : "Email"}
                </span>
                <span className="text-sm text-nss-text-primary">{user.email}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-2">
                <span className="text-sm font-medium text-nss-text-secondary">
                  {isAr ? "رقم الهاتف" : "Phone Number"}
                </span>
                <span className="text-sm text-nss-text-primary">
                  {user.user_metadata?.phone || "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
