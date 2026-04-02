import { createClient } from "@/lib/supabase/server";
import { getGovernorates } from "@nss/db/queries";
import { redirect } from "next/navigation";
import { AddressForm } from "../_components/address-form";
import type { Locale } from "@/lib/i18n";

export default async function NewAddressPage({
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

  // @ts-ignore - Supabase client type mismatch in monorepo
  const governorates = await getGovernorates(supabase);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          {isAr ? "إضافة عنوان جديد" : "Add New Address"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isAr
            ? "أدخل تفاصيل عنوان التوصيل الخاص بك"
            : "Enter your delivery address details"}
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border/50 shadow-sm">
        <AddressForm locale={locale} governorates={governorates} />
      </div>
    </div>
  );
}
