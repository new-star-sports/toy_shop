"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  Tag,
  Heart,
  BookOpen,
  Package,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

export interface SearchAction {
  id: string;
  label: string;
  labelAr?: string;
  icon: React.ReactNode;
  description?: string;
  href: string;
}

function useDebounce<T>(value: T, delay = 200): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function getQuickActions(locale: Locale): SearchAction[] {
  return [
    {
      id: "shop",
      label: "Shop All Products",
      labelAr: "تسوق جميع المنتجات",
      icon: <ShoppingBag className="h-4 w-4 text-sky-500" />,
      description: "Browse everything",
      href: `/${locale}/products`,
    },
    {
      id: "new",
      label: "New Arrivals",
      labelAr: "وصل حديثاً",
      icon: <Sparkles className="h-4 w-4 text-purple-500" />,
      description: "Just landed",
      href: `/${locale}/products?sort=new`,
    },
    {
      id: "sale",
      label: "Sale & Offers",
      labelAr: "العروض والتخفيضات",
      icon: <Tag className="h-4 w-4 text-orange-500" />,
      description: "Best deals",
      href: `/${locale}/products?sale=true`,
    },
    {
      id: "wishlist",
      label: "My Wishlist",
      labelAr: "قائمة الأمنيات",
      icon: <Heart className="h-4 w-4 text-red-500" />,
      description: "Saved items",
      href: `/${locale}/account/wishlist`,
    },
    {
      id: "orders",
      label: "Track My Order",
      labelAr: "تتبع طلبي",
      icon: <Truck className="h-4 w-4 text-green-500" />,
      description: "Order status",
      href: `/${locale}/account/orders`,
    },
    {
      id: "blog",
      label: "Blog & Tips",
      labelAr: "المدونة والنصائح",
      icon: <BookOpen className="h-4 w-4 text-blue-500" />,
      description: "Toy guides",
      href: `/${locale}/blog`,
    },
    {
      id: "products-page",
      label: "Browse Categories",
      labelAr: "تصفح الفئات",
      icon: <Package className="h-4 w-4 text-violet-500" />,
      description: "By category",
      href: `/${locale}/products`,
    },
  ];
}

interface ActionSearchBarProps {
  locale: Locale;
  className?: string;
}

const container = {
  hidden: { opacity: 0, height: 0 },
  show: {
    opacity: 1,
    height: "auto",
    transition: { height: { duration: 0.25 }, staggerChildren: 0.04 },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { height: { duration: 0.2 }, opacity: { duration: 0.15 } },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

export function ActionSearchBar({ locale, className }: ActionSearchBarProps) {
  const router = useRouter();
  const isAr = locale === "ar";
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 200);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const quickActions = getQuickActions(locale);

  const filteredActions = debouncedQuery
    ? quickActions.filter((a) =>
        (isAr ? a.labelAr ?? a.label : a.label)
          .toLowerCase()
          .includes(debouncedQuery.toLowerCase())
      )
    : quickActions;

  const handleSelect = (action: SearchAction) => {
    setQuery("");
    setIsFocused(false);
    router.push(action.href);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
      setIsFocused(false);
      setQuery("");
    }
  };

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      {/* Input */}
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={isAr ? "ابحث عن ألعاب، ماركات..." : "Search toys, brands..."}
            className="w-full h-9 pl-9 pr-9 rtl:pr-9 rtl:pl-9 rounded-full border border-white/60 bg-white/90 backdrop-blur-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-white transition-all duration-200 shadow-sm"
          />
          {/* Left icon */}
          <div className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 pointer-events-none">
            <AnimatePresence mode="popLayout">
              {query.length > 0 ? (
                <motion.span
                  key="send"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Send className="h-4 w-4 text-primary" />
                </motion.span>
              ) : (
                <motion.span
                  key="search"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </form>

      {/* Dropdown */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-border rounded-xl shadow-lg overflow-hidden"
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <motion.ul className="py-1">
              {filteredActions.length > 0 ? (
                filteredActions.map((action) => (
                  <motion.li
                    key={action.id}
                    variants={item}
                    layout
                    className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-sky-50 transition-colors"
                    onMouseDown={() => handleSelect(action)}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="shrink-0">{action.icon}</span>
                      <span className="text-sm font-medium text-foreground">
                        {isAr ? action.labelAr ?? action.label : action.label}
                      </span>
                      {action.description && (
                        <span className="text-xs text-muted-foreground hidden sm:inline">
                          {action.description}
                        </span>
                      )}
                    </div>
                    <Search className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                  </motion.li>
                ))
              ) : (
                <motion.li variants={item} className="px-3 py-3 text-sm text-muted-foreground text-center">
                  {isAr ? "لا نتائج" : "No results"}
                </motion.li>
              )}
            </motion.ul>
            <div className="px-3 py-2 border-t border-border/60 bg-muted/30">
              <p className="text-[11px] text-muted-foreground">
                {isAr ? "اضغط Enter للبحث" : "Press Enter to search · ↑↓ to navigate"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
