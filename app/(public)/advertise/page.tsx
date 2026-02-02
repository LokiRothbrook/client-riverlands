import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

export const metadata: Metadata = {
  title: "Advertise With Us",
  description:
    "Reach visitors exploring the seven river counties of western Illinois. Multiple ad placement options available.",
};

const placements = [
  {
    name: "Homepage Banner",
    description:
      "Premium placement at the top of the homepage. Maximum visibility with every visitor to the site.",
    location: "Homepage, above the fold",
    bestFor: "Regional businesses, tourism services, major events",
  },
  {
    name: "County Page Sidebar",
    description:
      "Targeted ads on specific county pages. Reach visitors interested in a particular area.",
    location: "County pages, sidebar",
    bestFor: "Local businesses, county-specific services",
  },
  {
    name: "In-Article Placement",
    description:
      "Contextual ads placed within blog posts and articles. Integrated naturally with content.",
    location: "Blog posts and articles",
    bestFor: "Tourism services, local attractions, seasonal promotions",
  },
  {
    name: "Footer Banner",
    description:
      "Persistent placement across all pages of the site. Seen on every page visit.",
    location: "Site-wide footer",
    bestFor: "Brand awareness, ongoing promotions",
  },
];

export default function AdvertisePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Advertise", url: `${SITE_URL}/advertise` },
        ])}
      />

      {/* Hero */}
      <section className="bg-river-blue py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Advertise With Us
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Reach visitors exploring the river counties of western Illinois.
            Connect your business with travelers, locals, and history
            enthusiasts.
          </p>
        </div>
      </section>

      <div className="border-b bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Advertise" }]} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Why advertise */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Why Advertise on Riverlands?
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <div className="text-3xl font-bold text-primary">7</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Counties covered
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">Targeted</div>
              <p className="mt-1 text-sm text-muted-foreground">
                County-specific placements
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">Local</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Audience interested in your area
              </p>
            </div>
          </div>
        </div>

        {/* Placement options */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold text-foreground">
            Placement Options
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {placements.map((placement) => (
              <Card key={placement.name} className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-foreground">
                    {placement.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {placement.description}
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Location
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {placement.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Best for
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {placement.bestFor}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-xl bg-river-blue px-6 py-12 text-center sm:px-12">
          <h2 className="text-3xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/80">
            Contact us to discuss rates, placement options, and how we can help
            your business reach visitors in the river counties.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 bg-amber text-river-blue-dark hover:bg-amber-light"
          >
            <Link href="/contact">Contact Us for Rates</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
