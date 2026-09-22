import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Next.js 16 proxy (formerly middleware) — locale detection & redirects.
 * Order: URL prefix → cookie → Accept-Language → default (fr).
 */
export default createMiddleware(routing);

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
