import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using NewStarSports storefront.",
};

export default async function TermsPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = (await params) as { locale: Locale };
  const isAr = locale === "ar";

  const content = {
    en: {
      title: "Terms & Conditions",
      intro: "Welcome to NewStarSports. By accessing this website, you agree to these terms and conditions.",
      sections: [
        {
          title: "1. Acceptance of Terms",
          text: "By using our services, you agree to follow and be bound by these terms. If you do not agree, please do not use our site.",
        },
        {
          title: "2. User Accounts",
          text: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.",
        },
        {
          title: "3. Product Information",
          text: "We attempt to be as accurate as possible with product descriptions. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free.",
        },
        {
          title: "4. Pricing & Availability",
          text: "All prices are subject to change without notice. We reserve the right to limit the quantity of items purchased per person or per order.",
        },
        {
          title: "5. Intellectual Property",
          text: "All content included on this site, such as text, graphics, logos, and images, is the property of NewStarSports and protected by international copyright laws.",
        },
      ],
    },
    ar: {
      title: "الشروط والأحكام",
      intro: "مرحباً بكم في نيو ستار سبورتس. من خلال الوصول إلى هذا الموقع، فإنك توافق على هذه الشروط والأحكام.",
      sections: [
        {
          title: "1. قبول الشروط",
          text: "باستخدام خدماتنا، فإنك توافق على اتباع هذه الشروط والالتزام بها. إذا كنت لا توافق، يرجى عدم استخدام موقعنا.",
        },
        {
          title: "2. حسابات المستخدمين",
          text: "أنت مسؤول عن الحفاظ على سرية حسابك وكلمة مرورك. وتوافق على قبول المسؤولية عن جميع الأنشطة التي تحدث تحت حسابك.",
        },
        {
          title: "3. معلومات المنتج",
          text: "نحن نحاول أن نكون دقيقين قدر الإمكان في وصف المنتج. ومع ذلك، لا نضمن أن تكون أوصاف المنتج أو المحتويات الأخرى دقيقة أو كاملة أو خالية من الأخطاء.",
        },
        {
          title: "4. التسعير والتوافر",
          text: "جميع الأسعار عرضة للتغيير دون إشعار مسبق. نحن نحتفظ بالحق في تحديد كمية العناصر المشتراة لكل شخص أو لكل طلب.",
        },
        {
          title: "5. الملكية الفكرية",
          text: "جميع المحتويات المدرجة في هذا الموقع، مثل النصوص والرسومات والشعارات والصور، هي ملك لـ نيو ستار سبورتس ومحمية بموجب قوانين حقوق النشر الدولية.",
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
