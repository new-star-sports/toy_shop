import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserAddresses, getSetting } from "@nss/db/queries";
import { CheckoutForm } from "./_components/checkout-form";
import type { Locale } from "@/lib/i18n";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login?returnTo=checkout`);
  }

  const addresses = await getUserAddresses(supabase, user.id);
  
  // Get shipping settings (defaults if not found)
  const shippingData = await getSetting("shipping");
  const freeShippingThreshold = shippingData?.free_delivery_threshold_kwd ?? 10;
  const shippingFee = shippingData?.standard_rate_kwd ?? 2;

  return (
    <div className="bg-nss-surface min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-nss-text-primary mb-8">
          {locale === "ar" ? "إتمام الطلب" : "Checkout"}
        </h1>
        
        <CheckoutForm 
          locale={locale} 
          user={user} 
          addresses={addresses}
          shippingSettings={{ freeShippingThreshold, shippingFee }}
        />
      </div>
    </div>
  );
}
