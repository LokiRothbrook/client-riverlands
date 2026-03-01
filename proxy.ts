import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Public admin paths that don't require authentication
const ADMIN_PUBLIC_PATHS = [
  "/admin/login",
  "/admin/reset-password",
  "/admin/update-password",
];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if this is an admin route that requires authentication
  if (pathname.startsWith("/admin")) {
    const isPublicAdminPath = ADMIN_PUBLIC_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p)
    );

    if (!isPublicAdminPath) {
      // Check for Supabase auth cookie
      const hasSession = request.cookies
        .getAll()
        .some(
          (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
        );

      if (!hasSession) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/admin/login";
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // Refresh Supabase session for all routes
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public files with extensions (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)",
  ],
};
