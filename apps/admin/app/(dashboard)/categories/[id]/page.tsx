import { createServerClient } from "@nss/db/client"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { getCategories } from "@nss/db/queries"
import { CategoryForm } from "../../_components/categories/category-form"
import { Button } from "@nss/ui/components/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServerClient(await cookies())
  
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single()

  if (!category) {
    notFound()
  }

  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/categories">
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Edit Category</h1>
      </div>

      <CategoryForm initialData={category as any} categories={categories} />
    </div>
  )
}
