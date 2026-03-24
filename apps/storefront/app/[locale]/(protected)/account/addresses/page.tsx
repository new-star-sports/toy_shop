import { createClient } from "@/lib/supabase/server";
import { getUserAddresses } from "@nss/db/queries";
import { redirect } from "next/navigation";
import { AddressCard } from "./_components/address-card";
import { Button } from "@nss/ui/components/button";
import { IconPlus, IconMapPin } from "@tabler/icons-react";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";

export default async function AddressesPage({
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
  const addresses = await getUserAddresses(supabase, user.id);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-nss-primary tracking-tight">
            {isAr ? "دفتر العناوين" : "Address Book"}
          </h1>
          <p className="mt-2 text-sm text-nss-text-secondary">
            {isAr
              ? "إدارة عناوين التوصيل الخاصة بك"
              : "Manage your delivery addresses for a faster checkout"}
          </p>
        </div>
        <Button asChild className="bg-nss-primary hover:bg-nss-primary/90 gap-2 h-11 px-6 text-base">
          <Link href={`/${locale}/account/addresses/new`}>
            <IconPlus className="h-5 w-5" />
            {isAr ? "إضافة عنوان جديد" : "Add New Address"}
          </Link>
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-20 bg-nss-surface rounded-3xl border-2 border-dashed border-nss-border/50">
          <div className="bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <IconMapPin className="h-8 w-8 text-nss-text-secondary/50" />
          </div>
          <h3 className="text-lg font-semibold text-nss-text-primary">
            {isAr ? "لا يوجد عناوين بعد" : "No addresses yet"}
          </h3>
          <p className="text-nss-text-secondary mt-1 mb-6 max-w-xs mx-auto">
            {isAr 
              ? "أضف عنوانك الأول لتجربة تسوق أسرع" 
              : "Add your first delivery address to make checkout easier and faster."}
          </p>
          <Button asChild variant="outline" className="gap-2">
            <Link href={`/${locale}/account/addresses/new`}>
              <IconPlus className="h-4 w-4" />
              {isAr ? "إضافة عنواني الأول" : "Add my first address"}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address: any) => (
            <AddressCard 
              key={address.id} 
              address={address} 
              locale={locale} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
