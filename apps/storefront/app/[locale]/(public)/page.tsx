import { Button } from "@nss/ui/components/button";

type Params = Promise<{ locale: string }>;

export default async function HomePage({ params }: { params: Params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center max-w-2xl mx-auto space-y-6">
        {/* Logo placeholder */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-nss-primary flex items-center justify-center">
          <span className="text-3xl text-white font-bold">★</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-semibold text-nss-primary">
          {isArabic ? "نيو ستار سبورتس" : "NewStarSports"}
        </h1>
        <p className="text-lg text-nss-text-secondary">
          {isArabic
            ? "وجهتك للألعاب في الكويت"
            : "Kuwait's home for toys"}
        </p>

        {/* Status */}
        <div className="inline-flex items-center gap-2 rounded-full bg-nss-success/10 px-4 py-2 text-sm text-nss-success">
          <span className="w-2 h-2 rounded-full bg-nss-success animate-pulse" />
          {isArabic ? "المتجر قيد الإنشاء" : "Store coming soon"}
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button variant="default" size="lg">
            {isArabic ? "تسوق الآن" : "Shop Now"}
          </Button>
          <Button variant="accent" size="lg">
            {isArabic ? "عرض التخفيضات" : "View Sale"}
          </Button>
        </div>

        {/* Locale info */}
        <p className="text-xs text-nss-text-secondary mt-8">
          {isArabic ? "اللغة: العربية | الاتجاه: RTL" : `Locale: ${locale} | Direction: LTR`}
        </p>
      </div>
    </main>
  );
}
