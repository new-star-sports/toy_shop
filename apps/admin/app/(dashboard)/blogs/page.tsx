import { Suspense } from "react"
import { Metadata } from "next"
import Link from "next/link"
import { getBlogs, type Blog } from "@nss/db/queries"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui"
import { IconPlus, IconSearch, IconFileText, IconEdit, IconCalendar } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

export const metadata: Metadata = {
  title: "Blog Posts | Admin",
}

export default async function BlogListPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <IconFileText size={26} className="text-primary" stroke={1.5} />
            Blog System
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create and manage articles, toy reviews, and store news.</p>
        </div>
        <Button asChild className="flex items-center gap-2">
          <Link href="/blogs/new">
            <IconPlus size={16} stroke={2} />
            New Article
          </Link>
        </Button>
      </div>

      <Suspense fallback={<BlogListSkeleton />}>
        <BlogList />
      </Suspense>
    </div>
  )
}

async function BlogList() {
  const blogs = await getBlogs()

  return (
    <>
      {/* Search */}
      <Card className="rounded-2xl border-border/50">
        <CardContent className="p-3 sm:p-4">
          <div className="relative w-full sm:max-w-sm">
            <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" stroke={1.5} />
            <Input placeholder="Search articles..." className="pl-10 h-10 rounded-xl w-full" />
          </div>
        </CardContent>
      </Card>

      {blogs.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border">
          <IconFileText className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No articles found</h3>
          <p className="text-muted-foreground mb-6 text-sm">Start by creating your first blog post.</p>
          <Button variant="outline" asChild className="rounded-xl font-bold hover:bg-muted/80 transition-colors">
            <Link href="/blogs/new">Create Initial Post</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <Card className="hidden md:block rounded-2xl border-border/50 overflow-hidden bg-card">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/30 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-widest">Article</th>
                  <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-widest">Published At</th>
                  <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {blogs.map((blog: Blog) => (
                  <tr key={blog.id} className="hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {blog.image_url ? (
                          <img src={blog.image_url} alt={blog.title_en} className="h-10 w-16 object-cover rounded-lg bg-muted/30 shrink-0" />
                        ) : (
                          <div className="h-10 w-16 bg-muted/30 rounded-lg flex items-center justify-center shrink-0">
                            <IconFileText className="h-5 w-5 text-muted-foreground/40" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground line-clamp-1">{blog.title_en}</p>
                          <p className="text-xs text-muted-foreground font-mono truncate">{blog.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {blog.category ? (
                        <Badge variant="outline" className="font-semibold border-primary/20 text-primary text-[10px]">{blog.category.name_en}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {blog.is_published ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 text-[10px] font-bold border-none">Published</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100/80 text-[10px] font-bold border-none">Draft</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">
                      {blog.published_at ? format(new Date(blog.published_at), "MMM d, yyyy") : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted/80 transition-colors" asChild>
                        <Link href={`/blogs/${blog.id}`}>
                          <IconEdit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Mobile card list */}
          <div className="md:hidden space-y-3">
            {blogs.map((blog: Blog) => (
              <Card key={blog.id} className="rounded-2xl border-border/40 overflow-hidden bg-card">
                <div className="flex gap-0">
                  {blog.image_url ? (
                    <img src={blog.image_url} alt={blog.title_en} className="w-20 h-full object-cover shrink-0 rounded-l-2xl" />
                  ) : (
                    <div className="w-20 bg-muted/30 flex items-center justify-center rounded-l-2xl shrink-0">
                      <IconFileText className="h-6 w-6 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="flex-1 p-3 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm line-clamp-2 leading-tight">{blog.title_en}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {blog.is_published ? (
                            <Badge className="bg-emerald-100 text-emerald-700 text-[9px] font-bold border-none h-4 px-1.5">Published</Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-700 text-[9px] font-bold border-none h-4 px-1.5">Draft</Badge>
                          )}
                          {blog.category && (
                            <Badge variant="outline" className="text-primary border-primary/20 text-[9px] font-bold h-4 px-1.5">{blog.category.name_en}</Badge>
                          )}
                          {blog.published_at && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              <IconCalendar size={10} stroke={1.5} />
                              {format(new Date(blog.published_at), "MMM d, yyyy")}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shrink-0 hover:bg-muted/80 transition-colors" asChild>
                        <Link href={`/blogs/${blog.id}`}>
                          <IconEdit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  )
}

function BlogListSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-14 bg-muted/20 rounded-2xl w-full" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 bg-muted/10 rounded-2xl w-full" />
      ))}
    </div>
  )
}
