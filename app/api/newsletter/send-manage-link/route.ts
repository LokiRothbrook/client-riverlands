import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod/v4";

const schema = z.object({
  email: z.email("Please enter a valid email address"),
});

export async function POST(request: Request) {
  try {
    // Rate limit: 3 requests per hour
    const rateLimitResponse = await checkRateLimit(
      `manage-link:${getClientIp(request)}`,
      { requests: 3, window: "1 h" }
    );
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const supabase = await createServiceClient();

    const { data: subscriber } = await supabase
      .from("newsletter_subscribers")
      .select("manage_token, verified")
      .eq("email", email)
      .single();

    // Always return success to prevent email enumeration
    if (!subscriber || !subscriber.verified) {
      return NextResponse.json({
        message: "If this email is subscribed, you'll receive a management link shortly.",
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";
    const manageUrl = `${siteUrl}/newsletter/manage?token=${subscriber.manage_token}`;

    await sendEmail({
      to: email,
      subject: "Manage Your Riverlands Newsletter Preferences",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="margin:0;padding:0;background-color:#f5f3ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3ef;padding:32px 16px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
                  <tr>
                    <td style="background-color:#1B4965;padding:24px 32px;border-radius:8px 8px 0 0;">
                      <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:1px;">RIVER</span><span style="font-size:20px;font-weight:400;color:#C6923A;letter-spacing:1px;">LANDS</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color:#ffffff;padding:32px;">
                      <h2 style="margin:0 0 16px;color:#1B4965;font-size:20px;">Manage Your Newsletter</h2>
                      <p style="color:#333;line-height:1.6;">You requested a link to manage your newsletter preferences. Click the button below to update your settings or unsubscribe.</p>
                      <div style="text-align:center;margin:24px 0;">
                        <a href="${manageUrl}" style="display:inline-block;padding:12px 32px;background-color:#C6923A;color:#1B4965;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;">Manage Preferences</a>
                      </div>
                      <p style="color:#999;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
                      <p style="color:#999;font-size:13px;margin-top:16px;">Or copy this link: ${manageUrl}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 32px;text-align:center;color:#999;font-size:12px;border-radius:0 0 8px 8px;background-color:#ffffff;border-top:1px solid #eee;">
                      <p style="margin:0;">&copy; ${new Date().getFullYear()} Riverlands. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      message: "If this email is subscribed, you'll receive a management link shortly.",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
