import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  Calendar03Icon,
  Store01Icon,
  Book01Icon,
} from "@hugeicons/core-free-icons";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";
import { PageBanner } from "@/components/page-banner";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Riverlands — your guide to the historic river counties of western Illinois.",
};

const features = [
  {
    icon: Location01Icon,
    title: "7 Counties, 1 Destination",
    description:
      "We cover Adams, Pike, Brown, Schuyler, Calhoun, Scott, and Morgan counties — the heart of western Illinois along the Mississippi and Illinois rivers.",
  },
  {
    icon: Book01Icon,
    title: "Rich History",
    description:
      "From Abraham Lincoln's law practice to the Underground Railroad, our region holds some of the most important stories in American history.",
  },
  {
    icon: Calendar03Icon,
    title: "Local Events",
    description:
      "Stay up to date with festivals, heritage tours, outdoor activities, and community celebrations happening across the region.",
  },
  {
    icon: Store01Icon,
    title: "Local Businesses",
    description:
      "Discover locally-owned businesses, restaurants, lodging, and attractions that make each community unique.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
        ])}
      />

      {/* Hero */}
      <PageBanner>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            About Riverlands
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Your guide to the historic river counties of western Illinois.
          </p>
        </div>
      </PageBanner>

      <div className="border-b bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "About" }]} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Mission */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Riverlands exists to celebrate and promote the seven river counties
            of western Illinois. We believe this region — with its deep
            historical roots, natural beauty, and tight-knit communities —
            deserves to be discovered, explored, and appreciated.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Whether you&apos;re a lifelong resident, a returning visitor, or
            discovering the area for the first time, Riverlands is your guide to
            everything this remarkable region has to offer.
          </p>
        </div>

        {/* Features */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <HugeiconsIcon
                    icon={feature.icon}
                    size={24}
                    className="text-primary"
                  />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* The Region */}
        <div className="mt-16">
          <h2 className="text-center text-3xl font-bold text-foreground">
            The Region
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-muted-foreground">
            Stretching along the Mississippi and Illinois rivers in western
            Illinois, these seven counties share a common heritage shaped by
            the waterways that define them. The rivers brought settlers,
            commerce, and culture — and today they continue to draw visitors
            with their scenic beauty and recreational opportunities.
          </p>
          <div className="mt-8 aspect-[21/9] rounded-xl bg-gradient-to-r from-river-blue/20 via-sage/15 to-amber/10" />
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-foreground">Get Involved</h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
            Want to contribute a story, list your business, or partner with
            Riverlands? We&apos;d love to hear from you.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/partners/apply">Become a Partner</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/advertise">Advertise With Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
