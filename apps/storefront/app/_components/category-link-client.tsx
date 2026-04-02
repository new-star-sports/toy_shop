"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CategoryLinkClientProps {
  href: string;
  children: ReactNode;
  className?: string;
  loadingClassName?: string;
}

export function CategoryLinkClient({
  href,
  children,
  className,
  loadingClassName,
}: CategoryLinkClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        "relative transition-all duration-300",
        className,
        isPending && (loadingClassName || "opacity-70 scale-95 cursor-wait")
      )}
    >
      {children}
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full absolute inset-0 bg-white/40 animate-pulse rounded-[inherit]" />
          <Loader2 className="w-5 h-5 text-primary animate-spin opacity-50" />
        </div>
      )}
    </Link>
  );
}
