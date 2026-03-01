import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { newsletterPreferencesSchema } from "@/lib/validations";

// GET - Fetch subscriber preferences by token
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Missing token" },
      { status: 400 }
    );
  }

  const supabase = await createServiceClient();

  const { data: subscriber, error } = await supabase
    .from("newsletter_subscribers")
    .select("email, first_name, last_name, counties_subscribed, topics_subscribed, frequency")
    .eq("manage_token", token)
    .single();

  if (error || !subscriber) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    email: subscriber.email,
    firstName: subscriber.first_name,
    lastName: subscriber.last_name,
    counties: subscriber.counties_subscribed,
    topics: subscriber.topics_subscribed,
    frequency: subscriber.frequency,
  });
}

// PUT - Update subscriber preferences
export async function PUT(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = newsletterPreferencesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { firstName, lastName, counties, topics, frequency } = parsed.data;
    const supabase = await createServiceClient();

    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({
        first_name: firstName || null,
        last_name: lastName || null,
        counties_subscribed: counties,
        topics_subscribed: topics,
        frequency: frequency,
      })
      .eq("manage_token", token);

    if (error) {
      return NextResponse.json(
        { error: "Failed to update preferences" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Your preferences have been updated",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
