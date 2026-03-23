import { createServerClient } from "@nss/db/client"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { BrandForm } from "../../_components/brands/brand-form"
import { Button } from "@nss/ui/components/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServerClient(await cookies())
  
  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .single()

  if (!brand) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/brands">
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-nss-text-primary">Edit Brand</h1>
      </div>

      <BrandForm initialData={brand as any} />
    </div>
  )
}
