/**
 * Escape HTML entities for safe display in email HTML context.
 */
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f3ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3ef;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background-color:#1B4965;padding:24px 32px;border-radius:8px 8px 0 0;">
              <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:1px;">RIVER</span><span style="font-size:20px;font-weight:400;color:#C6923A;letter-spacing:1px;">LANDS</span>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="background-color:#ffffff;padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px;text-align:center;color:#999;font-size:12px;border-radius:0 0 8px 8px;background-color:#ffffff;border-top:1px solid #eee;">
              <p style="margin:0;">&copy; ${new Date().getFullYear()} Riverlands. All rights reserved.</p>
              <p style="margin:4px 0 0;"><a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org"}" style="color:#1B4965;text-decoration:none;">riverlands.org</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function contactNotificationTemplate({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  return baseLayout(`
    <h2 style="margin:0 0 16px;color:#1B4965;font-size:20px;">New Contact Message</h2>
    <table style="width:100%;margin-bottom:16px;">
      <tr><td style="padding:4px 8px;color:#666;font-weight:600;">From:</td><td style="padding:4px 8px;">${safeName}</td></tr>
      <tr><td style="padding:4px 8px;color:#666;font-weight:600;">Email:</td><td style="padding:4px 8px;"><a href="mailto:${safeEmail}" style="color:#1B4965;">${safeEmail}</a></td></tr>
      <tr><td style="padding:4px 8px;color:#666;font-weight:600;">Subject:</td><td style="padding:4px 8px;">${safeSubject}</td></tr>
    </table>
    <div style="background-color:#f9f8f6;padding:16px;border-radius:6px;color:#333;line-height:1.6;">
      ${safeMessage}
    </div>
  `);
}

export function partnerRequestConfirmationTemplate({
  contactName,
  businessName,
}: {
  contactName: string;
  businessName: string;
}): string {
  const safeContactName = escapeHtml(contactName);
  const safeBusinessName = escapeHtml(businessName);

  return baseLayout(`
    <h2 style="margin:0 0 16px;color:#1B4965;font-size:20px;">Application Received</h2>
    <p style="color:#333;line-height:1.6;">Hi ${safeContactName},</p>
    <p style="color:#333;line-height:1.6;">Thank you for submitting a partner application for <strong>${safeBusinessName}</strong>. We've received your request and our team will review it shortly.</p>
    <p style="color:#333;line-height:1.6;">You'll receive an email once your application has been reviewed. In the meantime, feel free to <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org"}/contact" style="color:#1B4965;">contact us</a> if you have any questions.</p>
    <p style="color:#333;line-height:1.6;">Best regards,<br>The Riverlands Team</p>
  `);
}

export function partnerRequestAdminTemplate({
  businessName,
  contactName,
  email,
  county,
}: {
  businessName: string;
  contactName: string;
  email: string;
  county: string;
}): string {
  const adminUrl =
    process.env.NEXT_PUBLIC_ADMIN_URL || "https://admin.riverlands.org";
  const safeBusinessName = escapeHtml(businessName);
  const safeContactName = escapeHtml(contactName);
  const safeEmail = escapeHtml(email);
  const safeCounty = escapeHtml(county);

  return baseLayout(`
    <h2 style="margin:0 0 16px;color:#1B4965;font-size:20px;">New Partner Application</h2>
    <table style="width:100%;margin-bottom:16px;">
      <tr><td style="padding:4px 8px;color:#666;font-weight:600;">Business:</td><td style="padding:4px 8px;">${safeBusinessName}</td></tr>
      <tr><td style="padding:4px 8px;color:#666;font-weight:600;">Contact:</td><td style="padding:4px 8px;">${safeContactName}</td></tr>
      <tr><td style="padding:4px 8px;color:#666;font-weight:600;">Email:</td><td style="padding:4px 8px;"><a href="mailto:${safeEmail}" style="color:#1B4965;">${safeEmail}</a></td></tr>
      <tr><td style="padding:4px 8px;color:#666;font-weight:600;">County:</td><td style="padding:4px 8px;">${safeCounty}</td></tr>
    </table>
    <a href="${adminUrl}/partner-requests" style="display:inline-block;padding:10px 20px;background-color:#C6923A;color:#1B4965;text-decoration:none;border-radius:6px;font-weight:600;">Review Application</a>
  `);
}

export function newsletterVerificationTemplate({
  verifyUrl,
}: {
  verifyUrl: string;
}): string {
  return baseLayout(`
    <h2 style="margin:0 0 16px;color:#1B4965;font-size:20px;">Verify Your Email</h2>
    <p style="color:#333;line-height:1.6;">Thanks for subscribing to the Riverlands newsletter! Click the button below to verify your email address.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${verifyUrl}" style="display:inline-block;padding:12px 32px;background-color:#C6923A;color:#1B4965;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;">Verify Email</a>
    </div>
    <p style="color:#999;font-size:13px;">If you didn't subscribe, you can safely ignore this email.</p>
  `);
}

export function adminNotificationTemplate({
  subject,
  message,
}: {
  subject: string;
  message: string;
}): string {
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  return baseLayout(`
    <h2 style="margin:0 0 16px;color:#1B4965;font-size:20px;">${safeSubject}</h2>
    <div style="color:#333;line-height:1.6;">
      ${safeMessage}
    </div>
  `);
}
