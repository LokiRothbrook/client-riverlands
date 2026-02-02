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

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({ verified: true, verification_token: null })
    .eq("verification_token", token)
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.redirect(
      `${siteUrl}/newsletter?error=invalid-token`
    );
  }

  return NextResponse.redirect(
    `${siteUrl}/newsletter?verified=true`
  );
}
