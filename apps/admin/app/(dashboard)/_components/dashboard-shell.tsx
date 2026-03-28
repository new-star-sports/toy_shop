"use client";

import { Sidebar } from "./sidebar";
import { Button } from "@/components/ui/button";
import { IconMenu2 } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { signOutAction } from "../../(auth)/login/_actions";

export interface AdminUser {
  fullName: string;
  email: string;
  role: string;
  initials: string;
}

interface DashboardShellProps {
  userPromise: Promise<AdminUser>;
  children: React.ReactNode;
}

export function DashboardShell({ userPromise, children }: DashboardShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const isDashboard = pathname === "/";
  const pathParts = pathname.split("/").filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1];
  const displayTitle = isDashboard ? "Dashboard" : (lastPart ? lastPart.charAt(0).toUpperCase() + lastPart.slice(1) : "Admin");

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        userPromise={userPromise}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onSignOut={() => setShowLogout(true)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile-only compact header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border/50 bg-white shrink-0 sticky top-0 z-50 force-solid-bg" style={{ backgroundColor: 'white' }}>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <IconMenu2 size={20} stroke={1.5} />
          </Button>
          <span className="text-sm font-semibold truncate px-2">{displayTitle}</span>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        <main className="flex-1 p-4 sm:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Simple Logout Modal to avoid any component-level issues */}
      {showLogout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowLogout(false)} />
          <div className="bg-white dark:bg-card p-6 rounded-2xl shadow-2xl relative z-10 w-full max-w-sm border border-border">
            <h3 className="text-xl font-bold mb-2">Sign Out?</h3>
            <p className="text-muted-foreground mb-6">Are you sure you want to sign out from the admin dashboard?</p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl" 
                onClick={() => setShowLogout(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1 rounded-xl" 
                onClick={(e) => {
                  e.preventDefault();
                  startTransition(async () => {
                    await signOutAction();
                  });
                }}
                disabled={isPending}
              >
                {isPending ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
