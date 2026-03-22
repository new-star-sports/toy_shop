import { createBrowserClient as createBrowserSupabaseClient } from "@supabase/ssr";
import { createServerClient as createServerSupabaseClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Create a Supabase client for use in the browser (Client Components).
 * Uses the anon key — RLS policies are enforced.
 */
export function createBrowserClient() {
  return createBrowserSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Create a Supabase client for use in Server Components / Route Handlers.
 * Reads cookies for session — RLS policies are enforced.
 *
 * @param cookieStore - The cookies() object from next/headers
 */
export function createServerClient(cookieStore: {
  getAll: () => { name: string; value: string }[];
  set: (name: string, value: string, options?: Record<string, unknown>) => void;
}) {
  return createServerSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options ?? {})
            );
          } catch {
            // setAll can fail in Server Components — ignore
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase client with the service role key.
 * ONLY use in Server Actions / Route Handlers — never expose to client.
 * Bypasses all RLS policies.
 */
export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
