"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface SearchOverlayProps {
  locale: Locale;
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ locale, open, onClose }: SearchOverlayProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIsNavigating(false);
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setIsNavigating(true);
    onClose();
    router.push(`/${locale}/search?q=${encodeURIComponent(q)}`);
  }

  const quickLinks = [
    { label: isAr ? "ألعاب أطفال" : "Kids Toys", q: "kids toys" },
    { label: isAr ? "ألعاب تعليمية" : "Educational", q: "educational" },
    { label: isAr ? "ألعاب رياضية" : "Sports", q: "sports" },
    { label: isAr ? "ألعاب إلكترونية" : "Electronic", q: "electronic" },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-b-[2rem] shadow-2xl z-10 animate-in slide-in-from-top-2 duration-200">
        {/* Header row */}
        <div className="flex items-center gap-3 p-4 border-b border-border/30">
          <Search className="h-5 w-5 text-primary flex-shrink-0" />
          <form onSubmit={handleSearch} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isAr ? "ابحث عن ألعاب، ماركات..." : "Search for toys, brands..."}
              className="w-full h-10 text-base font-medium bg-transparent outline-none text-foreground placeholder:text-muted-foreground/60"
              autoComplete="off"
            />
          </form>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors flex-shrink-0"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick search suggestions */}
        <div className="p-4 space-y-3">
          <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground/60">
            {isAr ? "بحث سريع" : "Quick Search"}
          </p>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((item) => (
              <button
                key={item.q}
                onClick={() => {
                  setIsNavigating(true);
                  onClose();
                  router.push(`/${locale}/search?q=${encodeURIComponent(item.q)}`);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-clay-sky/60 text-clay-sky-deep text-sm font-bold hover:bg-clay-sky transition-all duration-150 active:scale-95"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search CTA */}
        {query.trim() && (
          <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-150">
            <button
              onClick={handleSearch as any}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-[1.25rem] bg-primary text-white font-bold clay-shadow-sky transition-all active:scale-[0.98]"
            >
              <span>{isAr ? `بحث عن "${query}"` : `Search for "${query}"`}</span>
              {isNavigating
                ? <Loader2 className="h-5 w-5 animate-spin" />
                : isAr
                  ? <ArrowLeft className="h-5 w-5" />
                  : <ArrowRight className="h-5 w-5" />
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
