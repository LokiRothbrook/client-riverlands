import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth";

export async function GET() {
  try {
    const supabase = await createClient();
    const { error: authError } = await requireApiRole(supabase, ["admin"]);
    if (authError) return authError;

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(profiles);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { error: authError } = await requireApiRole(supabase, ["admin"]);
    if (authError) return authError;

    const body = await request.json();
    const serviceClient = await createServiceClient();

    // Invite user via Supabase Auth
    const { data: inviteData, error: inviteError } =
      await serviceClient.auth.admin.inviteUserByEmail(body.email, {
        data: {
          full_name: body.fullName || "",
        },
      });

    if (inviteError) {
      return NextResponse.json(
        { error: inviteError.message },
        { status: 500 }
      );
    }

    // Update profile with role and counties
    if (inviteData.user) {
      await serviceClient
        .from("profiles")
        .update({
          role: body.role || "viewer",
          assigned_counties: body.assignedCounties || [],
          full_name: body.fullName || null,
        })
        .eq("id", inviteData.user.id);
    }

    return NextResponse.json({ success: true, userId: inviteData.user?.id });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
