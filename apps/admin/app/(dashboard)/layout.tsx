import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@nss/auth/session";
import { createServerClient } from "@nss/db/client";
import type { StaffMember } from "@nss/db/types";
import { DashboardShell, type AdminUser } from "./_components/dashboard-shell";
import { ProgressBar } from "./_components/progress-bar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  
  // We check for the session existence fast, but we don't await the full user/staff details 
  // until we render the shell's dependent components.
  async function getUserData(): Promise<AdminUser> {
    const user = await getCurrentUser(cookieStore);
    if (!user) {
      redirect("/login");
    }

    const supabase = createServerClient(cookieStore);
    const { data } = await supabase
      .from("staff_members")
      .select("*")
      .eq("user_id", user.id)
      .single();
    
    const staff = data as StaffMember | null;
    const fullName = staff?.full_name || user.email?.split("@")[0] || "Admin";
    const role = (staff?.role as string) || "admin";
    const email = staff?.email || user.email || "";
    
    const initials = fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return { fullName, email, role, initials };
  }

  return (
    <>
      <ProgressBar />
      <DashboardShell userPromise={getUserData()}>
        {children}
      </DashboardShell>
    </>
  );
}
