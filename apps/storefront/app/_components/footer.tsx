import Link from "next/link";
import type { Locale } from "@/lib/i18n";

import { getSetting } from "@nss/db/queries";

interface FooterProps {
  locale: Locale;
}

import { 
  IconBrandInstagram, 
  IconBrandWhatsapp, 
  IconBrandTiktok,
  IconStar
} from "@tabler/icons-react";

export default async function Footer({ locale }: FooterProps) {
  const isAr = locale === "ar";
  const storeInfo = await getSetting("store_info");

  const crNumber = storeInfo?.cr_number || "[CR NUMBER]";
  const storeName = isAr ? storeInfo?.store_name_ar || "نيو ستار" : storeInfo?.store_name_en || "NewStar";
  const tagline = isAr ? storeInfo?.tagline_ar || "وجهتك للألعاب في الكويت" : storeInfo?.tagline_en || "Kuwait's home for toys";

  return (
    <footer className="bg-zinc-950 text-white mt-auto border-t border-white/5">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <IconStar size={24} className="text-white" fill="currentColor" />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-black tracking-tighter">{storeName}</span>
                <span className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em]">Sports</span>
              </div>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              {tagline}
            </p>
            <div className="flex gap-3">
              {storeInfo?.instagram_url && (
                <a href={storeInfo.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group" aria-label="Instagram">
                  <IconBrandInstagram size={20} className="text-white/70 group-hover:text-white" />
                </a>
              )}
              {storeInfo?.whatsapp_number && (
                <a href={`https://wa.me/${storeInfo.whatsapp_number.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-success hover:border-success transition-all group" aria-label="WhatsApp">
                  <IconBrandWhatsapp size={20} className="text-white/70 group-hover:text-white" />
                </a>
              )}
              {storeInfo?.tiktok_url && (
                <a href={storeInfo.tiktok_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:border-white transition-all group" aria-label="TikTok">
                  <IconBrandTiktok size={20} className="text-white/70 group-hover:text-zinc-950" />
                </a>
              )}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">{isAr ? "تسوق" : "Shop"}</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href={`/${locale}/products`} className="text-white/60 hover:text-primary transition-colors">{isAr ? "جميع المنتجات" : "All Products"}</Link></li>
              <li><Link href={`/${locale}/products?sort=new`} className="text-white/60 hover:text-primary transition-colors">{isAr ? "وصل حديثاً" : "New Arrivals"}</Link></li>
              <li><Link href={`/${locale}/products?sale=true`} className="text-white/60 hover:text-accent transition-colors">{isAr ? "تخفيضات" : "Sale"}</Link></li>
              <li><Link href={`/${locale}/brand/lego`} className="text-white/60 hover:text-primary transition-colors">LEGO</Link></li>
              <li><Link href={`/${locale}/brand/barbie`} className="text-white/60 hover:text-primary transition-colors">Barbie</Link></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">{isAr ? "مساعدة" : "Help"}</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href={`/${locale}/faq`} className="text-white/60 hover:text-primary transition-colors">{isAr ? "الأسئلة الشائعة" : "FAQ"}</Link></li>
              <li><Link href={`/${locale}/contact`} className="text-white/60 hover:text-primary transition-colors">{isAr ? "تواصل معنا" : "Contact Us"}</Link></li>
              <li><Link href={`/${locale}/delivery-info`} className="text-white/60 hover:text-primary transition-colors">{isAr ? "معلومات التوصيل" : "Delivery Info"}</Link></li>
              <li><Link href={`/${locale}/returns-policy`} className="text-white/60 hover:text-primary transition-colors">{isAr ? "سياسة الإرجاع" : "Returns Policy"}</Link></li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">{isAr ? "قانوني" : "Legal"}</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href={`/${locale}/privacy`} className="text-white/60 hover:text-primary transition-colors">{isAr ? "سياسة الخصوصية" : "Privacy Policy"}</Link></li>
              <li><Link href={`/${locale}/terms`} className="text-white/60 hover:text-primary transition-colors">{isAr ? "الشروط والأحكام" : "Terms & Conditions"}</Link></li>
            </ul>
            {/* Payment Icons */}
            <div className="mt-8 pt-8 border-t border-white/5">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest block mb-4">{isAr ? "طرق الدفع الآمنة" : "Secure Payments"}</span>
              <div className="flex gap-2 flex-wrap opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                {["KNET", "VISA", "MC", "Apple Pay"].map((pm) => (
                  <div key={pm} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black tracking-tighter">
                    {pm}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-black/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-medium text-white/30 uppercase tracking-wider">
                <p>© 2025 {storeName}. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
                <div className="flex items-center gap-4">
                     <p className="bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        {isAr 
                        ? `سجل تجاري: ${crNumber}` 
                        : `CR: ${crNumber}`}
                    </p>
                    <span className="hidden md:block w-1 h-1 rounded-full bg-white/10" />
                    <p>{isAr ? "الكويت" : "Kuwait"}</p>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
}
