"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export function SearchBar({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative group w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={isAr ? "ابحث عن ألعاب..." : "Search for toys..."}
        className="w-full h-11 pl-12 pr-12 rtl:pr-12 rtl:pl-12 rounded-2xl border-2 border-nss-border/50 bg-nss-surface text-sm font-medium focus:outline-none focus:ring-4 focus:ring-nss-primary/10 focus:border-nss-primary transition-all duration-300 group-hover:border-nss-primary/30"
      />
      <div className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 text-nss-text-secondary group-focus-within:text-nss-primary transition-colors">
        <SearchIcon className="h-5 w-5" />
      </div>
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-4 rtl:left-4 rtl:right-auto top-1/2 -translate-y-1/2 text-nss-text-secondary hover:text-nss-primary transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
