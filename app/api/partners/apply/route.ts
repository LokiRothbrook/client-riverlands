import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { partnerApplicationSchema } from "@/lib/validations";
import {
  sendPartnerRequestConfirmation,
  sendPartnerRequestAdminNotification,
} from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = partnerApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = await createServiceClient();

    // Resolve county slug to county ID
    const { data: county } = await supabase
      .from("counties")
      .select("id, name")
      .eq("slug", data.county)
      .single();

    if (!county) {
      return NextResponse.json(
        { error: "Invalid county" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("partner_requests").insert({
      business_name: data.businessName,
      contact_name: data.contactName,
      email: data.email,
      phone: data.phone || null,
      website: data.website || null,
      address: data.address || null,
      county_id: county.id,
      category: data.category,
      description: data.description,
      additional_info: data.additionalInfo || null,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 500 }
      );
    }

    // Send confirmation to applicant
    await sendPartnerRequestConfirmation({
      contactName: data.contactName,
      businessName: data.businessName,
      email: data.email,
    });

    // Notify admin
    await sendPartnerRequestAdminNotification({
      businessName: data.businessName,
      contactName: data.contactName,
      email: data.email,
      county: county.name,
    });

    return NextResponse.json({
      message:
        "Your application has been submitted! Check your email for a confirmation.",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
