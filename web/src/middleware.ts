/**
 * Middleware for i18n routing
 *
 * Uses @inlang/paraglide-next middleware for:
 * - Automatic locale detection from URL prefix (/zh/*, /en/*)
 * - Locale cookie management
 * - Accept-Language header negotiation
 *
 * @see src/lib/i18n.ts for routing strategy configuration
 */

export { middleware } from "@/lib/i18n";

export const config = {
  matcher: [
    // Exclude Next internals, assets, API routes, and Studio (all subpaths)
    "/((?!studio|api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
