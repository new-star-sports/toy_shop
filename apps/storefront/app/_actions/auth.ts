"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export async function login(formData: FormData, _locale: Locale) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function register(formData: FormData, _locale: Locale) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Profile is created via DB trigger handle_new_user()
  // If email confirmation is required, session will be null
  const needsConfirmation = !data.session;
  return { success: true, needsConfirmation };
}

export async function logout(locale: Locale) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}`);
}
