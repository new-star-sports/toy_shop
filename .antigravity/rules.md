# NewStarSports — Project Rules

## Infrastructure Decisions

### No Redis
- **Rate limiting:** Handled by Vercel Pro edge rate limiting in `middleware.ts` — no Redis needed.
- **Guest cart:** Stored in a signed encrypted cookie (set by Server Action). Migrates to Supabase automatically on login. No Redis session store needed.
- **Flash sale counters:** Handled by Postgres atomic updates (`UPDATE SET stock = stock - 1 WHERE stock > 0`).
- **Conclusion:** Upstash Redis is NOT used in this project. Do not add Redis dependencies.

### Cron Jobs via Supabase pg_cron Only
- **All 7 scheduled jobs** run inside Supabase via the `pg_cron` extension.
- **No Vercel cron routes** — do not create `apps/api/cron/` endpoints.
- **Job types:** Direct SQL for simple queries, Supabase Edge Functions (via `net.http_post`) for jobs needing external APIs (Resend, revalidation).
- **Observability:** Job runs logged in `cron.job_run_details` — visible in Supabase dashboard.
- **Version control:** pg_cron jobs defined in database migration files, reviewed in PRs.

## Technology Stack
- **Framework:** Next.js 15 (App Router) + React 19
- **Monorepo:** Turborepo + pnpm workspaces
- **Database:** Supabase (PostgreSQL) with RLS on every table
- **Styling:** Tailwind CSS v4 + shadcn/ui (Radix primitives)
- **Auth:** Supabase Auth (email + Google OAuth)
- **Payments:** MyFatoorah (primary, KNET) + Tap Payments (backup)
- **Search:** Algolia (Arabic stemming)
- **Email:** Resend (transactional)
- **Analytics:** PostHog
- **Error tracking:** Sentry
- **Hosting:** Vercel Pro

## Code Conventions
- All text fields are bilingual: `name_en` + `name_ar`
- Default locale is Arabic (`ar`), direction RTL
- Currency: Kuwaiti Dinar (KWD), always 3 decimal places
- Phone format: `+965XXXXXXXX`
- No postcodes — Kuwait uses Governorate → Area → Block → Street → Building
