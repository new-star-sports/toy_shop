"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AuthDialog } from "./auth-dialog";
import type { Locale } from "@/lib/i18n";

export function AuthHandler({ locale }: { locale: Locale }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const authMode = searchParams.get("auth");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (authMode === "login" || authMode === "register") {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [authMode]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Clear the query param when closing
      const params = new URLSearchParams(searchParams.toString());
      params.delete("auth");
      params.delete("redirect");
      const queryString = params.toString();
      
      // Use router.replace to update the URL without adding to history
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  };

  if (!authMode) return null;

  return (
    <AuthDialog
      locale={locale}
      open={isOpen}
      onOpenChange={handleOpenChange}
      defaultView={authMode === "register" ? "register" : "login"}
      hideTrigger={true}
    />
  );
}
