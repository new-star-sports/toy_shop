"use server";

import { createServerClient } from "@nss/db/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOutAction() {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  await supabase.auth.signOut();
  redirect("/login");
}

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const cookieStore = await cookies();

  const supabase = createServerClient(cookieStore);

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // After successful auth, check if user is a staff member
  const { data: staff, error: staffError } = await supabase
    .from("staff_members")
    .select("role, is_active")
    .eq("user_id", data.user.id)
    .single();

  if (staffError || !staff || !(staff as any).is_active) {
    // Sign out if not staff
    await supabase.auth.signOut();
    return { error: "Access denied. You do not have administrative permissions." };
  }

  redirect("/");
}
