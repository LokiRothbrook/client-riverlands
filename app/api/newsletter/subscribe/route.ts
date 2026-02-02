import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { newsletterFormSchema } from "@/lib/validations";
import { sendNewsletterVerification } from "@/lib/email";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = newsletterFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { email, firstName, lastName, counties } = parsed.data;
    const supabase = await createServiceClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, verified")
      .eq("email", email)
      .single();

    if (existing?.verified) {
      return NextResponse.json(
        { error: "This email is already subscribed" },
        { status: 409 }
      );
    }

    const verificationToken = randomUUID();

    if (existing) {
      // Update existing unverified record
      await supabase
        .from("newsletter_subscribers")
        .update({
          first_name: firstName || null,
          last_name: lastName || null,
          counties_subscribed: counties || [],
          verification_token: verificationToken,
        })
        .eq("id", existing.id);
    } else {
      // Insert new subscriber
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email,
          first_name: firstName || null,
          last_name: lastName || null,
          counties_subscribed: counties || [],
        });

      if (error) {
        return NextResponse.json(
          { error: "Failed to subscribe" },
          { status: 500 }
        );
      }

      // Set verification token
      await supabase
        .from("newsletter_subscribers")
        .update({ verification_token: verificationToken })
        .eq("email", email);
    }

    // Send verification email
    await sendNewsletterVerification({ email, token: verificationToken });

    return NextResponse.json({
      message: "Please check your email to verify your subscription",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
