"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Stop animation when the route actually changes
    setIsAnimating(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");

      if (
        anchor &&
        anchor.href &&
        anchor.href.startsWith(window.location.origin) &&
        anchor.target !== "_blank" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        !event.altKey
      ) {
        // Only trigger if it's a different URL or the same URL but we want to show progress
        const url = new URL(anchor.href);
        if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
          setIsAnimating(true);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  if (!isAnimating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[200] overflow-hidden bg-primary/20">
      <div 
        className="h-full bg-primary animate-[loading-bar_1.5s_infinite_linear]" 
        style={{
          boxShadow: "0 0 10px var(--color-primary)",
          width: "30%",
        }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading-bar {
          0% { transform: translateX(-100%); width: 10%; }
          50% { transform: translateX(100%); width: 30%; }
          100% { transform: translateX(400%); width: 10%; }
        }
      `}} />
    </div>
  );
}
