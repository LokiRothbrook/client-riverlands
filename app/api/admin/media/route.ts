import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { mediaFilterSchema } from "@/lib/validations/admin";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { error: authError } = await requireApiRole(supabase, [
      "admin",
      "editor",
    ]);
    if (authError) return authError;

    const url = new URL(request.url);
    const parseResult = mediaFilterSchema.safeParse({
      search: url.searchParams.get("search") || undefined,
      folder: url.searchParams.get("folder") || undefined,
      page: url.searchParams.get("page") || undefined,
      perPage: url.searchParams.get("perPage") || undefined,
    });

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const { search, folder, page, perPage } = parseResult.data;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from("media")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) {
      query = query.ilike("filename", `%${search}%`);
    }
    if (folder) {
      query = query.eq("folder", folder);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Check which media items are in use
    const mediaWithUsage = await Promise.all(
      (data || []).map(async (item) => {
        const [postsImg, postContent, eventsImg] = await Promise.all([
          supabase
            .from("posts")
            .select("id", { count: "exact", head: true })
            .eq("featured_image", item.url),
          supabase
            .from("posts")
            .select("id", { count: "exact", head: true })
            .like("content", `%${item.url}%`),
          supabase
            .from("events")
            .select("id", { count: "exact", head: true })
            .eq("featured_image", item.url),
        ]);

        const inUse =
          (postsImg.count ?? 0) > 0 ||
          (postContent.count ?? 0) > 0 ||
          (eventsImg.count ?? 0) > 0;

        return { ...item, inUse };
      })
    );

    return NextResponse.json({
      data: mediaWithUsage,
      total: count ?? 0,
      page,
      perPage,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { user, error: authError } = await requireApiRole(supabase, [
      "admin",
      "editor",
    ]);
    if (authError) return authError;

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "riverlands";
    const altText = (formData.get("altText") as string) || null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File must be less than 10MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(buffer, { folder });

    const { data, error } = await supabase
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
        alt_text: altText,
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
