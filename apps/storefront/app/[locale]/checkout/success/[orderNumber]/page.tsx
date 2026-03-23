import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@nss/ui/components/button";
import type { Locale } from "@/lib/i18n";

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ locale: Locale; orderNumber: string }>;
}) {
  const { locale, orderNumber } = await params;
  const isAr = locale === "ar";

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/10 rounded-full blur-3xl" />
          <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/20">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-nss-text-primary">
            {isAr ? "شكراً لك!" : "Thank you!"}
          </h1>
          <p className="text-lg text-nss-text-secondary leading-relaxed">
            {isAr 
              ? "لقد تم استلام طلبك بنجاح. سنقوم بإبلاغك حالما يتم شحنه." 
              : "Your order has been placed successfully. We'll notify you once it's shipped."}
          </p>
        </div>

        <div className="p-6 bg-nss-card rounded-3xl border border-nss-border/50 shadow-sm space-y-2">
          <p className="text-xs text-nss-text-secondary uppercase tracking-widest font-bold">
            {isAr ? "رقم الطلب" : "Order Number"}
          </p>
          <p className="text-2xl font-mono font-bold text-nss-primary tracking-tighter">
            {orderNumber}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild className="h-14 rounded-2xl text-lg font-bold">
            <Link href={`/${locale}/account/orders`}>
              {isAr ? "متابعة الطلب" : "Track Order"}
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-12 rounded-2xl border-2">
            <Link href={`/${locale}`}>
              {isAr ? "العودة للتسوق" : "Continue Shopping"}
              <ArrowRight className={`ms-2 h-4 w-4 ${isAr ? "rotate-180" : ""}`} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
