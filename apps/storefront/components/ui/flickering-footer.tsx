"use client";

import * as Color from "color-bits";
import { ChevronRight, Instagram, MessageCircle, Music2 } from "lucide-react";
import Link from "next/link";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

// ─── Color helpers ───────────────────────────────────────────────────────────

export const getRGBA = (
  cssColor: React.CSSProperties["color"],
  fallback = "rgba(180, 180, 180)",
): string => {
  if (typeof window === "undefined") return fallback;
  if (!cssColor) return fallback;
  try {
    if (typeof cssColor === "string" && cssColor.startsWith("var(")) {
      const el = document.createElement("div");
      el.style.color = cssColor;
      document.body.appendChild(el);
      const computed = window.getComputedStyle(el).color;
      document.body.removeChild(el);
      return Color.formatRGBA(Color.parse(computed));
    }
    return Color.formatRGBA(Color.parse(cssColor));
  } catch {
    return fallback;
  }
};

export const colorWithOpacity = (color: string, opacity: number): string => {
  if (!color.startsWith("rgb")) return color;
  return Color.formatRGBA(Color.alpha(Color.parse(color), opacity));
};

// ─── FlickeringGrid ──────────────────────────────────────────────────────────

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  maxOpacity?: number;
  text?: string;
  fontSize?: number;
  fontWeight?: number | string;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 3,
  gridGap = 3,
  flickerChance = 0.2,
  color = "#B4B4B4",
  width,
  height,
  className,
  maxOpacity = 0.15,
  text = "",
  fontSize = 140,
  fontWeight = 600,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => getRGBA(color), [color]);

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, w, h);

      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = w;
      maskCanvas.height = h;
      const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!maskCtx) return;

      if (text) {
        maskCtx.save();
        maskCtx.scale(dpr, dpr);
        maskCtx.fillStyle = "white";
        maskCtx.font = `${fontWeight} ${fontSize}px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        maskCtx.textAlign = "center";
        maskCtx.textBaseline = "middle";
        maskCtx.fillText(text, w / (2 * dpr), h / (2 * dpr));
        maskCtx.restore();
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (squareSize + gridGap) * dpr;
          const y = j * (squareSize + gridGap) * dpr;
          const sw = squareSize * dpr;
          const sh = squareSize * dpr;

          const maskData = maskCtx.getImageData(x, y, sw, sh).data;
          const hasText = maskData.some((v, idx) => idx % 4 === 0 && v > 0);

          const opacity = squares[i * rows + j];
          const finalOpacity = hasText ? Math.min(1, opacity * 3 + 0.4) : opacity;

          ctx.fillStyle = colorWithOpacity(memoizedColor, finalOpacity);
          ctx.fillRect(x, y, sw, sh);
        }
      }
    },
    [memoizedColor, squareSize, gridGap, text, fontSize, fontWeight],
  );

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, w: number, h: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const cols = Math.ceil(w / (squareSize + gridGap));
      const rows = Math.ceil(h / (squareSize + gridGap));
      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) squares[i] = Math.random() * maxOpacity;
      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridParams: ReturnType<typeof setupCanvas>;

    const updateCanvasSize = () => {
      const newW = width || container.clientWidth;
      const newH = height || container.clientHeight;
      setCanvasSize({ width: newW, height: newH });
      gridParams = setupCanvas(canvas, newW, newH);
    };

    updateCanvasSize();

    let lastTime = 0;
    const animate = (time: number) => {
      if (!isInView) return;
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;
      updateSquares(gridParams.squares, deltaTime);
      drawGrid(ctx, canvas.width, canvas.height, gridParams.cols, gridParams.rows, gridParams.squares, gridParams.dpr);
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    if (isInView) animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)} {...props}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />
    </div>
  );
};

// ─── useMediaQuery ────────────────────────────────────────────────────────────

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);
  useEffect(() => {
    const check = () => setValue(window.matchMedia(query).matches);
    check();
    window.addEventListener("resize", check);
    const mq = window.matchMedia(query);
    mq.addEventListener("change", check);
    return () => {
      window.removeEventListener("resize", check);
      mq.removeEventListener("change", check);
    };
  }, [query]);
  return value;
}

// ─── Footer links config ──────────────────────────────────────────────────────

const footerLinks = (locale: Locale) => {
  const isAr = locale === "ar";
  return [
    {
      title: isAr ? "تسوق" : "Shop",
      links: [
        { id: 1, title: isAr ? "جميع المنتجات" : "All Products", url: `/${locale}/products` },
        { id: 2, title: isAr ? "وصل حديثاً" : "New Arrivals", url: `/${locale}/products?sort=new` },
        { id: 3, title: isAr ? "العروض" : "Sale", url: `/${locale}/products?sale=true` },
        { id: 4, title: "LEGO", url: `/${locale}/brand/lego` },
        { id: 5, title: "Barbie", url: `/${locale}/brand/barbie` },
      ],
    },
    {
      title: isAr ? "مساعدة" : "Help",
      links: [
        { id: 6, title: isAr ? "الأسئلة الشائعة" : "FAQ", url: `/${locale}/faq` },
        { id: 7, title: isAr ? "تواصل معنا" : "Contact Us", url: `/${locale}/contact` },
        { id: 8, title: isAr ? "معلومات التوصيل" : "Delivery Info", url: `/${locale}/delivery-info` },
        { id: 9, title: isAr ? "سياسة الإرجاع" : "Returns Policy", url: `/${locale}/returns-policy` },
      ],
    },
    {
      title: isAr ? "قانوني" : "Legal",
      links: [
        { id: 10, title: isAr ? "سياسة الخصوصية" : "Privacy Policy", url: `/${locale}/privacy` },
        { id: 11, title: isAr ? "الشروط والأحكام" : "Terms & Conditions", url: `/${locale}/terms` },
        { id: 12, title: isAr ? "المدونة" : "Blog", url: `/${locale}/blog` },
      ],
    },
  ];
};

// ─── FlickeringFooter ─────────────────────────────────────────────────────────

export interface FlickeringFooterProps {
  locale: Locale;
  storeName: string;
  tagline: string;
  crNumber: string;
  instagramUrl?: string | null;
  whatsappNumber?: string | null;
  tiktokUrl?: string | null;
}

export function FlickeringFooter({
  locale,
  storeName,
  tagline,
  crNumber,
  instagramUrl,
  whatsappNumber,
  tiktokUrl,
}: FlickeringFooterProps) {
  const isAr = locale === "ar";
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const columns = footerLinks(locale);

  return (
    <footer id="footer" className="w-full pb-0 rounded-t-[2.5rem]" style={{ background: "linear-gradient(160deg, oklch(0.92 0.06 215) 0%, oklch(0.88 0.08 230) 100%)", boxShadow: "0 -8px 32px -4px oklch(0.65 0.14 215 / 25%), inset 0 2px 4px 0 rgba(255,255,255,0.65)" }}>
      {/* ── Main content ── */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between px-6 sm:px-10 pt-10 pb-6 max-w-7xl mx-auto gap-8">

        {/* Brand column */}
        <div className="flex flex-col items-start gap-4 max-w-xs">
          <Link href={`/${locale}`} className="inline-block group">
            <img
              src="/logo.png"
              alt={isAr ? "نيو ستار سبورتس" : "NewStarSports"}
              className="h-9 w-auto transition-opacity group-hover:opacity-80"
            />
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tagline}
          </p>

          {/* Social links */}
          <div className="flex gap-2">
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white clay-shadow-sky flex items-center justify-center text-clay-sky-deep hover:scale-110 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
            )}
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white clay-shadow-mint flex items-center justify-center text-clay-mint-deep hover:scale-110 transition-all duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
            )}
            {tiktokUrl && (
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white clay-shadow-lavender flex items-center justify-center text-clay-lavender-deep hover:scale-110 transition-all duration-200"
                aria-label="TikTok"
              >
                <Music2 size={16} />
              </a>
            )}
          </div>

          {/* Payment methods */}
          <div className="mt-1">
            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest block mb-2">
              {isAr ? "طرق الدفع" : "Secure Payments"}
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {["KNET", "VISA", "MC", "Apple Pay"].map((pm) => (
                <div key={pm} className="px-2.5 py-1 bg-white rounded-full text-[10px] font-black text-foreground/70 tracking-tight clay-shadow-white">
                  {pm}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Links columns */}
        <div className="flex flex-col sm:flex-row gap-8 md:gap-12 lg:gap-16">
          {columns.map((col, idx) => (
            <ul key={idx} className="flex flex-col gap-2">
              <li className="mb-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {col.title}
              </li>
              {col.links.map((link) => (
                <li
                  key={link.id}
                  className="group inline-flex cursor-pointer items-center gap-1 text-[15px]/snug text-muted-foreground hover:text-primary transition-colors"
                >
                  <Link href={link.url}>{link.title}</Link>
                  <div className="flex size-4 items-center justify-center border border-border rounded translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* ── Flickering grid band ── */}
      <div className="w-full h-40 md:h-52 relative mt-8 z-0">
        <div className="absolute inset-0 z-10 from-40%" style={{ background: "linear-gradient(to top, transparent 0%, oklch(0.88 0.08 230) 100%)" }} />
        <div className="absolute inset-0 mx-4 sm:mx-6">
          <FlickeringGrid
            text={isTablet ? storeName : `${storeName} • Kuwait`}
            fontSize={isTablet ? 60 : 80}
            className="h-full w-full"
            squareSize={2}
            gridGap={isTablet ? 2 : 3}
            color="#1e6aaa"
            maxOpacity={0.4}
            flickerChance={0.08}
          />
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t py-5 px-6 sm:px-10" style={{ borderColor: "rgba(30,106,170,0.18)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-foreground/60">
          <p>
            © {new Date().getFullYear()} {storeName}.{" "}
            {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-white rounded-full clay-shadow-white">
              {isAr ? `سجل تجاري: ${crNumber}` : `CR: ${crNumber}`}
            </span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-foreground/20" />
            <span>{isAr ? "الكويت 🇰🇼" : "Kuwait 🇰🇼"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
