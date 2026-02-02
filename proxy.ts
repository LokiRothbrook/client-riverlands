import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

const ADMIN_PUBLIC_PATHS = ["/admin/login", "/admin/reset-password", "/admin/update-password"];

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Determine if this is an admin subdomain request
  const isAdmin =
    hostname.startsWith("admin.") ||
    hostname.startsWith("admin-");

  if (isAdmin) {
    // Rewrite admin subdomain requests to /admin routes
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = `/admin${pathname}`;

    // Refresh Supabase session
    const response = await updateSession(request);

    // Check if user is authenticated for protected admin routes
    const isPublicAdminPath = ADMIN_PUBLIC_PATHS.some(
      (p) => `/admin${pathname}`.startsWith(p)
    );

    if (!isPublicAdminPath) {
      // Check for Supabase auth cookie
      const hasSession = request.cookies.getAll().some(
        (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
      );

      if (!hasSession) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/admin/login";
        return NextResponse.redirect(loginUrl);
      }
    }

    return response;
  }

  // For public routes, refresh session if user is logged in
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
