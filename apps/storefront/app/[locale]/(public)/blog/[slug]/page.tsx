import { getBlogBySlug } from "@nss/db/queries"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { Calendar, Clock, ChevronLeft, ChevronRight, Share2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui"

interface BlogDetailPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { locale, slug } = await params
  const isAr = locale === "ar"
  const blog = await getBlogBySlug(slug)

  if (!blog || (!blog.is_published)) {
    notFound()
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ── Breadcrumbs ── */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href={`/${locale}`} className="hover:text-primary transition-colors font-bold">
            {isAr ? "الرئيسية" : "Home"}
          </Link>
          <span className="opacity-40">/</span>
          <Link href={`/${locale}/blog`} className="hover:text-primary transition-colors font-bold">
            {isAr ? "المدونة" : "Blog"}
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-foreground font-black line-clamp-1">
            {isAr ? blog.title_ar : blog.title_en}
          </span>
        </nav>

        <article className="clay-shadow-sky rounded-[2rem] bg-white overflow-hidden">
          {/* ── Featured Image ── */}
          {blog.image_url && (
            <div className="aspect-[21/9] overflow-hidden">
              <img
                src={blog.image_url}
                alt={isAr ? blog.title_ar : blog.title_en}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8 lg:p-10">
            {/* ── Header ── */}
            <header className="mb-8">
              {blog.category && (
                <span className="inline-block bg-clay-sky text-clay-sky-deep text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                  {isAr ? blog.category.name_ar : blog.category.name_en}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground leading-tight mb-5">
                {isAr ? blog.title_ar : blog.title_en}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-y border-border/20 py-3">
                <div className="flex items-center gap-1.5 font-bold">
                  <Calendar className="h-3.5 w-3.5" />
                  {blog.published_at ? format(new Date(blog.published_at), "MMMM d, yyyy") : "Draft"}
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <Clock className="h-3.5 w-3.5" />
                  {Math.max(1, Math.ceil(blog.content_en.split(/\s+/).length / 200))} {isAr ? "دقائق للقراءة" : "min read"}
                </div>
              </div>
            </header>

            {/* ── Content ── */}
            <div
              className={`prose prose-base max-w-none prose-headings:font-black prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-img:rounded-2xl ${isAr ? "prose-rtl text-right leading-loose" : "leading-relaxed"}`}
              dangerouslySetInnerHTML={{ __html: isAr ? blog.content_ar : blog.content_en }}
            />

            {/* ── Footer / Share ── */}
            <footer className="mt-10 pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button variant="outline" size="sm" className="rounded-full gap-2 font-bold clay-shadow-white">
                <Share2 className="h-4 w-4" /> {isAr ? "مشاركة" : "Share"}
              </Button>

              <Link
                href={`/${locale}/blog`}
                className="flex items-center gap-1 text-sm font-black text-primary hover:underline"
              >
                {isAr ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                {isAr ? "العودة للمدونة" : "Back to Blog"}
              </Link>
            </footer>
          </div>
        </article>
      </div>
    </div>
  )
}
