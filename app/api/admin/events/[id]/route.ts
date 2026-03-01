import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth";
import { updateEventSchema } from "@/lib/validations/admin";
import { cleanupImages, cleanupReplacedImage } from "@/lib/media-cleanup";

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
      .from("events")
      .select("*, county:counties(id, name, slug)")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
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
      const { data: event } = await supabase
        .from("events")
        .select("county_id, counties(slug)")
        .eq("id", id)
        .single();

      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const countySlug = (event.counties as any)?.slug;
      if (!countySlug || !user.assigned_counties.includes(countySlug)) {
        return NextResponse.json(
          { error: "Not authorized for this county" },
          { status: 403 }
        );
      }
    }

    const rawBody = await request.json();

    // Validate request body
    const parseResult = updateEventSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const body = parseResult.data;
    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.countyId !== undefined) updateData.county_id = body.countyId;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.startDate !== undefined) updateData.start_date = body.startDate;
    if (body.endDate !== undefined)
      updateData.end_date = body.endDate || null;
    if (body.recurring !== undefined)
      updateData.recurring = body.recurring || null;
    if (body.externalLink !== undefined)
      updateData.external_link = body.externalLink || null;
    if (body.featuredImage !== undefined) {
      // Clean up old featured image if being replaced
      const { data: existing } = await supabase
        .from("events")
        .select("featured_image")
        .eq("id", id)
        .single();

      if (existing) {
        cleanupReplacedImage(supabase, existing.featured_image, body.featuredImage);
      }

      updateData.featured_image = body.featuredImage || null;
    }

    const { data, error } = await supabase
      .from("events")
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

    // Fetch event to get featured image before deleting
    const { data: event } = await supabase
      .from("events")
      .select("featured_image")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Clean up featured image (fire-and-forget)
    if (event?.featured_image) {
      cleanupImages(supabase, [event.featured_image]);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
