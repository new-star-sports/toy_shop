import { getAdminCouponById } from "@nss/db/queries"
import { CouponForm } from "../_components/coupon-form"
import { notFound } from "next/navigation"

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  if (id === "new") {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nss-text-primary">New Coupon</h1>
          <p className="text-nss-text-secondary">Create a new discount code for your customers.</p>
        </div>
        <CouponForm />
      </div>
    )
  }

  const coupon = await getAdminCouponById(id)
  if (!coupon) notFound()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nss-text-primary">Edit Coupon</h1>
        <p className="text-nss-text-secondary">Update your coupon settings and restrictions.</p>
      </div>
      <CouponForm initialData={coupon as any} />
    </div>
  )
}
