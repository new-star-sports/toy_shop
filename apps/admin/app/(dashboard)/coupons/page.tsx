import Link from "next/link"
import { getAdminCoupons } from "@nss/db/queries"
import { CouponList } from "./_components/coupon-list"
import { Button } from "@nss/ui/components/button"
import { Plus } from "lucide-react"

export default async function CouponsPage() {
  const coupons = await getAdminCoupons()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nss-text-primary">Coupons</h1>
          <p className="text-nss-text-secondary">Manage discount codes and promotions.</p>
        </div>
        <Link href="/coupons/new">
          <Button className="bg-nss-primary hover:bg-nss-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Create Coupon
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <CouponList initialCoupons={coupons as any} />
      </div>
    </div>
  )
}
