import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth";
import { createCategorySchema } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { error: authError } = await requireApiRole(supabase, ["admin"]);
    if (authError) return authError;

    const rawBody = await request.json();

    const parseResult = createCategorySchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const body = parseResult.data;

    const { error, data } = await supabase
      .from("categories")
      .insert({
        name: body.name,
        slug: body.slug || slugify(body.name),
        description: body.description || null,
        display_order: body.displayOrder ?? 0,
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
