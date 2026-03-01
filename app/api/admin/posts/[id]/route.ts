import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth";
import { updatePostSchema } from "@/lib/validations/admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { error: authError } = await requireApiRole(supabase, [
      "admin",
      "editor",
    ]);
    if (authError) return authError;

    const { data, error } = await supabase
      .from("posts")
      .select(
        "*, county:counties(id, name, slug), category:categories(id, name, slug)"
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { user, error: authError } = await requireApiRole(supabase, [
      "admin",
      "editor",
    ]);
    if (authError) return authError;

    // Check county authorization for editors
    if (user.role === "editor") {
      const { data: post } = await supabase
        .from("posts")
        .select("county_id, counties(slug)")
        .eq("id", id)
        .single();

      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const countySlug = (post.counties as any)?.slug;
      if (!countySlug || !user.assigned_counties.includes(countySlug)) {
        return NextResponse.json(
          { error: "Not authorized for this county" },
          { status: 403 }
        );
      }
    }

    const rawBody = await request.json();

    // Validate request body
    const parseResult = updatePostSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const body = parseResult.data;
    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.featuredImage !== undefined)
      updateData.featured_image = body.featuredImage || null;
    if (body.countyId !== undefined) updateData.county_id = body.countyId;
    if (body.categoryId !== undefined)
      updateData.category_id = body.categoryId;

    // Handle scheduling
    if (body.scheduledFor !== undefined) {
      if (body.scheduledFor) {
        // Schedule for future publishing
        updateData.published_at = new Date(body.scheduledFor).toISOString();
        updateData.status = "draft"; // Keep as draft until cron publishes
      } else {
        // Clear scheduling (null scheduledFor)
        updateData.published_at = null;
      }
    } else if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === "published" && !body.publishedAt) {
        updateData.published_at = new Date().toISOString();
      }
    }

    if (body.metaTitle !== undefined)
      updateData.meta_title = body.metaTitle || null;
    if (body.metaDescription !== undefined)
      updateData.meta_description = body.metaDescription || null;

    const { data, error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", id)
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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { error: authError } = await requireApiRole(supabase, ["admin"]);
    if (authError) return authError;

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
