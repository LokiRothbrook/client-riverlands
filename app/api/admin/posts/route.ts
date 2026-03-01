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

    // Determine published_at based on status and scheduledFor
    let publishedAt: string | null = null;
    let status = body.status || "draft";

    if (body.scheduledFor) {
      // If scheduledFor is provided, set published_at to that time
      // and keep status as draft (cron job will publish it)
      publishedAt = new Date(body.scheduledFor).toISOString();
      status = "draft";
    } else if (body.status === "published") {
      // Immediate publish
      publishedAt = new Date().toISOString();
    }

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
        is_featured: body.isFeatured ?? false,
        show_cover_image: body.showCoverImage ?? true,
        status,
        meta_title: body.metaTitle || null,
        meta_description: body.metaDescription || null,
        published_at: publishedAt,
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
