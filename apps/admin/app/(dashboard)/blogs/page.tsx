import { Metadata } from "next"
import Link from "next/link"
import { getBlogs, type Blog } from "@nss/db/queries"
import { Button } from "@nss/ui/components/button"
import { Badge } from "@nss/ui/components/badge"
import { Plus, Search, FileText, Edit, Trash2 } from "lucide-react"
import { Input } from "@nss/ui/components/input"
import { format } from "date-fns"

export const metadata: Metadata = {
  title: "Blog Posts | NSS Admin",
}

export default async function BlogListPage() {
  const blogs = await getBlogs()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nss-text-primary flex items-center gap-2">
            <FileText className="h-6 w-6 text-nss-primary" /> Blog System
          </h1>
          <p className="text-nss-text-secondary">Create and manage articles, toy reviews, and store news.</p>
        </div>
        <Link href="/blogs/new">
          <Button className="bg-nss-primary hover:bg-nss-primary/90">
            <Plus className="h-4 w-4 mr-2" /> New Article
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-nss-surface p-4 rounded-lg border border-nss-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nss-text-secondary" />
          <Input 
            placeholder="Search articles..." 
            className="pl-9 h-9"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-nss-surface rounded-xl border border-dashed border-nss-border">
            <FileText className="h-12 w-12 text-nss-text-secondary/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-nss-text-primary">No articles found</h3>
            <p className="text-nss-text-secondary mb-6">Start by creating your first blog post.</p>
            <Link href="/blogs/new">
              <Button variant="outline">Create Initial Post</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-nss-border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-nss-surface text-nss-text-secondary border-b border-nss-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Article</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Published At</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nss-border">
                {blogs.map((blog: Blog) => (
                  <tr key={blog.id} className="hover:bg-nss-surface/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {blog.image_url ? (
                          <img 
                            src={blog.image_url} 
                            alt={blog.title_en} 
                            className="h-10 w-16 object-cover rounded bg-nss-surface"
                          />
                        ) : (
                          <div className="h-10 w-16 bg-nss-surface rounded flex items-center justify-center">
                            <FileText className="h-5 w-5 text-nss-text-secondary/40" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-nss-text-primary line-clamp-1">{blog.title_en}</p>
                          <p className="text-xs text-nss-text-secondary font-mono">{blog.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {blog.category ? (
                        <Badge variant="outline" className="font-normal border-nss-primary/20 text-nss-primary">
                          {blog.category.name_en}
                        </Badge>
                      ) : (
                        <span className="text-nss-text-secondary">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {blog.is_published ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100/80">Published</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100/80">Draft</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-nss-text-secondary">
                      {blog.published_at ? format(new Date(blog.published_at), "MMM d, yyyy") : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/blogs/${blog.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
