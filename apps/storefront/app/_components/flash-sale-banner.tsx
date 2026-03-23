"use client"

import { useEffect, useState } from "react"
import { type Locale } from "@/lib/i18n"

interface FlashSaleBannerProps {
  endTime: string
  titleEn: string
  titleAr: string
  locale: Locale
}

export function FlashSaleBanner({ endTime, titleEn, titleAr, locale }: FlashSaleBannerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null)
  const isAr = locale === "ar"

  useEffect(() => {
    const end = new Date(endTime).getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = end - now

      if (distance < 0) {
        clearInterval(timer)
        setTimeLeft(null)
        return
      }

      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  if (!timeLeft) return null

  return (
    <div className="bg-nss-danger text-white py-2.5 px-4 overflow-hidden relative">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">
        <div className="flex items-center gap-2">
          <span className="animate-bounce">🔥</span>
          <span className="font-bold uppercase tracking-wider text-sm sm:text-base">
            {isAr ? titleAr : titleEn}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-xs sm:text-sm font-mono">
          <div className="flex flex-col items-center">
            <span className="bg-white/20 rounded px-1.5 py-0.5 min-w-[32px] text-center font-bold">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase mt-0.5 opacity-80">{isAr ? "ساعة" : "HRS"}</span>
          </div>
          <span className="animate-pulse font-bold">:</span>
          <div className="flex flex-col items-center">
            <span className="bg-white/20 rounded px-1.5 py-0.5 min-w-[32px] text-center font-bold">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase mt-0.5 opacity-80">{isAr ? "دقيقة" : "MIN"}</span>
          </div>
          <span className="animate-pulse font-bold">:</span>
          <div className="flex flex-col items-center">
            <span className="bg-white/20 rounded px-1.5 py-0.5 min-w-[32px] text-center font-bold">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase mt-0.5 opacity-80">{isAr ? "ثانية" : "SEC"}</span>
          </div>
        </div>

        <button className="hidden md:block bg-white text-nss-danger px-4 py-1 rounded-full text-xs font-bold hover:bg-opacity-90 transition-all uppercase">
          {isAr ? "تسوق الآن" : "Shop Now"}
        </button>
      </div>
    </div>
  )
}
