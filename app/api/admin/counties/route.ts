import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth";
import { createCountySchema } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { error: authError } = await requireApiRole(supabase, ["admin"]);
    if (authError) return authError;

    const rawBody = await request.json();

    const parseResult = createCountySchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const body = parseResult.data;

    const { error, data } = await supabase
      .from("counties")
      .insert({
        name: body.name,
        slug: body.slug || slugify(body.name),
        seat: body.seat,
        description: body.description,
        short_description: body.shortDescription,
        hero_image: body.heroImage || null,
        lat: body.lat ?? null,
        lng: body.lng ?? null,
        display_order: body.displayOrder ?? 0,
        meta_title: body.metaTitle || null,
        meta_description: body.metaDescription || null,
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
