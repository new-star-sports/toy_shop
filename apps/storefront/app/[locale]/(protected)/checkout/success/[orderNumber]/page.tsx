import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrderByNumber } from "@nss/db/queries";
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react";
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
    <div className="bg-muted min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.success}</h1>
          <p className="text-muted-foreground">
            {isAr 
              ? `لقد أرسلنا تأكيداً بالبريد الإلكتروني إلى ${user.email}` 
              : `We've sent a confirmation email to ${user.email}`
            }
          </p>
        </div>

        {/* Order Quick Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
            <div className="p-6 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t.orderNumber}</p>
              <p className="font-bold text-foreground">#{order.order_number}</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t.date}</p>
              <p className="font-medium text-foreground">
                {new Date(order.created_at).toLocaleDateString(locale === "ar" ? "ar-KW" : "en-KW")}
              </p>
            </div>
            <div className="p-6 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t.paymentMethod}</p>
              <p className="font-medium text-foreground uppercase">{order.payment_method}</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t.total}</p>
              <p className="font-bold text-primary">{formatCurrency(order.total_kwd, locale)}</p>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              {t.items}
            </h2>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 animate-pulse" /> {/* Image placeholder */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {isAr ? item.name_ar : item.name_en}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isAr ? "الكمية" : "Qty"}: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {formatCurrency(item.line_total_kwd, locale)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-border space-y-2">
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
              <div className="flex justify-between text-lg font-bold pt-2">
                <span className="text-foreground">{t.total}</span>
                <span className="text-primary">{formatCurrency(order.total_kwd, locale)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                {t.shippingTo}
              </h2>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-bold text-foreground">{(order.shipping_address as any).recipient_name}</p>
                <p>{(order.shipping_address as any).area}, {(order.shipping_address as any).governorate}</p>
                <p>Block {(order.shipping_address as any).block}, St {(order.shipping_address as any).street}, Bldg {(order.shipping_address as any).building}</p>
                <p className="pt-2">{(order.shipping_address as any).recipient_phone}</p>
              </div>
            </div>

            <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                <Package className="w-4 h-4" />
                {isAr ? "ماذا يحدث بعد ذلك؟" : "What's next?"}
              </h2>
              <p className="text-sm text-primary/80 leading-relaxed">
                {isAr 
                  ? "سيقوم فريقنا بتجهيز طلبك وسيتم إرسال بريد إلكتروني إليك بمجرد شحنه. يمكنك تتبع طلبك في قسم الطلبات."
                  : "Our team will prepare your order and you'll receive an email as soon as it's shipped. You can track your order in your account."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/${locale}/account/orders`}
            className="flex-1 bg-white text-foreground border border-border py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-muted transition-colors"
          >
            {t.viewOrders}
          </Link>
          <Link
            href={`/${locale}/products`}
            className="flex-1 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-shadow shadow-md shadow-primary/20"
          >
            {t.continueShopping}
            <ArrowRight className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </div>
  );
}
