import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireApiAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await requireApiAuth(supabase);
    if (authError) return authError;

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "riverlands";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File must be less than 10MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(buffer, { folder });

    // Track in media table
    const { data: media } = await supabase
      .from("media")
      .insert({
        url: result.url,
        public_id: result.publicId,
        filename: file.name,
        width: result.width,
        height: result.height,
        size_bytes: result.bytes,
        format: result.format,
        folder,
        uploaded_by: user.id,
      })
      .select("id")
      .single();

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      mediaId: media?.id ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
