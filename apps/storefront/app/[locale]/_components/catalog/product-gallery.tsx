"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@nss/ui/components/button";

interface ProductGalleryProps {
  images: { url: string; alt_en?: string; alt_ar?: string }[];
  locale: string;
}

export function ProductGallery({ images, locale }: ProductGalleryProps) {
  const isAr = locale === "ar";
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-nss-surface rounded-3xl flex items-center justify-center">
        <span className="text-nss-text-secondary">No image</span>
      </div>
    );
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-nss-border/30 group">
        <Image
          src={images[activeIndex].url}
          alt={isAr ? images[activeIndex].alt_ar || "" : images[activeIndex].alt_en || ""}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          priority
        />
        
        {/* Navigation Buttons */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full shadow-lg h-10 w-10 bg-white hover:bg-nss-primary hover:text-white transition-colors"
              onClick={handlePrev}
            >
              {isAr ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full shadow-lg h-10 w-10 bg-white hover:bg-nss-primary hover:text-white transition-colors"
              onClick={handleNext}
            >
              {isAr ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          </div>
        )}

        {/* Zoom Action Placeholder */}
        <div className="absolute top-4 right-4">
          <Button size="icon" variant="outline" className="rounded-full shadow-sm bg-white h-8 w-8 hover:text-nss-primary">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                activeIndex === index ? "border-nss-primary shadow-sm" : "border-nss-border/30 hover:border-nss-primary/30"
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={image.url}
                alt=""
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
