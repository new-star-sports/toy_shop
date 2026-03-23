import { getBlogCategories } from "@nss/db/queries"
import { BlogForm } from "../_components/blog-form"

export default async function NewBlogPage() {
  const categories = await getBlogCategories()

  return (
    <div className="container mx-auto">
      <BlogForm categories={categories} />
    </div>
  )
}
