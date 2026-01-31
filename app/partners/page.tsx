import type { Metadata } from "next";
import Link from "next/link";
import { partners } from "@/lib/placeholder-data";
import { counties } from "@/lib/counties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Store01Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Partners & Business Directory",
  description:
    "Discover local businesses, attractions, and services across the seven river counties of western Illinois.",
};

export default function PartnersPage() {
  const featuredPartners = partners.filter((p) => p.featured);
  const allPartners = partners;

  return (
    <>
      {/* Hero */}
      <section className="bg-river-blue py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Partners &amp; Business Directory
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Local businesses, attractions, and services that make the river
            counties special. Support local — explore what our communities
            have to offer.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Featured */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Featured Partners
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredPartners.map((partner) => (
              <Card
                key={partner.name}
                className="group transition-shadow hover:shadow-md"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-amber/20 via-sage/10 to-river-blue/10" />
                <CardContent className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10">
                    <HugeiconsIcon
                      icon={Store01Icon}
                      size={18}
                      className="text-amber"
                    />
                  </div>
                  <h3 className="mt-3 font-semibold text-foreground">
                    {partner.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {partner.category}
                    </Badge>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {partner.description}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {partner.county}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Partners */}
        <div className="mt-16">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              All Listings
            </h2>
            <div className="flex flex-wrap gap-2">
              {counties.map((county) => (
                <Badge
                  key={county.slug}
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary"
                >
                  {county.name.replace(" County", "")}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allPartners.map((partner) => (
              <Card key={partner.name} className="transition-shadow hover:shadow-md">
                <CardContent className="flex gap-4 p-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-amber/10">
                    <HugeiconsIcon
                      icon={Store01Icon}
                      size={20}
                      className="text-amber"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {partner.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {partner.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {partner.county}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {partner.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Become a partner CTA */}
        <div className="mt-16 rounded-xl bg-secondary/50 px-6 py-10 text-center sm:px-12">
          <h2 className="text-2xl font-bold text-foreground">
            Own a Local Business?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
            Join our directory and get exposure to visitors exploring the river
            counties. Featured listings receive prominent placement across the
            site.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/partners/apply">
              Apply to Become a Partner
              <HugeiconsIcon icon={ArrowRight02Icon} size={16} className="ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
