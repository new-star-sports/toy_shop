import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrderByNumber } from "@nss/db/queries";
import { CheckCircle, Package, Truck, ArrowRight, ImageOff } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ locale: Locale; orderNumber: string }>;
}) {
  const { locale, orderNumber } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // @ts-ignore - Supabase client type mismatch in monorepo
  const order = await getOrderByNumber(supabase, orderNumber, user.id);

  if (!order) {
    notFound();
  }

  const isAr = locale === "ar";
  const t = {
    success: isAr ? "شكراً لك! تم استلام طلبك" : "Thank you! Your order has been received",
    orderNumber: isAr ? "رقم الطلب" : "Order Number",
    date: isAr ? "التاريخ" : "Date",
    paymentMethod: isAr ? "طريقة الدفع" : "Payment Method",
    total: isAr ? "الإجمالي" : "Total",
    items: isAr ? "المنتجات" : "Items",
    shippingTo: isAr ? "يشحن إلى" : "Shipping To",
    continueShopping: isAr ? "مواصلة التسوق" : "Continue Shopping",
    viewOrders: isAr ? "عرض طلباتي" : "View My Orders",
    orderDetails: isAr ? "تفاصيل الطلب" : "Order Details",
    summary: isAr ? "ملخص الطلب" : "Order Summary",
    subtotal: isAr ? "المجموع الفرعي" : "Subtotal",
    shipping: isAr ? "الشحن" : "Shipping",
    free: isAr ? "مجانًا" : "Free",
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="text-center clay-shadow-mint rounded-[2rem] bg-white p-8 sm:p-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-clay-mint/40 clay-shadow-mint rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-clay-mint-deep" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2">{t.success}</h1>
          <p className="text-sm text-muted-foreground">
            {isAr
              ? `لقد أرسلنا تأكيداً بالبريد الإلكتروني إلى ${user.email}`
              : `We've sent a confirmation email to ${user.email}`
            }
          </p>
        </div>

        {/* Order Quick Info */}
        <div className="clay-shadow-white rounded-[2rem] bg-white overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border/30">
            <div className="p-5 text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">{t.orderNumber}</p>
              <p className="font-black text-foreground text-sm">#{order.order_number}</p>
            </div>
            <div className="p-5 text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">{t.date}</p>
              <p className="font-medium text-foreground text-sm">
                {new Date(order.created_at).toLocaleDateString(locale === "ar" ? "ar-KW" : "en-KW")}
              </p>
            </div>
            <div className="p-5 text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">{t.paymentMethod}</p>
              <p className="font-black text-foreground text-sm uppercase">{order.payment_method}</p>
            </div>
            <div className="p-5 text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">{t.total}</p>
              <p className="font-black text-primary">{formatCurrency(order.total_kwd, locale)}</p>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Items */}
          <div className="clay-shadow-sky rounded-[2rem] bg-white p-6">
            <h2 className="text-base font-black text-foreground mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-clay-sky flex items-center justify-center">
                <Package className="w-4 h-4 text-clay-sky-deep" />
              </span>
              {t.items}
            </h2>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-14 h-14 bg-muted/40 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {item.image_url ? (
                      <img src={item.image_url} alt={isAr ? item.name_ar : item.name_en} className="w-full h-full object-contain p-1" />
                    ) : (
                      <ImageOff size={14} className="text-muted-foreground/30" strokeWidth={1} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {isAr ? item.name_ar : item.name_en}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isAr ? "الكمية" : "Qty"}: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-black text-foreground flex-shrink-0">
                    {formatCurrency(item.line_total_kwd, locale)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-border/30 space-y-2">
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
              <div className="flex justify-between text-base font-black pt-2 border-t border-border/20">
                <span>{t.total}</span>
                <span className="text-primary">{formatCurrency(order.total_kwd, locale)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info + What's next */}
          <div className="space-y-5">
            <div className="clay-shadow-lavender rounded-[2rem] bg-white p-6">
              <h2 className="text-base font-black text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-clay-lavender flex items-center justify-center">
                  <Truck className="w-4 h-4 text-clay-lavender-deep" />
                </span>
                {t.shippingTo}
              </h2>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-black text-foreground">{(order.shipping_address as any).recipient_name}</p>
                <p>{(order.shipping_address as any).area}, {(order.shipping_address as any).governorate}</p>
                <p>Block {(order.shipping_address as any).block}, St {(order.shipping_address as any).street}, Bldg {(order.shipping_address as any).building}</p>
                <p className="pt-1 font-medium text-foreground">{(order.shipping_address as any).recipient_phone}</p>
              </div>
            </div>

            <div className="clay-shadow-peach rounded-[2rem] bg-white p-6">
              <h2 className="text-sm font-black text-clay-peach-deep uppercase tracking-wider mb-2 flex items-center gap-2">
                <Package className="w-4 h-4" />
                {isAr ? "ماذا يحدث بعد ذلك؟" : "What's next?"}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isAr
                  ? "سيقوم فريقنا بتجهيز طلبك وسيتم إرسال بريد إلكتروني إليك بمجرد شحنه. يمكنك تتبع طلبك في قسم الطلبات."
                  : "Our team will prepare your order and you'll receive an email as soon as it's shipped. You can track your order in your account."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pb-4">
          <Link
            href={`/${locale}/account/orders`}
            className="flex-1 clay-shadow-white bg-white text-foreground py-4 rounded-full font-black flex items-center justify-center gap-2 hover:clay-shadow-sky transition-all duration-200 text-sm"
          >
            {t.viewOrders}
          </Link>
          <Link
            href={`/${locale}/products`}
            className="flex-1 clay-shadow-sky bg-primary text-white py-4 rounded-full font-black flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-200 text-sm active:scale-[0.98]"
          >
            {t.continueShopping}
            <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
          </Link>
        </div>
      </div>
    </div>
  );
}
