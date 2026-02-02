import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Riverlands privacy policy — how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Privacy Policy", url: `${SITE_URL}/privacy` },
        ])}
      />

      <section className="bg-river-blue py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Last updated: January 2026
          </p>
        </div>
      </section>

      <div className="border-b bg-secondary/30">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          <Breadcrumb items={[{ label: "Privacy Policy" }]} />
        </div>
      </div>

      <article className="prose prose-lg mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold text-foreground">Information We Collect</h2>
        <p className="text-muted-foreground">
          We collect information you provide directly, such as your email address when
          subscribing to our newsletter or submitting a contact form. We also collect
          basic analytics data to understand how visitors use our site.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">How We Use Your Information</h2>
        <p className="text-muted-foreground">
          We use your information to deliver our newsletter, respond to inquiries,
          improve our website, and communicate updates about events and stories
          from the river counties. We do not sell your personal information.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">Newsletter</h2>
        <p className="text-muted-foreground">
          If you subscribe to our newsletter, we store your email address and county
          preferences. You can unsubscribe at any time using the link in any newsletter
          email. We use Resend to deliver our newsletters.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">Analytics</h2>
        <p className="text-muted-foreground">
          We use privacy-friendly analytics to understand site usage. This helps us
          improve content and user experience. We do not track individual users or
          create advertising profiles.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">Cookies</h2>
        <p className="text-muted-foreground">
          We use only essential cookies required for the site to function properly.
          We do not use third-party advertising cookies or tracking pixels.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">Contact</h2>
        <p className="text-muted-foreground">
          If you have questions about this privacy policy, please contact us at{" "}
          <a href="mailto:info@riverlands.com" className="text-primary hover:text-primary/80">
            info@riverlands.com
          </a>.
        </p>
      </article>
    </>
  );
}
