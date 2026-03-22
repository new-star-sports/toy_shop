import { createMiddleware } from "@nss/auth/middleware";

export default createMiddleware({ type: "storefront" });

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
