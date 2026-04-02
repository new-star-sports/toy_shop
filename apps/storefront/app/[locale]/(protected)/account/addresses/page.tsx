import { createClient } from "@/lib/supabase/server";
import { getUserAddresses } from "@nss/db/queries";
import { redirect } from "next/navigation";
import { AddressCard } from "./_components/address-card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";
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
    redirect(`/${locale}?auth=login&redirect=${encodeURIComponent(`/${locale}/account/addresses`)}`);
  }

  // @ts-ignore - Supabase client type mismatch in monorepo
  const addresses = await getUserAddresses(supabase, user.id);

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            {isAr ? "دفتر العناوين" : "Address Book"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAr ? "إدارة عناوين التوصيل الخاصة بك" : "Manage your delivery addresses for a faster checkout"}
          </p>
        </div>
        <Button asChild className="clay-shadow-sky rounded-full gap-2 h-11 px-6 font-black">
          <Link href={`/${locale}/account/addresses/new`}>
            <Plus className="h-4 w-4" />
            {isAr ? "إضافة عنوان جديد" : "Add New Address"}
          </Link>
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16 clay-shadow-white rounded-[2rem] bg-white">
          <div className="w-20 h-20 rounded-full bg-clay-peach/40 clay-shadow-peach flex items-center justify-center mx-auto mb-6">
            <MapPin className="h-9 w-9 text-clay-peach-deep" />
          </div>
          <h3 className="text-lg font-black text-foreground">
            {isAr ? "لا يوجد عناوين بعد" : "No addresses yet"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-xs mx-auto">
            {isAr
              ? "أضف عنوانك الأول لتجربة تسوق أسرع"
              : "Add your first delivery address to make checkout easier and faster."}
          </p>
          <Button asChild className="rounded-full gap-2 font-black clay-shadow-peach">
            <Link href={`/${locale}/account/addresses/new`}>
              <Plus className="h-4 w-4" />
              {isAr ? "إضافة عنواني الأول" : "Add my first address"}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
