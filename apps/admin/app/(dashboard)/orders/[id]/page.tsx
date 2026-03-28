import { createServerClient } from "@nss/db/client";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { 
  Badge, 
  Button, 
  Card,
  Avatar,
  AvatarFallback,
  Separator
} from "@/components/ui";
import {
  IconPackage,
  IconTruck,
  IconClock,
  IconUser,
  IconMapPin,
  IconPhone,
  IconMail,
  IconArrowLeft,
  IconCircleCheck,
  IconCreditCard,
  IconHash
} from "@tabler/icons-react";
import Link from "next/link";
import { FulfillmentActions, TrackingUpdate } from "../_components/fulfillment-actions";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-border/50" asChild>
            <Link href="/orders">
              <IconArrowLeft size={18} stroke={1.5} />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                Order <span className="text-primary font-mono">#{order.order_number}</span>
              </h1>
              <Badge
                variant={
                  order.status === "delivered"
                    ? "default"
                    : order.status === "cancelled" || order.status === "refunded"
                    ? "destructive"
                    : "outline"
                }
                className="rounded-full px-3 py-0.5 font-medium text-xs capitalize"
              >
                {order.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
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
          <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
            <div className="p-4 bg-muted/20 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconPackage size={18} className="text-primary" stroke={1.5} />
                <h3 className="font-semibold text-foreground">Order Items</h3>
              </div>
              <Badge variant="secondary" className="rounded-full bg-muted/50 text-[10px] uppercase tracking-wider px-2 py-0 border-none">
                {order.order_items.length} Items
              </Badge>
            </div>
            <div className="divide-y divide-border/30">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 hover:bg-muted/5 transition-colors group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-muted/30 border border-border/40 overflow-hidden shrink-0 transition-transform group-hover:scale-[1.02]">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name_en} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground italic">No image</div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.name_en}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-mono">
                      <IconHash size={12} stroke={2} /> {item.sku}
                    </p>
                  </div>
                  <div className="text-right flex flex-col justify-center">
                    <p className="font-medium text-xs text-muted-foreground mb-1">
                      {item.unit_price_kwd.toFixed(3)} × {item.quantity}
                    </p>
                    <p className="font-bold text-foreground">
                      {item.line_total_kwd.toFixed(3)} KD
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-muted/10 border-t border-border/30 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{order.subtotal_kwd.toFixed(3)} KD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold">{order.shipping_kwd.toFixed(3)} KD</span>
              </div>
              {order.discount_kwd > 0 && (
                <div className="flex justify-between text-sm text-destructive font-medium">
                  <span>Discount</span>
                  <span>-{order.discount_kwd.toFixed(3)} KD</span>
                </div>
              )}
              <Separator className="bg-border/40" />
              <div className="flex justify-between text-xl font-bold pt-1">
                <span className="text-foreground">Total</span>
                <span className="text-primary">{order.total_kwd.toFixed(3)} KD</span>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
             <div className="p-4 bg-muted/20 border-b border-border/50 flex items-center gap-2">
              <IconClock size={18} className="text-primary" stroke={1.5} />
              <h3 className="font-semibold text-foreground">Order History</h3>
            </div>
            <div className="p-6 sm:p-8 space-y-8 relative">
              {/* Vertical line connecting bubbles */}
              <div className="absolute left-[39px] sm:left-[47px] top-8 bottom-8 w-0.5 bg-border/40" />
              
              {timeline.map((event: any, i: number) => (
                <div key={event.id} className="relative ps-12 sm:ps-16 group">
                  <div className={`absolute left-0 top-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center z-10 border-2 bg-background transition-all duration-300 ${
                    i === 0 ? "border-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" : "border-border/60"
                  }`}>
                     {i === 0 ? (
                       <IconCircleCheck size={18} className="text-primary animate-in fade-in zoom-in duration-500" stroke={2} />
                     ) : (
                       <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                     )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={i === 0 ? "default" : "outline"} className="capitalize text-[10px] rounded-full px-2 py-0 border-none font-bold">
                        {event.status}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-medium opacity-60">
                        {format(new Date(event.created_at), "MMM d, yyyy 'at' HH:mm")}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed mt-1 ${i === 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {event.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Information */}
        <div className="space-y-6">
          {/* Customer Card */}
          <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
             <div className="p-4 bg-muted/20 border-b border-border/50 flex items-center gap-2 text-primary">
                <IconUser size={18} stroke={1.5} />
                <h3 className="font-semibold text-foreground">Customer</h3>
             </div>
             <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                   <Avatar className="h-12 w-12 rounded-full border border-border/40 ring-4 ring-primary/5">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {order.customer_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                   </Avatar>
                   <div className="flex flex-col">
                      <p className="font-semibold text-foreground">{order.customer_name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase opacity-60 mt-0.5">ID: {order.user_id.slice(0,8)}</p>
                   </div>
                </div>
                <div className="space-y-3 pt-6 border-t border-border/30">
                   <div className="flex items-center gap-3 text-sm group">
                      <div className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary/10">
                        <IconMail size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors truncate">{order.customer_email}</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm group">
                      <div className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary/10">
                        <IconPhone size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{order.customer_phone}</span>
                   </div>
                </div>
             </div>
          </Card>

          {/* Shipping Card */}
          <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
             <div className="p-4 bg-muted/20 border-b border-border/50 flex items-center gap-2 text-primary">
                <IconMapPin size={18} stroke={1.5} />
                <h3 className="font-semibold text-foreground">Shipping Address</h3>
             </div>
             <div className="p-6">
               <div className="bg-muted/10 rounded-xl p-4 border border-border/20 space-y-1">
                  <p className="font-bold text-foreground mb-1">{order.shipping_address.recipient_name}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {order.shipping_address.street}, Block {order.shipping_address.block}<br />
                    {order.shipping_address.area}, {order.shipping_address.governorate}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-primary">
                    <IconPhone size={12} stroke={2} />
                    {order.shipping_address.recipient_phone}
                  </div>
               </div>
             </div>
          </Card>

          {/* Fulfillment Card */}
          <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
             <div className="p-4 bg-muted/20 border-b border-border/50 flex items-center gap-2 text-primary">
                <IconTruck size={18} stroke={1.5} />
                <h3 className="font-semibold text-foreground">Fulfillment</h3>
             </div>
             <div className="p-6 space-y-4">
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Method</span>
                      <Badge variant="secondary" className="rounded-full bg-muted/50 font-semibold capitalize border-none text-[11px]">
                        {order.shipping_method}
                      </Badge>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Tracking</span>
                      <span className="font-mono text-xs font-bold bg-muted/30 px-2 py-0.5 rounded-md">
                        {order.tracking_number || "NOT ASSIGNED"}
                      </span>
                   </div>
                </div>
                <div className="pt-4 border-t border-border/30">
                  <TrackingUpdate orderId={order.id} currentTracking={order.tracking_number} />
                </div>
             </div>
          </Card>

          {/* Payment Card */}
          <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
             <div className="p-4 bg-muted/20 border-b border-border/50 flex items-center gap-2 text-primary">
                <IconCreditCard size={18} stroke={1.5} />
                <h3 className="font-semibold text-foreground">Payment</h3>
             </div>
             <div className="p-6 space-y-3">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-muted-foreground">Status</span>
                   <Badge 
                     variant={order.payment_status === "confirmed" ? "default" : "secondary"} 
                     className="rounded-full font-bold uppercase text-[9px] border-none"
                   >
                     {order.payment_status}
                   </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-muted-foreground">Method</span>
                   <span className="font-semibold uppercase text-xs tracking-wider opacity-60">{order.payment_method}</span>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
