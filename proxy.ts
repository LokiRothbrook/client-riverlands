import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

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
    const response = NextResponse.rewrite(adminUrl);

    // Refresh Supabase session for admin routes
    return updateSession(request);
  }

  // For public routes, refresh session if user is logged in
  // (needed for any authenticated features like saved preferences)
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
