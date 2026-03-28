"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { couponSchema, type CouponFormValues } from "@nss/validators/coupon"
import { saveCoupon } from "../_actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TargetSelector } from "./target-selector"
import { toast } from "sonner"
import { Loader2, Ticket, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CouponFormProps {
  initialData?: any
}

export function CouponForm({ initialData }: CouponFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: Partial<CouponFormValues> = initialData || {
    code: "",
    coupon_type: "percentage",
    value: 10,
    min_order_value_kwd: 0,
    max_uses_total: null,
    max_uses_per_user: 1,
    applies_to: "all",
    applies_to_ids: [],
    is_active: true,
  }

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema as any),
    defaultValues: defaultValues as any,
  })

  // Destructure for easy access and re-render on change
  const { register, handleSubmit, formState: { errors }, setValue, watch } = form
  const appliesTo = watch("applies_to")
  const couponType = watch("coupon_type")
  const appliesToIds = watch("applies_to_ids") || []

  async function onSubmit(data: CouponFormValues) {
    setIsSubmitting(true)
    const result = await saveCoupon(data)
    setIsSubmitting(false)

    if (result.success) {
      toast.success(initialData ? "Coupon updated successfully" : "Coupon created successfully")
      router.push("/coupons")
      router.refresh()
    } else {
      toast.error(result.error || "Something went wrong")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: General Settings */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Ticket className="h-5 w-5 text-nss-primary" /> General Configuration
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input 
                  id="code" 
                  placeholder="e.g. SAVE20" 
                  className="font-bold uppercase"
                  {...register("code")} 
                />
                {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Coupon Type</Label>
                <Select 
                  defaultValue={defaultValues.coupon_type}
                  onValueChange={(val) => setValue("coupon_type", val as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed_kwd">Fixed Amount (KWD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">{couponType === "percentage" ? "Discount Percentage" : "Discount Amount (KWD)"}</Label>
                <Input 
                  id="value" 
                  type="number" 
                  step="0.001"
                  {...register("value", { valueAsNumber: true })} 
                />
                {errors.value && <p className="text-xs text-red-500">{errors.value.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_order_value_kwd">Min Order Value (KWD)</Label>
                <Input 
                  id="min_order_value_kwd" 
                  type="number" 
                  step="0.001"
                  {...register("min_order_value_kwd", { valueAsNumber: true })} 
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Restriction Targeting</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Applies To</Label>
                <Select 
                  defaultValue={defaultValues.applies_to}
                  onValueChange={(val) => {
                    setValue("applies_to", val as any)
                    setValue("applies_to_ids", []) // Reset on type change
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Entire Store</SelectItem>
                    <SelectItem value="category">Specific Categories</SelectItem>
                    <SelectItem value="product">Specific Products</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-nss-text-secondary">
                  Choose whether this coupon applies to everything, or just certain products/categories.
                </p>
              </div>

              {appliesTo !== "all" && (
                <div className="space-y-2 pt-2 border-t border-nss-border">
                  <Label>Select {appliesTo === "product" ? "Products" : "Categories"}</Label>
                  <TargetSelector 
                    type={appliesTo as any}
                    selectedIds={appliesToIds as string[]}
                    onSelect={(ids) => setValue("applies_to_ids", ids)}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Usage & Limits */}
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <h2 className="text-lg font-semibold">Usage Limits</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max_uses_total">Total Usage Limit</Label>
                <Input 
                  id="max_uses_total" 
                  type="number" 
                  placeholder="Unlimited"
                  {...register("max_uses_total", { valueAsNumber: true })} 
                />
                <p className="text-[10px] text-nss-text-secondary">Number of times this coupon can be used total.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_uses_per_user">Usage Per User</Label>
                <Input 
                  id="max_uses_per_user" 
                  type="number" 
                  {...register("max_uses_per_user", { valueAsNumber: true })} 
                />
                <p className="text-[10px] text-nss-text-secondary">How many times a single customer can use this code.</p>
              </div>

              <div className="pt-4 border-t border-nss-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Active Status</Label>
                    <p className="text-[10px] text-nss-text-secondary">Enable or disable this coupon code.</p>
                  </div>
                  <Switch 
                    checked={watch("is_active")}
                    onCheckedChange={(val) => setValue("is_active", val)}
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-3">
            <Button 
              type="submit" 
              className="h-12 text-lg font-bold bg-nss-primary hover:bg-nss-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
              {initialData ? "Update Coupon" : "Create Coupon"}
            </Button>
            <Link href="/coupons" className="w-full">
              <Button variant="ghost" className="w-full">
                <ArrowLeft size={16} className="mr-2" /> Back to List
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </form>
  )
}
