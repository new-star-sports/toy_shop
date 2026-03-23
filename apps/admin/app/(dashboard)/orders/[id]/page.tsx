import { getOrderDetails } from "@nss/db/queries";
import { createServerClient } from "@nss/db/client";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@nss/ui/components/badge";
import { Button } from "@nss/ui/components/button";
import { Card } from "@nss/ui/components/card";
import {
  Package,
  Truck,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { FulfillmentActions, TrackingUpdate } from "../_components/fulfillment-actions";

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const supabase = createServerClient(await cookies());
  // @ts-ignore - Supabase type mismatch in mono-repo typing
  const { data: rawOrder, error } = await supabase
    .from("orders")
    .select("*, order_items(*), order_timeline(*)")
    .eq("id", id)
    .single();

  if (error || !rawOrder) {
    notFound();
  }

  const order = rawOrder as any;

  // Sort timeline
  const timeline = [...(order.order_timeline || [])].sort(
    (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/orders">
              <ArrowLeft size={16} />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-nss-text-primary">
                Order #{order.order_number}
              </h1>
              <Badge
                variant={
                  order.status === "delivered"
                    ? "default"
                    : order.status === "cancelled" || order.status === "refunded"
                    ? "destructive"
                    : "outline"
                }
                className="capitalize"
              >
                {order.status}
              </Badge>
            </div>
            <p className="text-sm text-nss-text-secondary">
              Placed on {format(new Date(order.created_at), "MMMM d, yyyy 'at' HH:mm")}
            </p>
          </div>
        </div>
        <FulfillmentActions orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card className="overflow-hidden">
            <div className="p-4 bg-nss-surface border-b border-nss-border flex items-center gap-2">
              <Package size={18} className="text-nss-primary" />
              <h3 className="font-semibold text-nss-text-primary">Order Items</h3>
            </div>
            <div className="divide-y divide-nss-border">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="p-4 flex gap-4">
                  <div className="w-16 h-16 rounded bg-nss-surface border border-nss-border overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name_en} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-nss-text-secondary">No image</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-nss-text-primary">{item.name_en}</p>
                    <p className="text-xs text-nss-text-secondary">SKU: {item.sku}</p>
                  </div>
                  <div className="text-end">
                    <p className="font-mono text-sm">
                      {item.unit_price_kwd.toFixed(3)} × {item.quantity}
                    </p>
                    <p className="font-mono font-bold text-nss-primary">
                      {item.line_total_kwd.toFixed(3)} KD
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-nss-surface/30 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-nss-text-secondary">Subtotal</span>
                <span className="font-mono">{order.subtotal_kwd.toFixed(3)} KD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-nss-text-secondary">Shipping</span>
                <span className="font-mono">{order.shipping_kwd.toFixed(3)} KD</span>
              </div>
              {order.discount_kwd > 0 && (
                <div className="flex justify-between text-sm text-nss-danger">
                  <span>Discount</span>
                  <span className="font-mono">-{order.discount_kwd.toFixed(3)} KD</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t border-nss-border pt-2 mt-2">
                <span className="text-nss-text-primary">Total</span>
                <span className="text-nss-primary font-mono">{order.total_kwd.toFixed(3)} KD</span>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
             <div className="p-4 bg-nss-surface border-b border-nss-border flex items-center gap-2">
              <Clock size={18} className="text-nss-primary" />
              <h3 className="font-semibold text-nss-text-primary">Order History</h3>
            </div>
            <div className="p-6 space-y-6">
              {timeline.map((event: any, i: number) => (
                <div key={event.id} className="relative ps-8 pb-6 last:pb-0">
                  {i !== timeline.length - 1 && (
                    <div className="absolute start-3 top-6 bottom-0 w-0.5 bg-nss-border" />
                  )}
                  <div className="absolute start-0 top-1 w-6 h-6 rounded-full bg-nss-surface border-2 border-nss-primary flex items-center justify-center z-10">
                     <div className="w-2 h-2 rounded-full bg-nss-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="capitalize text-[10px]">{event.status}</Badge>
                      <span className="text-xs text-nss-text-secondary">
                        {format(new Date(event.created_at), "MMM d, yyyy HH:mm")}
                      </span>
                    </div>
                    <p className="text-sm text-nss-text-primary">{event.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Customer & Shipping Info */}
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
             <div className="flex items-center gap-2 text-nss-primary">
                <User size={18} />
                <h3 className="font-semibold text-nss-text-primary">Customer</h3>
             </div>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-nss-surface flex items-center justify-center text-nss-primary font-bold">
                      {order.customer_name.charAt(0)}
                   </div>
                   <div>
                      <p className="font-medium text-nss-text-primary">{order.customer_name}</p>
                      <p className="text-xs text-nss-text-secondary">Customer ID: {order.user_id.slice(0,8)}</p>
                   </div>
                </div>
                <div className="space-y-2 border-t border-nss-border pt-4">
                   <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-nss-text-secondary" />
                      <span>{order.customer_email}</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-nss-text-secondary" />
                      <span>{order.customer_phone}</span>
                   </div>
                </div>
             </div>
          </Card>

          <Card className="p-6 space-y-4">
             <div className="flex items-center gap-2 text-nss-primary">
                <MapPin size={18} />
                <h3 className="font-semibold text-nss-text-primary">Shipping Address</h3>
             </div>
             <div className="text-sm text-nss-text-primary space-y-1">
                <p className="font-semibold">{order.shipping_address.recipient_name}</p>
                <p>{order.shipping_address.street}, Block {order.shipping_address.block}</p>
                <p>{order.shipping_address.area}, {order.shipping_address.governorate}</p>
                <p>Phone: {order.shipping_address.recipient_phone}</p>
             </div>
          </Card>

          <Card className="p-6 space-y-4">
             <div className="flex items-center gap-2 text-nss-primary">
                <Truck size={18} />
                <h3 className="font-semibold text-nss-text-primary">Fulfillment</h3>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between text-sm">
                   <span className="text-nss-text-secondary">Method</span>
                   <span className="font-medium capitalize">{order.shipping_method}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-nss-text-secondary">Tracking</span>
                   <span className="font-medium">{order.tracking_number || "Not assigned"}</span>
                </div>
                <TrackingUpdate orderId={order.id} currentTracking={order.tracking_number} />
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
