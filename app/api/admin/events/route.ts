import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await requireApiRole(supabase, [
      "admin",
      "editor",
    ]);
    if (authError) return authError;

    const body = await request.json();

    const { error, data } = await supabase
      .from("events")
      .insert({
        title: body.title,
        description: body.description,
        location: body.location,
        county_id: body.countyId,
        category: body.category || "general",
        status: body.status || "draft",
        start_date: body.startDate,
        end_date: body.endDate || null,
        recurring: body.recurring || null,
        external_link: body.externalLink || null,
        featured_image: body.featuredImage || null,
        created_by: user.id,
      })
      .select()
      .single();

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
