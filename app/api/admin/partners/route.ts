import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { error: authError } = await requireApiRole(supabase, ["admin"]);
    if (authError) return authError;

    const body = await request.json();

    const { error, data } = await supabase
      .from("partners")
      .insert({
        name: body.name,
        slug: body.slug || slugify(body.name),
        description: body.description,
        logo: body.logo || null,
        website: body.website || null,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        county_id: body.countyId,
        category: body.category,
        is_featured: body.isFeatured ?? false,
        status: body.status || "active",
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
