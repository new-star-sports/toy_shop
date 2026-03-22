import { createMiddleware } from "@nss/auth/middleware";

export default createMiddleware({ type: "admin" });

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
