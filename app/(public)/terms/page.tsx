import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Riverlands terms of use for visitors and partners.",
};

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Terms of Use", url: `${SITE_URL}/terms` },
        ])}
      />

      <section className="bg-river-blue py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Terms of Use
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Last updated: January 2026
          </p>
        </div>
      </section>

      <div className="border-b bg-secondary/30">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          <Breadcrumb items={[{ label: "Terms of Use" }]} />
        </div>
      </div>

      <article className="prose prose-lg mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold text-foreground">Acceptance of Terms</h2>
        <p className="text-muted-foreground">
          By accessing and using Riverlands, you agree to be bound by these terms.
          If you do not agree with any part of these terms, please do not use our site.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">Use of Content</h2>
        <p className="text-muted-foreground">
          Content on Riverlands — including articles, photographs, and event listings — is
          provided for informational purposes. You may share links to our content, but
          reproduction of full articles or images requires written permission.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">Partner Listings</h2>
        <p className="text-muted-foreground">
          Business listings and partner information are provided as a service to our
          visitors. Riverlands is not responsible for the products, services, or
          practices of listed businesses. We encourage you to verify details directly
          with each business.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">Event Information</h2>
        <p className="text-muted-foreground">
          Event dates, times, and details are published in good faith. However, events
          may be subject to change or cancellation. We recommend confirming event details
          with the organizer before attending.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">Affiliate Links</h2>
        <p className="text-muted-foreground">
          Some links on our site may be affiliate links, meaning we earn a small
          commission if you make a purchase through them. This does not affect the price
          you pay. We only recommend services we believe are relevant to visitors of the
          river counties.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">Advertising</h2>
        <p className="text-muted-foreground">
          Advertisements on Riverlands are clearly identified. Paid placements do not
          constitute an endorsement. Advertisers are responsible for the accuracy of
          their ad content.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-foreground">Contact</h2>
        <p className="text-muted-foreground">
          Questions about these terms? Contact us at{" "}
          <a href="mailto:info@riverlands.com" className="text-primary hover:text-primary/80">
            info@riverlands.com
          </a>.
        </p>
      </article>
    </>
  );
}
