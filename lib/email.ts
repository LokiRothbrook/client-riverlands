import { Resend } from "resend";
import {
  contactNotificationTemplate,
  partnerRequestConfirmationTemplate,
  partnerRequestAdminTemplate,
  newsletterVerificationTemplate,
  adminNotificationTemplate,
} from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Riverlands <noreply@riverlands.org>";
const ADMIN_EMAIL = "admin@riverlands.org";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
}

export async function sendContactNotification({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Riverlands Contact] ${subject}`,
    html: contactNotificationTemplate({ name, email, subject, message }),
  });
}

export async function sendPartnerRequestConfirmation({
  contactName,
  businessName,
  email,
}: {
  contactName: string;
  businessName: string;
  email: string;
}) {
  return sendEmail({
    to: email,
    subject: `Partner Application Received - ${businessName}`,
    html: partnerRequestConfirmationTemplate({ contactName, businessName }),
  });
}

export async function sendPartnerRequestAdminNotification({
  businessName,
  contactName,
  email,
  county,
}: {
  businessName: string;
  contactName: string;
  email: string;
  county: string;
}) {
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `[New Partner Application] ${businessName}`,
    html: partnerRequestAdminTemplate({
      businessName,
      contactName,
      email,
      county,
    }),
  });
}

export async function sendNewsletterVerification({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";
  const verifyUrl = `${siteUrl}/api/newsletter/verify?token=${token}`;

  return sendEmail({
    to: email,
    subject: "Verify your Riverlands newsletter subscription",
    html: newsletterVerificationTemplate({ verifyUrl }),
  });
}

export async function sendAdminNotification({
  subject,
  message,
}: {
  subject: string;
  message: string;
}) {
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Riverlands] ${subject}`,
    html: adminNotificationTemplate({ subject, message }),
  });
}
