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
      .from("posts")
      .insert({
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        featured_image: body.featuredImage || null,
        county_id: body.countyId,
        author_id: user.id,
        category_id: body.categoryId,
        status: body.status || "draft",
        meta_title: body.metaTitle || null,
        meta_description: body.metaDescription || null,
        published_at:
          body.status === "published" ? new Date().toISOString() : null,
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
