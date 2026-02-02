import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth";

export async function GET() {
  try {
    const supabase = await createClient();
    const { error: authError } = await requireApiRole(supabase, ["admin"]);
    if (authError) return authError;

    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .order("key");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await requireApiRole(supabase, [
      "admin",
    ]);
    if (authError) return authError;

    const body = await request.json();
    const { settings } = body as {
      settings: { key: string; value: string; description?: string }[];
    };

    // Upsert each setting
    for (const setting of settings) {
      await supabase.from("site_settings").upsert(
        {
          key: setting.key,
          value: setting.value,
          description: setting.description,
          updated_by: user.id,
        },
        { onConflict: "key" }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
