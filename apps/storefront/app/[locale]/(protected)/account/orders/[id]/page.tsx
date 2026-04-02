import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrderDetails } from "@nss/db/queries";
import { Package, CreditCard, Calendar, ArrowLeft, Clock, MapPin, Receipt, ImageOff } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // @ts-ignore - Supabase client type mismatch in monorepo
  const order = await getOrderDetails(supabase, id, user.id);

  if (!order) {
    notFound();
  }

  const isAr = locale === "ar";
  const t = {
    back: isAr ? "العودة إلى طلباتي" : "Back to My Orders",
    orderHash: isAr ? "طلب #" : "Order #",
    placedOn: isAr ? "تم الطلب في" : "Placed on",
    status: isAr ? "الحالة" : "Status",
    payment: isAr ? "الدفع" : "Payment",
    shippingTo: isAr ? "يشحن إلى" : "Shipping To",
    items: isAr ? "المنتجات" : "Items",
    summary: isAr ? "ملخص الطلب" : "Order Summary",
    subtotal: isAr ? "المجموع الفرعي" : "Subtotal",
    shipping: isAr ? "الشحن" : "Shipping",
    total: isAr ? "الإجمالي" : "Total",
    timeline: isAr ? "سجل الطلب" : "Order Timeline",
    free: isAr ? "مجانًا" : "Free",
    qty: isAr ? "الكمية" : "Qty",
    statusLabels: {
      pending: isAr ? "قيد الانتظار" : "Pending",
      confirmed: isAr ? "تم التأكيد" : "Confirmed",
      processing: isAr ? "قيد التنفيذ" : "Processing",
      shipped: isAr ? "تم الشحن" : "Shipped",
      delivered: isAr ? "تم التوصيل" : "Delivered",
      cancelled: isAr ? "ملغي" : "Cancelled",
      returned: isAr ? "مرجع" : "Returned",
    }
  };

  const getStatusClay = (status: string) => {
    switch (status) {
      case "delivered": return "bg-clay-mint text-clay-mint-deep";
      case "cancelled": return "bg-clay-coral text-clay-coral-deep";
      case "shipped": return "bg-clay-sky text-clay-sky-deep";
      case "returned": return "bg-clay-lavender text-clay-lavender-deep";
      default: return "bg-clay-lemon text-clay-lemon-deep";
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href={`/${locale}/account/orders`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-bold"
        >
          <ArrowLeft className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
          {t.back}
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 clay-shadow-white rounded-[2rem] bg-white p-5 sm:p-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              {t.orderHash}{order.order_number}
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(order.created_at).toLocaleDateString(locale === "ar" ? "ar-KW" : "en-KW")}
            </p>
          </div>
          <span className={`text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wide ${getStatusClay(order.status)}`}>
            {(t.statusLabels as any)[order.status] || order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Items */}
            <div className="clay-shadow-sky rounded-[2rem] bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-border/20 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-clay-sky flex items-center justify-center">
                  <Package className="w-3.5 h-3.5 text-clay-sky-deep" />
                </span>
                <h2 className="text-base font-black text-foreground">{t.items}</h2>
              </div>
              <div className="divide-y divide-border/20">
                {order.order_items.map((item) => (
                  <div key={item.id} className="p-5 flex gap-4">
                    <div className="w-16 h-16 bg-muted/40 rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {item.image_url ? (
                        <img src={item.image_url} alt={isAr ? item.name_ar : item.name_en} className="w-full h-full object-contain p-1" />
                      ) : (
                        <ImageOff size={16} className="text-muted-foreground/30" strokeWidth={1} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-foreground text-sm truncate">
                        {isAr ? item.name_ar : item.name_en}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t.qty}: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-foreground text-sm">{formatCurrency(item.unit_price_kwd, locale)}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {formatCurrency(item.line_total_kwd, locale)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="clay-shadow-lavender rounded-[2rem] bg-white p-6">
              <h2 className="text-base font-black text-foreground mb-6 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-clay-lavender flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-clay-lavender-deep" />
                </span>
                {t.timeline}
              </h2>
              <div className="relative space-y-6 before:absolute before:inset-y-0 before:start-2.5 before:w-0.5 before:bg-clay-lavender/40">
                {order.order_timeline.map((event, idx) => (
                  <div key={event.id} className="relative ps-10">
                    <div className={`absolute start-0 top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                      idx === 0 ? "bg-primary clay-shadow-sky" : "bg-clay-lavender/60"
                    }`} />
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <p className={`text-sm font-black ${idx === 0 ? "text-foreground" : "text-muted-foreground"}`}>
                        {(t.statusLabels as any)[event.status] || event.status}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(event.created_at).toLocaleString(locale === "ar" ? "ar-KW" : "en-KW")}
                      </p>
                    </div>
                    {event.note && (
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{event.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Summary */}
            <div className="clay-shadow-white rounded-[2rem] bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-border/20 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-clay-lemon flex items-center justify-center">
                  <Receipt className="w-3.5 h-3.5 text-clay-lemon-deep" />
                </span>
                <h2 className="text-base font-black text-foreground">{t.summary}</h2>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.subtotal}</span>
                  <span className="font-medium">{formatCurrency(order.subtotal_kwd, locale)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.shipping}</span>
                  <span className={`font-medium ${order.shipping_kwd === 0 ? "text-clay-mint-deep" : ""}`}>
                    {order.shipping_kwd === 0 ? t.free : formatCurrency(order.shipping_kwd, locale)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black pt-3 border-t border-border/20">
                  <span>{t.total}</span>
                  <span className="text-primary">{formatCurrency(order.total_kwd, locale)}</span>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="clay-shadow-peach rounded-[2rem] bg-white p-5">
              <h2 className="text-sm font-black text-foreground mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-clay-peach flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-clay-peach-deep" />
                </span>
                {t.shippingTo}
              </h2>
              <div className="text-xs text-muted-foreground space-y-1.5">
                <p className="font-black text-foreground text-sm">{(order.shipping_address as any).recipient_name}</p>
                <p>{(order.shipping_address as any).area}, {(order.shipping_address as any).governorate}</p>
                <p>Block {(order.shipping_address as any).block}, St {(order.shipping_address as any).street}</p>
                <p className="pt-1 font-bold text-foreground">{(order.shipping_address as any).recipient_phone}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="clay-shadow-mint rounded-[2rem] bg-white p-5">
              <h2 className="text-sm font-black text-foreground mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-clay-mint flex items-center justify-center">
                  <CreditCard className="w-3.5 h-3.5 text-clay-mint-deep" />
                </span>
                {t.payment}
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-foreground uppercase">{order.payment_method}</span>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full uppercase ${
                  String(order.payment_status) === "confirmed" ? "bg-clay-mint text-clay-mint-deep" : "bg-clay-lemon text-clay-lemon-deep"
                }`}>{order.payment_status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
