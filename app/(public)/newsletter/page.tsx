import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Subscribe to the Riverlands newsletter and get the latest events, stories, and travel tips from the river counties of western Illinois.",
};

export default function NewsletterPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Newsletter", url: `${SITE_URL}/newsletter` },
        ])}
      />

      {/* Hero */}
      <section className="bg-river-blue py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Stay Connected
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Get the latest events, stories, and travel tips from across the
            river counties delivered to your inbox.
          </p>
        </div>
      </section>

      <div className="border-b bg-secondary/30">
        <div className="mx-auto max-w-xl px-4 py-3 sm:px-6">
          <Breadcrumb items={[{ label: "Newsletter" }]} />
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
        <Card>
          <CardHeader>
            <CardTitle>Subscribe to Our Newsletter</CardTitle>
          </CardHeader>
          <CardContent>
            <NewsletterForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
