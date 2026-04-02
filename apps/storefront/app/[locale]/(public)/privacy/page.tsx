import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for NewStarSports storefront.",
};

export default async function PrivacyPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = (await params) as { locale: Locale };
  const isAr = locale === "ar";

  const content = {
    en: {
      title: "Privacy Policy",
      intro: "Your privacy is important to us. This Privacy Policy explains how NewStarSports collects, uses, and protects your information.",
      sections: [
        {
          title: "1. Information Collection",
          text: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact our support team.",
        },
        {
          title: "2. How We Use Information",
          text: "We use the information we collect to process your orders, communicate with you, improve our services, and provide personalized recommendations.",
        },
        {
          title: "3. Information Sharing",
          text: "We do not sell your personal information to third parties. We may share data with service providers who help us operate our business (e.g., shipping companies).",
        },
        {
          title: "4. Data Security",
          text: "We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your data.",
        },
        {
          title: "5. Cookies",
          text: "We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction.",
        },
      ],
    },
    ar: {
      title: "سياسة الخصوصية",
      intro: "خصوصيتك تهمنا. توضح سياسة الخصوصية هذه كيف تقوم نيو ستار سبورتس بجمع معلوماتك واستخدامها وحمايتها.",
      sections: [
        {
          title: "1. جمع المعلومات",
          text: "نقوم بجمع المعلومات التي تقدمها لنا مباشرة، مثل عندما تفتح حساباً، أو تقوم بعملية شراء، أو تتصل بفريق الدعم لدينا.",
        },
        {
          title: "2. كيف نستخدم المعلومات",
          text: "نستخدم المعلومات التي نجمعها لمعالجة طلباتك، والتواصل معك، وتحسين خدماتنا، وتقديم توصيات مخصصة لك.",
        },
        {
          title: "3. مشاركة المعلومات",
          text: "نحن لا نبيع معلوماتك الشخصية لأطراف ثالثة. قد نشارك البيانات مع مزودي الخدمة الذين يساعدوننا في تشغيل أعمالنا (مثل شركات الشحن).",
        },
        {
          title: "4. أمن البيانات",
          text: "نحن ننفذ مجموعة متنوعة من الإجراءات الأمنية للحفاظ على سلامة معلوماتك الشخصية عند تقديم طلب أو إدخال معلوماتك أو الوصول إليها.",
        },
        {
          title: "5. ملفات تعريف الارتباط (Cookies)",
          text: "نستخدم ملفات تعريف الارتباط لفهم وتخزين تفضيلاتك للزيارات المستقبلية وجمع بيانات مجمعة حول حركة المرور في الموقع والتفاعل معه.",
        },
      ],
    },
  };

  const current = content[locale] || content.en;

  return (
    <div className="container max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/40 p-8 sm:p-12 shadow-xl">
        <h1 className="text-3xl sm:text-4xl font-black mb-8 text-center text-primary">
          {current.title}
        </h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed mb-8 opacity-80">
            {current.intro}
          </p>

          <div className="space-y-10">
            {current.sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="text-xl font-bold text-foreground">
                  {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {section.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-border/30 text-sm text-muted-foreground text-center">
            {isAr 
              ? "آخر تحديث: أبريل 2026" 
              : "Last updated: April 2026"
            }
          </div>
        </div>
      </div>
    </div>
  );
}
