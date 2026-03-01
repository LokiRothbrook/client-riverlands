import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth";
import { updatePartnerSchema } from "@/lib/validations/admin";
import { cleanupImages, cleanupReplacedImage } from "@/lib/media-cleanup";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { error: authError } = await requireApiRole(supabase, ["admin"]);
    if (authError) return authError;

    const { data, error } = await supabase
      .from("partners")
      .select("*, county:counties(id, name, slug)")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
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
    const { error: authError } = await requireApiRole(supabase, ["admin"]);
    if (authError) return authError;

    const rawBody = await request.json();

    // Validate request body
    const parseResult = updatePartnerSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const body = parseResult.data;
    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.logo !== undefined) {
      // Clean up old logo if being replaced
      const { data: existing } = await supabase
        .from("partners")
        .select("logo")
        .eq("id", id)
        .single();

      if (existing) {
        cleanupReplacedImage(supabase, existing.logo, body.logo);
      }

      updateData.logo = body.logo || null;
    }
    if (body.website !== undefined)
      updateData.website = body.website || null;
    if (body.email !== undefined) updateData.email = body.email || null;
    if (body.phone !== undefined) updateData.phone = body.phone || null;
    if (body.address !== undefined)
      updateData.address = body.address || null;
    if (body.countyId !== undefined) updateData.county_id = body.countyId;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.isFeatured !== undefined)
      updateData.is_featured = body.isFeatured;
    if (body.status !== undefined) updateData.status = body.status;

    const { data, error } = await supabase
      .from("partners")
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

    // Fetch partner to get logo before deleting
    const { data: partner } = await supabase
      .from("partners")
      .select("logo")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("partners").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Clean up logo (fire-and-forget)
    if (partner?.logo) {
      cleanupImages(supabase, [partner.logo]);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
