import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Database, UserRole } from "@/lib/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    redirect("/admin");
  }
  return user;
}

export async function canManageCounty(
  userRole: UserRole,
  userCounties: string[],
  countySlug: string
): Promise<boolean> {
  if (userRole === "admin") return true;
  if (userRole === "editor") return userCounties.includes(countySlug);
  return false;
}

// ---------------------------------------------------------------------------
// API Route helpers — return NextResponse errors instead of redirects
// ---------------------------------------------------------------------------

type ApiAuthResult =
  | { user: Profile; error: null }
  | { user: null; error: NextResponse };

/**
 * Verify the caller is authenticated and fetch their profile.
 * Use in API route handlers instead of requireAuth() (which redirects).
 */
export async function requireApiAuth(
  supabase: SupabaseClient<Database>
): Promise<ApiAuthResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return {
      user: null,
      error: NextResponse.json({ error: "Profile not found" }, { status: 401 }),
    };
  }

  return { user: profile, error: null };
}

/**
 * Verify the caller has one of the required roles.
 * Returns the profile on success, or a 403 NextResponse on failure.
 */
export async function requireApiRole(
  supabase: SupabaseClient<Database>,
  roles: UserRole[]
): Promise<ApiAuthResult> {
  const result = await requireApiAuth(supabase);
  if (result.error) return result;

  if (!roles.includes(result.user.role)) {
    return {
      user: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return result;
}
