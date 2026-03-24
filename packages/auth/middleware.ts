import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["en", "ar"] as const;
const DEFAULT_LOCALE = "en"; // English is now the default

/** Protected routes that require authentication */
const PROTECTED_PATHS = [
  "/checkout",
  "/account",
  "/order",
];

/**
 * Middleware factory — handles locale detection, auth guard, and admin RBAC.
 *
 * Usage in each app's middleware.ts:
 *   import { createMiddleware } from "@nss/auth/middleware";
 *   export default createMiddleware({ type: "storefront" });
 */
export function createMiddleware(options: { type: "storefront" | "admin" }) {
  return async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(
            cookiesToSet: {
              name: string;
              value: string;
              options?: Record<string, unknown>;
            }[]
          ) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options ?? {})
            );
          },
        },
      }
    );

    // Refresh session — MUST be called before getUser()
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    if (options.type === "storefront") {
      return handleStorefront(request, supabaseResponse, user, pathname);
    }

    if (options.type === "admin") {
      return handleAdmin(request, supabaseResponse, user, pathname);
    }

    return supabaseResponse;
  };
}

function handleStorefront(
  request: NextRequest,
  response: NextResponse,
  user: unknown | null,
  pathname: string
) {
  // ── Locale detection ──
  const segments = pathname.split("/");
  const firstSegment = segments[1];
  const hasLocale = SUPPORTED_LOCALES.includes(firstSegment as typeof SUPPORTED_LOCALES[number]);

  if (!hasLocale) {
    // Redirect to locale-prefixed URL
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    const acceptLang = request.headers.get("accept-language");
    const detectedLocale =
      cookieLocale ||
      (acceptLang?.includes("ar") ? "ar" : DEFAULT_LOCALE);
    const locale = SUPPORTED_LOCALES.includes(detectedLocale as typeof SUPPORTED_LOCALES[number])
      ? detectedLocale
      : DEFAULT_LOCALE;

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // ── Auth guard for protected routes ──
  const pathWithoutLocale = "/" + segments.slice(2).join("/");
  const isProtected = PROTECTED_PATHS.some((p) =>
    pathWithoutLocale.startsWith(p)
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${firstSegment}/login`;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

function handleAdmin(
  request: NextRequest,
  response: NextResponse,
  user: unknown | null,
  pathname: string
) {
  // Allow login page without auth
  if (pathname === "/login" || pathname === "/admin/login") {
    return response;
  }

  // All other admin routes require authentication
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
