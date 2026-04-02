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
    redirect(`/${locale}/login`);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-border p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-6">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground mb-6">{t.empty}</p>
            <Link
              href={`/${locale}/products`}
              className="inline-flex bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-shadow shadow-md shadow-primary/20"
            >
              {t.startShopping}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/${locale}/account/orders/${order.id}`}
                className="block bg-white rounded-2xl shadow-sm border border-border overflow-hidden hover:border-primary transition-all group"
              >
                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Package className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          {t.orderHash}{order.order_number}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {t.placedOn} {new Date(order.created_at).toLocaleDateString(locale === "ar" ? "ar-KW" : "en-KW")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {(t.status as any)[order.status] || order.status}
                      </span>
                      <ChevronRight className={`w-5 h-5 text-muted-foreground group-hover:text-primary transition-all ${isAr ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      <span className="uppercase">{order.payment_method}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground mr-2">{t.total}</span>
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(order.total_kwd, locale)}
                      </span>
                    </div>
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
