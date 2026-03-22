/**
 * NewStarSports — Environment Variable Validation
 *
 * Uses t3-env pattern for runtime validation of env vars.
 * Import this in each app's instrumentation or config.
 */

/** All environment variable keys with their descriptions */
export const envSchema = {
  // ── Supabase ──
  NEXT_PUBLIC_SUPABASE_URL: "Supabase project URL",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "Supabase anonymous (public) key",
  SUPABASE_SERVICE_ROLE_KEY: "Supabase service role key (server-only)",

  // ── MyFatoorah ──
  MYFATOORAH_API_KEY_TEST: "MyFatoorah test API key",
  MYFATOORAH_API_KEY_LIVE: "MyFatoorah live API key",
  MYFATOORAH_WEBHOOK_SECRET: "MyFatoorah webhook HMAC secret",

  // ── Tap Payments ──
  TAP_SECRET_KEY_TEST: "Tap test secret key",
  TAP_SECRET_KEY_LIVE: "Tap live secret key",

  // ── Algolia ──
  NEXT_PUBLIC_ALGOLIA_APP_ID: "Algolia application ID",
  NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: "Algolia search-only API key",
  ALGOLIA_ADMIN_KEY: "Algolia admin API key (server-only)",

  // ── Resend ──
  RESEND_API_KEY: "Resend API key for transactional emails",

  // ── Sentry ──
  NEXT_PUBLIC_SENTRY_DSN_STOREFRONT: "Sentry DSN for storefront app",
  NEXT_PUBLIC_SENTRY_DSN_ADMIN: "Sentry DSN for admin app",

  // ── PostHog ──
  NEXT_PUBLIC_POSTHOG_KEY: "PostHog project API key",
  NEXT_PUBLIC_POSTHOG_HOST: "PostHog host URL",

  // ── App ──
  NEXT_PUBLIC_SITE_URL: "Public site URL",
  NEXT_PUBLIC_DEFAULT_LOCALE: "Default locale (ar or en)",
} as const;

/**
 * Validate that required env vars are present.
 * Call this at app startup to fail fast if config is missing.
 */
export function validateEnv(required: (keyof typeof envSchema)[]): void {
  const missing: string[] = [];
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables:\n${missing.map((k) => `  - ${k}: ${envSchema[k as keyof typeof envSchema]}`).join("\n")}`
    );
  }
}
