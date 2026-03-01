import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth";
import { deleteImages } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { error: authError } = await requireApiRole(supabase, ["admin"]);
    if (authError) return authError;

    const body = await request.json();
    const ids: string[] = body.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No IDs provided" },
        { status: 400 }
      );
    }

    // Fetch public_ids for all media items
    const { data: mediaItems } = await supabase
      .from("media")
      .select("id, public_id")
      .in("id", ids);

    if (!mediaItems || mediaItems.length === 0) {
      return NextResponse.json(
        { error: "No media items found" },
        { status: 404 }
      );
    }

    const publicIds = mediaItems.map((m) => m.public_id);

    // Delete from Cloudinary
    await deleteImages(publicIds);

    // Delete from DB
    const { error } = await supabase
      .from("media")
      .delete()
      .in("id", mediaItems.map((m) => m.id));

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deleted: mediaItems.length });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
