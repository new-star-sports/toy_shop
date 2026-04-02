"use client";

import { useState } from "react";
import {
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui";
import { LogOut } from "lucide-react";
import { useParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export default function LogoutButton() {
  const params = useParams();
  const locale = params.locale as Locale;
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const isAr = locale === "ar";

  const handleLogout = () => {
    setIsLoading(true);
    window.location.href = `/${locale}/logout`;
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full rounded-2xl text-clay-coral-deep bg-clay-coral/30 hover:bg-clay-coral/50 font-black gap-2 justify-start transition-all"
          disabled={isLoading}
        >
          <LogOut size={16} />
          {isAr ? "تسجيل الخروج" : "Logout"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[2rem] clay-shadow-lavender border-none bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-black text-foreground text-left">
            {isAr ? "هل أنت متأكد؟" : "Are you sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground font-medium text-left">
            {isAr
              ? "هل تريد حقاً تسجيل الخروج من حسابك؟"
              : "Do you really want to log out of your account?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 sm:gap-2 mt-4">
          <AlertDialogCancel 
            className="rounded-2xl font-bold border-none bg-clay-lavender/50 hover:bg-clay-lavender text-clay-lavender-deep"
            disabled={isLoading}
          >
            {isAr ? "إلغاء" : "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
            disabled={isLoading}
            className="rounded-2xl font-black bg-clay-coral text-clay-coral-deep hover:bg-clay-coral/80 border-none"
          >
            {isLoading
              ? (isAr ? "جارٍ تسجيل الخروج..." : "Logging out...")
              : (isAr ? "تسجيل الخروج" : "Logout")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
