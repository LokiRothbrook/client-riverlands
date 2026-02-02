import type { Metadata } from "next";
import Link from "next/link";
import { counties } from "@/lib/counties";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon } from "@hugeicons/core-free-icons";
import { MapWrapper } from "@/components/map/map-wrapper";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

export const metadata: Metadata = {
  title: "Explore the Region",
  description:
    "Explore the seven river counties of western Illinois with our interactive map. Find historic sites, events, businesses, and points of interest.",
};

export default function ExplorePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Explore", url: `${SITE_URL}/explore` },
        ])}
      />

      {/* Hero */}
      <section className="bg-river-blue py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Explore the Region
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Discover historic sites, local businesses, events, and points of
            interest across the seven river counties.
          </p>
        </div>
      </section>

      <div className="border-b bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Explore" }]} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Interactive Map */}
        <MapWrapper />

        {/* Counties grid */}
        <div className="mt-12">
          <h2 className="text-center text-2xl font-bold text-foreground">
            Browse by County
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {counties.map((county) => (
              <Link key={county.slug} href={`/counties/${county.slug}`}>
                <Card className="group cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <HugeiconsIcon
                          icon={Location01Icon}
                          size={18}
                          className="text-primary"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary">
                          {county.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {county.seat}, IL
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      {county.shortDescription}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
