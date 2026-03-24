import { createClient } from "@/lib/supabase/server";
import { getAddressById, getGovernorates } from "@nss/db/queries";
import { redirect, notFound } from "next/navigation";
import { AddressForm } from "../_components/address-form";
import type { Locale } from "@/lib/i18n";

export default async function EditAddressPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  const isAr = locale === "ar";
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const [address, governorates] = await Promise.all([
    // @ts-ignore - Supabase client type mismatch in monorepo
    getAddressById(supabase, id),
    // @ts-ignore - Supabase client type mismatch in monorepo
    getGovernorates(supabase),
  ]);

  if (!address || address.user_id !== user.id) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-nss-primary tracking-tight">
          {isAr ? "تعديل العنوان" : "Edit Address"}
        </h1>
        <p className="mt-2 text-sm text-nss-text-secondary">
          {isAr
            ? "تحديث تفاصيل عنوان التوصيل الخاص بك"
            : "Update your delivery address details"}
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-nss-border/50 shadow-sm">
        <AddressForm 
          locale={locale} 
          governorates={governorates} 
          initialData={address} 
        />
      </div>
    </div>
  );
}
