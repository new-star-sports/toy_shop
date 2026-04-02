import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserOrders } from "@nss/db/queries";
import { Package, ChevronRight, Calendar, CreditCard, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export default async function MyOrdersPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}?auth=login&redirect=${encodeURIComponent(`/${locale}/account/orders`)}`);
  }

  // @ts-ignore - Supabase client type mismatch in monorepo
  const orders = await getUserOrders(supabase, user.id);

  const isAr = locale === "ar";
  const t = {
    title: isAr ? "طلباتي" : "My Orders",
    subtitle: isAr ? "عرض وإدارة طلباتك السابقة" : "View and manage your past orders",
    empty: isAr ? "ليس لديك أي طلبات بعد" : "You don't have any orders yet",
    startShopping: isAr ? "ابدأ التسوق" : "Start Shopping",
    orderHash: isAr ? "طلب #" : "Order #",
    placedOn: isAr ? "تم الطلب في" : "Placed on",
    total: isAr ? "الإجمالي" : "Total",
    viewDetails: isAr ? "عرض التفاصيل" : "View Details",
    status: {
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">{t.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
          </div>
          <span className="text-sm font-black text-muted-foreground bg-clay-lemon/50 px-3 py-1 rounded-full">
            {orders.length}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="clay-shadow-white rounded-[2rem] bg-white p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-clay-lavender/40 clay-shadow-lavender flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-9 h-9 text-clay-lavender-deep" />
            </div>
            <p className="text-lg font-black text-foreground mb-2">{t.empty}</p>
            <p className="text-sm text-muted-foreground mb-6">{isAr ? "تصفح المنتجات وأضف ما يعجبك" : "Browse products and add your favourites"}</p>
            <Link
              href={`/${locale}/search`}
              className="inline-flex clay-shadow-sky bg-primary text-white px-8 py-3 rounded-full font-black hover:bg-primary/90 transition-all active:scale-95"
            >
              {t.startShopping}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/${locale}/account/orders/${order.id}`}
                className="block clay-shadow-white rounded-[2rem] bg-white overflow-hidden clay-hover transition-all group"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-clay-sky/40 rounded-2xl flex items-center justify-center group-hover:bg-clay-sky transition-colors">
                        <Package className="w-5 h-5 text-clay-sky-deep" />
                      </div>
                      <div>
                        <p className="font-black text-foreground text-sm">
                          {t.orderHash}{order.order_number}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.created_at).toLocaleDateString(locale === "ar" ? "ar-KW" : "en-KW")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wide ${getStatusClay(order.status)}`}>
                        {(t.status as any)[order.status] || order.status}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-all ${isAr ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/20">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span className="uppercase font-bold">{order.payment_method}</span>
                    </div>
                    <span className="text-base font-black text-primary">
                      {formatCurrency(order.total_kwd, locale)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
