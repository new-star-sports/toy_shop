import { getBlogById, getBlogCategories } from "@nss/db/queries"
import { BlogForm } from "../_components/blog-form"
import { notFound } from "next/navigation"

interface EditBlogPageProps {
  params: Promise<{ id: string }>
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params
  const [blog, categories] = await Promise.all([
    getBlogById(id),
    getBlogCategories()
  ])

  if (!blog) {
    notFound()
  }

  return (
    <div className="container mx-auto">
      <BlogForm initialData={blog} categories={categories} />
    </div>
  )
}
