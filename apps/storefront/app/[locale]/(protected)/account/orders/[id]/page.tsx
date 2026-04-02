import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrderDetails } from "@nss/db/queries";
import { Package, CreditCard, Calendar, ArrowLeft, Clock, MapPin, Receipt } from "lucide-react";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      case "shipped": return "bg-blue-100 text-blue-700";
      default: return "bg-orange-100 text-orange-700";
    }
  };

  return (
    <div className="bg-muted min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href={`/${locale}/account/orders`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors text-sm font-medium"
        >
          <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
          {t.back}
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              {t.orderHash}{order.order_number}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-2">
              <Calendar className="w-4 h-4" />
              {t.placedOn} {new Date(order.created_at).toLocaleDateString(locale === "ar" ? "ar-KW" : "en-KW")}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-border">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t.status}</span>
            <span className={`text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider ${getStatusColor(order.status)}`}>
              {(t.statusLabels as any)[order.status] || order.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-6 border-b border-border flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">{t.items}</h2>
              </div>
              <div className="divide-y divide-border">
                {order.order_items.map((item) => (
                  <div key={item.id} className="p-6 flex gap-6">
                    <div className="w-20 h-20 bg-muted rounded-xl flex-shrink-0 animate-pulse" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground mb-1">
                        {isAr ? item.name_ar : item.name_en}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t.qty}: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{formatCurrency(item.unit_price_kwd, locale)}</p>
                      <p className="text-xs text-muted-foreground">
                        {isAr ? "الإجمالي: " : "Total: "} {formatCurrency(item.line_total_kwd, locale)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-bold text-foreground mb-8 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {t.timeline}
              </h2>
              <div className="relative space-y-8 before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-border">
                {order.order_timeline.map((event, idx) => (
                  <div key={event.id} className="relative pl-10">
                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${
                      idx === 0 ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-border'
                    }`} />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className={`font-bold ${idx === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {(t.statusLabels as any)[event.status] || event.status}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.created_at).toLocaleString(locale === "ar" ? "ar-KW" : "en-KW")}
                      </p>
                    </div>
                    {event.note && (
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {event.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-6 border-b border-border flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">{t.summary}</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.subtotal}</span>
                  <span className="text-foreground font-medium">{formatCurrency(order.subtotal_kwd, locale)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.shipping}</span>
                  <span className="text-foreground font-medium">
                    {order.shipping_kwd === 0 ? t.free : formatCurrency(order.shipping_kwd, locale)}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4 border-t border-border">
                  <span className="text-foreground">{t.total}</span>
                  <span className="text-primary">{formatCurrency(order.total_kwd, locale)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {t.shippingTo}
              </h2>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-bold text-foreground">{(order.shipping_address as any).recipient_name}</p>
                <p>{(order.shipping_address as any).area}, {(order.shipping_address as any).governorate}</p>
                <p>Block {(order.shipping_address as any).block}, St {(order.shipping_address as any).street}, Bldg {(order.shipping_address as any).building}</p>
                <p className="pt-2 font-medium text-foreground">{(order.shipping_address as any).recipient_phone}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                {t.payment}
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground uppercase">{order.payment_method}</span>
                <span className="text-xs text-muted-foreground uppercase">{order.payment_status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
