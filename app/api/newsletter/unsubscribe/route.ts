import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

  if (!token) {
    return NextResponse.redirect(
      `${siteUrl}/newsletter?error=missing-token`
    );
  }

  const supabase = await createServiceClient();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .delete()
    .eq("unsubscribe_token", token);

  if (error) {
    return NextResponse.redirect(
      `${siteUrl}/newsletter?error=unsubscribe-failed`
    );
  }

  return NextResponse.redirect(
    `${siteUrl}/newsletter?unsubscribed=true`
  );
}
