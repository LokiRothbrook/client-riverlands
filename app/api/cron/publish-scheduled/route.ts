import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Cron endpoint to publish scheduled posts.
 * Posts with status='draft' and published_at <= now() are considered scheduled.
 *
 * Set up in Vercel: Project Settings -> Cron Jobs
 * Schedule: every 15 minutes
 * Endpoint: /api/cron/publish-scheduled
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // In development, allow without secret
    if (process.env.NODE_ENV === "production" && cronSecret) {
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const supabase = await createServiceClient();
    const now = new Date().toISOString();

    // Find draft posts with published_at in the past (scheduled posts ready to publish)
    const { data: scheduledPosts, error: fetchError } = await supabase
      .from("posts")
      .select("id, title")
      .eq("status", "draft")
      .not("published_at", "is", null)
      .lte("published_at", now);

    if (fetchError) {
      console.error("Error fetching scheduled posts:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!scheduledPosts || scheduledPosts.length === 0) {
      return NextResponse.json({ message: "No posts to publish", count: 0 });
    }

    // Publish each post
    const postIds = scheduledPosts.map((p) => p.id);
    const { error: updateError } = await supabase
      .from("posts")
      .update({ status: "published" })
      .in("id", postIds);

    if (updateError) {
      console.error("Error publishing posts:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    console.log(
      `Published ${scheduledPosts.length} scheduled posts:`,
      scheduledPosts.map((p) => p.title)
    );

    return NextResponse.json({
      message: `Published ${scheduledPosts.length} scheduled posts`,
      count: scheduledPosts.length,
      posts: scheduledPosts.map((p) => ({ id: p.id, title: p.title })),
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
