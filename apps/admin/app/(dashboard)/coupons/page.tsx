import Link from "next/link"
import { getAdminCoupons } from "@nss/db/queries"
import { CouponList } from "./_components/coupon-list"
import { Button } from "@nss/ui/components/button"
import { IconPlus } from "@tabler/icons-react"

export default async function CouponsPage() {
  const coupons = await getAdminCoupons()

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Coupons</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage discount codes and promotions.</p>
        </div>
        <Button asChild className="w-full sm:w-auto rounded-full px-5 bg-primary text-white shadow-lg shadow-primary/20">
          <Link href="/coupons/new" className="flex flex-row items-center justify-center gap-2">
            <IconPlus className="h-4 w-4" stroke={3} /> <span className="font-bold">Create Coupon</span>
          </Link>
        </Button>
      </div>

      <CouponList initialCoupons={coupons as any} />
    </div>
  )
}
