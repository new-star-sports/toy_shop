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

  const CARD_SHADOWS = ["clay-shadow-sky", "clay-shadow-mint", "clay-shadow-lavender", "clay-shadow-peach", "clay-shadow-lemon", "clay-shadow-pink"];

  return (
    <div className="min-h-screen">
      {/* ── Hero section ── */}
      <section className="mx-3 sm:mx-4 mt-3 rounded-[2rem] overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, oklch(0.88 0.09 160) 0%, oklch(0.82 0.12 200) 60%, oklch(0.75 0.14 225) 100%)" }}>
        <div className="py-14 sm:py-20 px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/30 rounded-full px-4 py-1.5 text-xs font-black text-white mb-4 backdrop-blur-sm">
            <FileText className="h-3.5 w-3.5" />
            {isAr ? "أحدث المقالات" : "Latest Articles"}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 drop-shadow-sm">
            {isAr ? "مدونة نيو ستار سبورتس" : "NewStarSports Blog"}
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto font-medium">
            {isAr
              ? "أحدث الأخبار، مراجعات الألعاب، ودليل أولياء الأمور لتنمية مهارات الأطفال."
              : "Latest news, toy reviews, and parenting guides for child development."}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ── Blog Grid ── */}
          <div className="lg:col-span-3">
            {blogs.length === 0 ? (
              <div className="text-center py-20 clay-shadow-white rounded-[2rem] bg-white">
                <FileText className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-lg font-black text-foreground">
                  {isAr ? "لا توجد مقالات حالياً" : "No articles yet"}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {isAr ? "عد قريباً لمتابعة أحدث أخبارنا." : "Stay tuned for our latest updates."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {blogs.map((blog: Blog, idx: number) => (
                  <article key={blog.id} className={`group ${CARD_SHADOWS[idx % CARD_SHADOWS.length]} rounded-[2rem] bg-white overflow-hidden clay-hover flex flex-col h-full`}>
                    <Link href={`/${locale}/blog/${blog.slug}`} className="block relative aspect-video bg-muted overflow-hidden rounded-t-[2rem]">
                      {blog.image_url ? (
                        <img
                          src={blog.image_url}
                          alt={isAr ? blog.title_ar : blog.title_en}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-clay-sky/30">
                          <FileText className="h-10 w-10 text-clay-sky-deep/40" />
                        </div>
                      )}
                      {blog.category && (
                        <div className={`absolute top-3 ${isAr ? "right-3" : "left-3"}`}>
                          <span className="bg-white/90 text-primary text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm">
                            {isAr ? blog.category.name_ar : blog.category.name_en}
                          </span>
                        </div>
                      )}
                    </Link>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Calendar className="h-3 w-3" />
                        {blog.published_at ? format(new Date(blog.published_at), "MMM d, yyyy") : "Draft"}
                      </div>
                      <h3 className="text-base font-black text-foreground mb-2 line-clamp-2 leading-snug">
                        <Link href={`/${locale}/blog/${blog.slug}`} className="hover:text-primary transition-colors">
                          {isAr ? blog.title_ar : blog.title_en}
                        </Link>
                      </h3>
                      <p className="text-muted-foreground text-xs line-clamp-2 mb-4 flex-1">
                        {(isAr ? blog.excerpt_ar : blog.excerpt_en) || ""}
                      </p>
                      <Link
                        href={`/${locale}/blog/${blog.slug}`}
                        className="inline-flex items-center text-xs font-black text-primary gap-1 group/btn self-start"
                      >
                        {isAr ? "اقرأ المزيد" : "Read More"}
                        <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isAr ? "rotate-180 group-hover/btn:-translate-x-1" : "group-hover/btn:translate-x-1"}`} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-5">
            {categories.length > 0 && (
              <div className="clay-shadow-lavender rounded-[2rem] bg-white p-5">
                <h3 className="font-black text-foreground mb-4 flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 rounded-lg bg-clay-lavender flex items-center justify-center">
                    <Tag className="h-3 w-3 text-clay-lavender-deep" />
                  </span>
                  {isAr ? "التصنيفات" : "Categories"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat: BlogCategory) => (
                    <Link
                      key={cat.id}
                      href={`/${locale}/blog?category=${cat.slug}`}
                      className="px-3 py-1.5 rounded-full bg-clay-lavender/40 text-clay-lavender-deep text-xs font-black hover:bg-clay-lavender transition-all"
                    >
                      {isAr ? cat.name_ar : cat.name_en}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="clay-shadow-peach rounded-[2rem] overflow-hidden"
              style={{ background: "linear-gradient(135deg, oklch(0.88 0.10 30) 0%, oklch(0.80 0.14 25) 100%)" }}>
              <div className="p-6 text-white">
                <h3 className="font-black text-lg mb-2">
                  {isAr ? "اشترك في نشرتنا" : "Subscribe"}
                </h3>
                <p className="text-white/80 text-xs mb-4 leading-relaxed">
                  {isAr
                    ? "كن أول من يعرف عن المقالات الجديدة والتخفيضات الحصرية."
                    : "Be the first to know about new articles and exclusive sales."}
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder={isAr ? "بريدك الإلكتروني" : "Your email"}
                    className="w-full bg-white/20 border border-white/30 rounded-2xl px-4 py-2.5 text-sm placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 text-white"
                  />
                  <button className="w-full bg-white text-clay-peach-deep font-black py-2.5 rounded-2xl text-sm hover:bg-white/90 transition-all active:scale-[0.98]">
                    {isAr ? "اشترك الآن" : "Subscribe Now"}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
