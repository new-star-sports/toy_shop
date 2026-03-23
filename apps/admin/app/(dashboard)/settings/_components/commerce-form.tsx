"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@nss/ui/components/button"
import { Input } from "@nss/ui/components/input"
import { Label } from "@nss/ui/components/label"
import { Switch } from "@nss/ui/components/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@nss/ui/components/card"
import { toast } from "sonner"
import { saveShippingSettingsAction, saveLoyaltySettingsAction } from "../_actions"
import { Loader2, Truck, Coins, Save } from "lucide-react"

interface CommerceFormProps {
  shipping?: any
  loyalty?: any
}

export function CommerceForm({ shipping, loyalty }: CommerceFormProps) {
  const [isShipSubmitting, setIsShipSubmitting] = useState(false)
  const [isLoySubmitting, setIsLoySubmitting] = useState(false)

  // -- Shipping Form --
  const shipForm = useForm({
    defaultValues: shipping || {
      standard_rate_kwd: 2.000,
      express_rate_kwd: 3.500,
      sameday_rate_kwd: 5.000,
      standard_days: 3,
      express_days: 1,
      sameday_cutoff: "14:00",
      free_delivery_threshold_kwd: 10.000
    }
  })

  // -- Loyalty Form --
  const loyForm = useForm({
    defaultValues: loyalty || {
      enabled: false,
      points_per_kwd: 10,
      kwd_per_100_points: 1.000,
      min_points_to_redeem: 500,
      points_expiry_months: 12
    }
  })

  const onSaveShipping = async (values: any) => {
    setIsShipSubmitting(true)
    const result = await saveShippingSettingsAction(values)
    setIsShipSubmitting(false)
    if (result.success) toast.success("Shipping rates updated")
    else toast.error(result.error || "Failed to save")
  }

  const onSaveLoyalty = async (values: any) => {
    setIsLoySubmitting(true)
    const result = await saveLoyaltySettingsAction(values)
    setIsLoySubmitting(false)
    if (result.success) toast.success("Loyalty settings updated")
    else toast.error(result.error || "Failed to save")
  }

  return (
    <div className="space-y-8">
      {/* ── Shipping Rates ── */}
      <Card className="border-nss-border shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-nss-primary" /> Delivery Rates & Rules
          </CardTitle>
          <CardDescription>Control shipping costs and free delivery thresholds for Kuwait.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={shipForm.handleSubmit(onSaveShipping)} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label>Standard Rate (KWD)</Label>
                  <Input type="number" step="0.001" {...shipForm.register("standard_rate_kwd")} />
                </div>
                <div className="space-y-2">
                  <Label>Express Rate (KWD)</Label>
                  <Input type="number" step="0.001" {...shipForm.register("express_rate_kwd")} />
                </div>
                <div className="space-y-2">
                  <Label>Same-Day Rate (KWD)</Label>
                  <Input type="number" step="0.001" {...shipForm.register("sameday_rate_kwd")} />
                </div>
                <div className="space-y-2 bg-nss-primary/5 p-3 rounded border border-nss-primary/10">
                  <Label className="text-nss-primary font-bold text-xs uppercase letter-spacing-wider">Free Delivery Above (KWD)</Label>
                  <Input type="number" step="0.001" {...shipForm.register("free_delivery_threshold_kwd")} className="border-nss-primary/20" />
                </div>
             </div>

             <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isShipSubmitting} className="bg-nss-primary min-w-[120px]">
                {isShipSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Rates
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Loyalty Programme ── */}
      <Card className="border-nss-border shadow-none">
        <CardHeader className="flex flex-row items-center justify-between border-b border-nss-border pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-nss-primary" /> Loyalty Points
            </CardTitle>
            <CardDescription>Reward customers for their purchases and engagement.</CardDescription>
          </div>
          <Switch 
            checked={loyForm.watch("enabled")} 
            onCheckedChange={(val) => loyForm.setValue("enabled", val)}
          />
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={loyForm.handleSubmit(onSaveLoyalty)} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80" style={{ pointerEvents: loyForm.watch("enabled") ? "auto" : "none", opacity: loyForm.watch("enabled") ? 1 : 0.5 }}>
                <div className="space-y-2">
                  <Label>Points Earned per 1 KWD Spent</Label>
                  <Input type="number" {...loyForm.register("points_per_kwd")} />
                  <p className="text-[10px] text-nss-text-secondary">E.g. 10 points for every 1.000 KWD order.</p>
                </div>
                <div className="space-y-2">
                  <Label>Redemption Value (KWD per 100 points)</Label>
                  <Input type="number" step="0.001" {...loyForm.register("kwd_per_100_points")} />
                  <p className="text-[10px] text-nss-text-secondary">E.g. 1.000 KWD discount for 100 points.</p>
                </div>
             </div>

             <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoySubmitting} className="bg-nss-primary min-w-[120px]">
                {isLoySubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Loyalty Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
