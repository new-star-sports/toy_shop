"use server";

import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/i18n";

export async function login(formData: FormData, _locale: Locale) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    console.log("Logging in user:", email);
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("Supabase signIn result - Error:", error?.message || "None");

    if (error) {
      return { error: error.message || "An unknown authentication error occurred" };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Login crash:", err);
    return { error: err.message || "A server error occurred during login" };
  }
}

export async function register(formData: FormData, _locale: Locale) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    
    console.log("Registering user:", email);
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

    console.log("Supabase signUp result - Data:", !!data?.user, "Error:", error?.message || "None");

    if (error) {
      return { error: error.message || "An unknown authentication error occurred" };
    }

    if (!data?.user) {
      return { error: "Failed to create user account" };
    }

    // Profile is created via DB trigger handle_new_user()
    // If email confirmation is required, session will be null
    const needsConfirmation = !data.session;
    return { success: true, needsConfirmation };
  } catch (err: any) {
    console.error("Registration crash:", err);
    return { error: err.message || "A server error occurred during registration" };
  }
}


