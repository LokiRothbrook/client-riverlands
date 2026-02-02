import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireApiRole } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { error: authError } = await requireApiRole(supabase, ["admin"]);
    if (authError) return authError;

    const body = await request.json();
    const { subject, html, targetCounties } = body;

    if (!subject || !html) {
      return NextResponse.json(
        { error: "Subject and content are required" },
        { status: 400 }
      );
    }

    // Fetch verified subscribers
    let query = supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("verified", true);

    // Filter by target counties if specified
    if (targetCounties && targetCounties.length > 0) {
      query = query.overlaps("counties_subscribed", targetCounties);
    }

    const { data: subscribers, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: "No subscribers match the criteria" },
        { status: 400 }
      );
    }

    // Send emails in batches of 50
    const batchSize = 50;
    let sent = 0;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      const promises = batch.map((sub) =>
        sendEmail({ to: sub.email, subject, html })
      );
      await Promise.allSettled(promises);
      sent += batch.length;
    }

    return NextResponse.json({ sent });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
