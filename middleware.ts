import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Public /admin paths that do not require authentication.
 * All other /admin/* routes redirect to /admin/login if no session.
 */
const PUBLIC_ADMIN_PATHS = [
  "/admin/login",
  "/admin/reset-password",
  "/admin/update-password",
];

export async function middleware(request: NextRequest) {
  // Build a mutable response — Supabase may need to set refreshed auth cookies
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write updated cookies onto both the request and the response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: supabase.auth.getUser() must be called here.
  // It refreshes the session cookie when the access token has expired,
  // using the refresh token. Do not remove this call.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const isPublicPath = PUBLIC_ADMIN_PATHS.some((p) =>
      pathname.startsWith(p)
    );

    if (!isPublicPath && !user) {
      // Redirect unauthenticated visitors to the login page
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // IMPORTANT: return supabaseResponse (not NextResponse.next()) so the
  // refreshed session cookies are forwarded to the browser.
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Run on all paths except Next.js internals and static files.
     * This ensures the session is refreshed on every page and API request.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
