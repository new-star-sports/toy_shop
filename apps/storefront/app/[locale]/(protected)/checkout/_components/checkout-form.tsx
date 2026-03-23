"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, CreditCard, Truck, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Ticket, ShoppingCart } from "lucide-react";
import { Button } from "@nss/ui/components/button";
import { Card } from "@nss/ui/components/card";
import { useCartStore } from "@/store/cart-store";
import { createOrder } from "@/app/_actions/order";
import { reserveStock } from "@/app/_actions/cart";
import type { Locale } from "@/lib/i18n";
import type { User } from "@supabase/supabase-js";
import { useEffect, useMemo } from "react";

interface CheckoutFormProps {
  locale: Locale;
  user: User;
  addresses: any[];
  shippingSettings: {
    freeShippingThreshold: number;
    shippingFee: number;
  };
}

export function CheckoutForm({ locale, user, addresses, shippingSettings }: CheckoutFormProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  // Generate a unique idempotency key for this checkout session
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);

  useEffect(() => {
    if (items.length > 0) {
      reserveStock(items.map(item => ({ variantId: item.variantId, quantity: item.quantity })));
    }
  }, [items]);

  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find(a => a.is_default)?.id || (addresses.length > 0 ? addresses[0].id : "")
  );
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "knet">("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const subtotal = getTotalPrice();

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    setCouponMessage(null);
    
    try {
      const { validateCouponAction } = await import("@/app/_actions/coupon");
      
      const result = await validateCouponAction(
        couponCode, 
        subtotal, 
        items.map(i => ({ 
          productId: i.productId, 
          categoryId: i.categoryId, 
          price: i.price, 
          quantity: i.quantity 
        })),
        user.id
      );

      if (result.success) {
        setAppliedCoupon(result.coupon);
        setDiscountAmount(result.discountAmount || 0);
        setCouponMessage({ type: 'success', text: result.message });
      } else {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponMessage({ type: 'error', text: result.message });
      }
    } catch (err) {
      setCouponMessage({ type: 'error', text: "Failed to validate coupon" });
    } finally {
      setIsValidatingCoupon(false);
    }
  };
  const shippingValue = subtotal >= shippingSettings.freeShippingThreshold ? 0 : shippingSettings.shippingFee;
  const totalValue = Math.max(0, subtotal - discountAmount + shippingValue);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError(isAr ? "يرجى اختيار عنوان التوصيل" : "Please select a shipping address");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createOrder({
        locale,
        addressId: selectedAddressId,
        paymentMethod,
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity
        })),
        couponCode: appliedCoupon?.code,
        idempotencyKey,
      });
      
      clearCart();
      router.push(`/${locale}/checkout/success/${result.orderNumber}`);
    } catch (err: any) {
      setError(err.message || (isAr ? "حدث خطأ أثناء إتمام الطلب" : "An error occurred while placing your order"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-nss-card rounded-3xl border border-nss-border/50">
        <ShoppingCart className="h-16 w-16 text-nss-text-secondary/30 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-nss-text-primary mb-2">
          {isAr ? "سلة التسوق فارغة" : "Your cart is empty"}
        </h2>
        <Button onClick={() => router.push(`/${locale}`)}>
          {isAr ? "العودة للتسوق" : "Back to Shopping"}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Form Steps */}
      <div className="lg:col-span-2 space-y-6">
        {/* Shipping Address */}
        <Card className="p-6 rounded-3xl border-nss-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-nss-primary/10 flex items-center justify-center text-nss-primary font-bold">1</div>
              <h2 className="text-xl font-bold text-nss-text-primary">{isAr ? "عنوان التوصيل" : "Shipping Address"}</h2>
            </div>
            {user.user_metadata?.full_name && (
              <span className="text-xs text-nss-text-secondary hidden md:inline-block">
                {isAr ? `مرحباً، ${user.user_metadata.full_name}` : `Welcome, ${user.user_metadata.full_name}`}
              </span>
            )}
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-nss-border rounded-2xl">
              <MapPin className="h-8 w-8 text-nss-text-secondary/30 mx-auto mb-2" />
              <p className="text-nss-text-secondary mb-4">{isAr ? "ليس لديك عناوين مسجلة" : "No addresses found"}</p>
              <Button variant="outline" onClick={() => router.push(`/${locale}/account/addresses`)}>
                 {isAr ? "أضف عنواناً جديداً" : "Add New Address"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  onClick={() => setSelectedAddressId(address.id)}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                    selectedAddressId === address.id
                      ? "border-nss-primary bg-nss-primary/5"
                      : "border-nss-border hover:border-nss-primary/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-nss-text-primary">{address.recipient_name}</span>
                    {selectedAddressId === address.id && <CheckCircle2 className="h-5 w-5 text-nss-primary" />}
                  </div>
                  <p className="text-xs text-nss-text-secondary line-clamp-2">
                    {address.area?.name_en}, Block {address.block}, St {address.street}, Bldg {address.building}
                  </p>
                  <p className="text-xs text-nss-text-secondary mt-2">{address.recipient_phone}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Payment Method */}
        <Card className="p-6 rounded-3xl border-nss-border/50 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-nss-primary/10 flex items-center justify-center text-nss-primary font-bold">2</div>
            <h2 className="text-xl font-bold text-nss-text-primary">{isAr ? "طريقة الدفع" : "Payment Method"}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setPaymentMethod("cod")}
              className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                paymentMethod === "cod"
                  ? "border-nss-primary bg-nss-primary/5"
                  : "border-nss-border hover:border-nss-primary/30"
              }`}
            >
              <div className={`p-3 rounded-xl ${paymentMethod === "cod" ? "bg-nss-primary text-white" : "bg-nss-surface text-nss-text-secondary"}`}>
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-nss-text-primary">{isAr ? "الدفع عند الاستلام" : "Cash on Delivery"}</p>
                <p className="text-xs text-nss-text-secondary">{isAr ? "ادفع نقداً عند باب منزلك" : "Pay cash at your doorstep"}</p>
              </div>
            </div>

            <div
              onClick={() => setPaymentMethod("knet")}
              className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                paymentMethod === "knet"
                  ? "border-nss-primary bg-nss-primary/5"
                  : "border-nss-border hover:border-nss-primary/30"
              }`}
            >
              <div className={`p-3 rounded-xl ${paymentMethod === "knet" ? "bg-nss-primary text-white" : "bg-nss-surface text-nss-text-secondary"}`}>
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-nss-text-primary">K-Net / Card</p>
                <p className="text-xs text-nss-text-secondary">{isAr ? "دفع سريع وآمن أونلاين" : "Fast & secure online payment"}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Column: Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          <Card className="p-6 rounded-3xl border-nss-border/50 shadow-lg bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-nss-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <h2 className="text-xl font-bold text-nss-text-primary mb-6 relative">{isAr ? "ملخص الطلب" : "Order Summary"}</h2>
            
            <div className="space-y-4 mb-6 relative">
              <div className="flex justify-between text-sm">
                <span className="text-nss-text-secondary">{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                <span className="font-medium text-nss-text-primary">{subtotal.toFixed(3)} {isAr ? "د.ك" : "KWD"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-nss-text-secondary">{isAr ? "رسوم التوصيل" : "Shipping Fee"}</span>
                <span className={`font-medium ${shippingValue === 0 ? "text-green-600" : "text-nss-text-primary"}`}>
                  {shippingValue === 0 ? (isAr ? "مجاني" : "FREE") : `${shippingValue.toFixed(3)} ${isAr ? "د.ك" : "KWD"}`}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-sm animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center gap-1.5 text-green-600 font-medium">
                    <Ticket className="h-3.5 w-3.5" />
                    <span>{isAr ? "الخصم" : "Discount"} ({appliedCoupon?.code})</span>
                  </div>
                  <span className="font-bold text-green-600 line-nums">-{discountAmount.toFixed(3)} {isAr ? "د.ك" : "KWD"}</span>
                </div>
              )}
              <div className="pt-4 border-t border-nss-border/30 flex justify-between">
                <span className="text-lg font-bold text-nss-text-primary">{isAr ? "الإجمالي" : "Total"}</span>
                <span className="text-2xl font-bold text-nss-primary">{totalValue.toFixed(3)} {isAr ? "د.ك" : "KWD"}</span>
              </div>
            </div>

            <div className="mb-6 space-y-2 relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nss-text-secondary" />
                  <input
                    type="text"
                    placeholder={isAr ? "كود الخصم" : "Coupon Code"}
                    className="w-full h-11 pl-9 pr-4 rounded-xl border border-nss-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-nss-primary/20 focus:border-nss-primary/50 transition-all uppercase"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-11 rounded-xl px-4 font-bold border-nss-border/50 hover:bg-nss-surface"
                  onClick={handleApplyCoupon}
                  disabled={isValidatingCoupon || !couponCode}
                >
                  {isValidatingCoupon ? (
                    <div className="h-4 w-4 border-2 border-nss-text-secondary/30 border-t-nss-text-primary rounded-full animate-spin" />
                  ) : (
                    isAr ? "تطبيق" : "Apply"
                  )}
                </Button>
              </div>
              {couponMessage && (
                <p className={`text-[11px] px-1 animate-in fade-in slide-in-from-top-1 ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                  {couponMessage.text}
                </p>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm flex items-start gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <Button
              className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-nss-primary/20 bg-nss-primary hover:bg-nss-primary/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
              onClick={handlePlaceOrder}
              disabled={isSubmitting || items.length === 0}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isAr ? "جاري المعالجة..." : "Processing..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isAr ? "تأكيد الطلب" : "Place Order"}
                  {isAr ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </div>
              )}
            </Button>

            <p className="text-[10px] text-nss-text-secondary text-center mt-4">
              {isAr 
                ? "بالضغط على تأكيد الطلب، فإنك توافق على الشروط والأحكام" 
                : "By placing your order, you agree to our Terms & Conditions"}
            </p>
          </Card>

          {/* Cart Item Mini List */}
          <Card className="p-4 rounded-2xl border-nss-border/30 bg-nss-surface/30">
            <h3 className="text-xs font-bold text-nss-text-secondary uppercase tracking-wider mb-3">
              {isAr ? `منتجات السلة (${items.length})` : `Cart Items (${items.length})`}
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3">
                  <div className="h-12 w-12 rounded-lg bg-white border border-nss-border/30 flex-shrink-0 flex items-center justify-center p-1">
                    {item.image && <img src={item.image} alt={item.nameEn} className="max-h-full max-w-full object-contain" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-nss-text-primary truncate">{isAr ? item.nameAr : item.nameEn}</p>
                    <p className="text-[10px] text-nss-text-secondary">Qty: {item.quantity} × {item.price.toFixed(3)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
