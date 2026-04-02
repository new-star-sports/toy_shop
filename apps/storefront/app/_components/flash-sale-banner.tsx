"use client";

import { useEffect, useState } from "react"
import { Zap } from "lucide-react"
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
    <div className="bg-red-600 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">
        <div className="flex items-center gap-2">
          <Zap size={16} className="fill-white" />
          <span className="font-bold uppercase tracking-wider text-xs sm:text-sm">
            {isAr ? titleAr : titleEn}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-sm">
          {[
            { val: timeLeft.hours, labelEn: "HRS", labelAr: "ساعة" },
            { val: timeLeft.minutes, labelEn: "MIN", labelAr: "دقيقة" },
            { val: timeLeft.seconds, labelEn: "SEC", labelAr: "ثانية" },
          ].map(({ val, labelEn, labelAr }, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {idx > 0 && <span className="font-bold opacity-60">:</span>}
              <div className="flex flex-col items-center">
                <span className="bg-white/20 rounded px-2 py-0.5 min-w-[32px] text-center font-bold tabular-nums">
                  {String(val).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase mt-0.5 opacity-70">
                  {isAr ? labelAr : labelEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
