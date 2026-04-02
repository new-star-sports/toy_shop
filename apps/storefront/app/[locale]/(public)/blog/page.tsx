import { getBlogs, getBlogCategories, type Blog, type BlogCategory } from "@nss/db/queries"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, Tag, ChevronRight, FileText } from "lucide-react"

interface BlogIndexPageProps {
  params: Promise<{ locale: string }>
}

export default async function BlogIndexPage({ params }: BlogIndexPageProps) {
  const { locale } = await params
  const isAr = locale === "ar"
  
  const [blogs, categories] = await Promise.all([
    getBlogs({ publishedOnly: true }),
    getBlogCategories()
  ])

  return (
    <div className="bg-background min-h-screen">
      {/* ── Hero section ── */}
      <section className="bg-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {isAr ? "مدونة نيو ستار سبورتس" : "NewStarSports Blog"}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {isAr 
              ? "أحدث الأخبار، مراجعات الألعاب، ودليل أولياء الأمور لتنمية مهارات الأطفال." 
              : "Latest news, toy reviews, and parenting guides for child development."}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── Blog Grid ── */}
          <div className="lg:col-span-3 space-y-12">
            {blogs.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-border">
                <FileText className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-foreground">
                  {isAr ? "لا توجد مقالات حالياً" : "No articles yet"}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {isAr ? "عد قريباً لمتابعة أحدث أخبارنا." : "Stay tuned for our latest updates."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogs.map((blog: Blog) => (
                  <article key={blog.id} className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                    <Link href={`/${locale}/blog/${blog.slug}`} className="block relative aspect-video bg-muted overflow-hidden">
                      {blog.image_url ? (
                        <img 
                          src={blog.image_url} 
                          alt={isAr ? blog.title_ar : blog.title_en} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                          <FileText className="h-12 w-12" />
                        </div>
                      )}
                      {blog.category && (
                        <div className={`absolute top-4 ${isAr ? 'right-4' : 'left-4'}`}>
                          <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                            {isAr ? blog.category.name_ar : blog.category.name_en}
                          </span>
                        </div>
                      )}
                    </Link>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {blog.published_at ? format(new Date(blog.published_at), "MMM d, yyyy") : "Draft"}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 leading-snug group-hover:underline">
                        <Link href={`/${locale}/blog/${blog.slug}`}>
                          {isAr ? blog.title_ar : blog.title_en}
                        </Link>
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                        {(isAr ? blog.excerpt_ar : blog.excerpt_en) || (isAr ? blog.title_ar : blog.title_en)}
                      </p>
                      <Link 
                        href={`/${locale}/blog/${blog.slug}`} 
                        className="inline-flex items-center text-sm font-bold text-primary gap-1 group/btn"
                      >
                        {isAr ? "اقرأ المزيد" : "Read More"}
                        <ChevronRight className={`h-4 w-4 transition-transform ${isAr ? 'rotate-180 group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'}`} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-8">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                {isAr ? "التصنيفات" : "Categories"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat: BlogCategory) => (
                  <Link 
                    key={cat.id} 
                    href={`/${locale}/blog?category=${cat.slug}`}
                    className="px-4 py-2 rounded-lg bg-muted border border-border text-sm text-foreground hover:border-primary hover:bg-primary hover:text-white transition-all"
                  >
                    {isAr ? cat.name_ar : cat.name_en}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-xl mb-3">
                {isAr ? "اشترك في نشرتنا" : "Subscribe"}
              </h3>
              <p className="text-white/80 text-sm mb-6">
                {isAr 
                  ? "كن أول من يعرف عن المقالات الجديدة والتخفيضات الحصرية." 
                  : "Be the first to know about new articles and exclusive sales."}
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder={isAr ? "بريدك الإلكتروني" : "Your email address"} 
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button className="w-full bg-white text-primary font-bold py-2.5 rounded-lg text-sm hover:bg-white/90 transition-colors">
                  {isAr ? "اشترك الآن" : "Subscribe Now"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
