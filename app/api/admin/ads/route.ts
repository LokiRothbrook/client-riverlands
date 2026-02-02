import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { error: authError } = await requireApiRole(supabase, ["admin"]);
    if (authError) return authError;

    const body = await request.json();

    const { error, data } = await supabase
      .from("ad_placements")
      .insert({
        business_name: body.businessName,
        image_url: body.imageUrl,
        link_url: body.linkUrl,
        placement_zone: body.placementZone,
        county_id: body.countyId || null,
        is_active: body.isActive ?? true,
        start_date: body.startDate,
        end_date: body.endDate,
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
