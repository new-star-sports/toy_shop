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
    <div className="bg-background min-h-screen pb-20">
      {/* ── Breadcrumbs ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href={`/${locale}`} className="hover:text-primary transition-colors">
            {isAr ? "الرئيسية" : "Home"}
          </Link>
          <span className="opacity-50">/</span>
          <Link href={`/${locale}/blog`} className="hover:text-primary transition-colors">
            {isAr ? "المدونة" : "Blog"}
          </Link>
          <span className="opacity-50">/</span>
          <span className="text-foreground line-clamp-1">
            {isAr ? blog.title_ar : blog.title_en}
          </span>
        </nav>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <header className="mb-8">
          {blog.category && (
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              {isAr ? blog.category.name_ar : blog.category.name_en}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6">
            {isAr ? blog.title_ar : blog.title_en}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y border-border py-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {blog.published_at ? format(new Date(blog.published_at), "MMMM d, yyyy") : "Draft"}
            </div>
            {/* Estimate reading time: ~200 words per minute */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {Math.max(1, Math.ceil(blog.content_en.split(/\s+/).length / 200))} {isAr ? "دقائق للقراءة" : "min read"}
            </div>
          </div>
        </header>

        {/* ── Featured Image ── */}
        {blog.image_url && (
          <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-12 shadow-xl ring-1 ring-border">
            <img 
              src={blog.image_url} 
              alt={isAr ? blog.title_ar : blog.title_en} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* ── Content ── */}
        <div 
          className={`prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-img:rounded-2xl ${isAr ? 'prose-rtl text-right font-arabic leading-loose tracking-normal' : 'leading-relaxed'}`}
          dangerouslySetInnerHTML={{ __html: isAr ? blog.content_ar : blog.content_en }}
        />

        {/* ── Footer / Share ── */}
        <footer className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="rounded-full gap-2">
              <Share2 className="h-4 w-4" /> {isAr ? "مشاركة" : "Share"}
            </Button>
          </div>
          
          <div className={`flex items-center gap-2 text-sm font-bold text-primary ${isAr ? 'flex-row-reverse' : ''}`}>
            <Link href={`/${locale}/blog`} className="hover:underline flex items-center gap-1">
              {isAr ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              {isAr ? "العودة للمدونة" : "Back to Blog"}
            </Link>
          </div>
        </footer>
      </article>
    </div>
  )
}
