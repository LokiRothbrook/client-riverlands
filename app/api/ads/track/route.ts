import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { adId, type } = await request.json();

    if (!adId || !["impression", "click"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    if (type === "click") {
      await supabase.rpc("increment_ad_clicks" as never, { ad_id: adId } as never);
      // Fallback: direct update
      const { data: ad } = await supabase
        .from("ad_placements")
        .select("clicks")
        .eq("id", adId)
        .single();

      if (ad) {
        await supabase
          .from("ad_placements")
          .update({ clicks: ad.clicks + 1 })
          .eq("id", adId);
      }
    } else {
      const { data: ad } = await supabase
        .from("ad_placements")
        .select("impressions")
        .eq("id", adId)
        .single();

      if (ad) {
        await supabase
          .from("ad_placements")
          .update({ impressions: ad.impressions + 1 })
          .eq("id", adId);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
