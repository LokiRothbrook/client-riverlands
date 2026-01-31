import type { Metadata } from "next";
import Link from "next/link";
import { counties } from "@/lib/counties";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Explore the Region",
  description:
    "Explore the seven river counties of western Illinois with our interactive map. Find historic sites, events, businesses, and points of interest.",
};

export default function ExplorePage() {
  return (
    <>
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

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Map placeholder */}
        <div className="relative overflow-hidden rounded-xl border">
          <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-sage/10 via-river-blue/5 to-amber/5">
            <div className="text-center">
              <HugeiconsIcon
                icon={Location01Icon}
                size={48}
                className="mx-auto text-primary/30"
              />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                Interactive Map Coming Soon
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Leaflet + OpenStreetMap integration with county boundaries,
                historic sites, and points of interest
              </p>
            </div>
          </div>
        </div>

        {/* Filter categories */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Badge className="cursor-pointer bg-primary px-4 py-2 text-primary-foreground">
            All
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer px-4 py-2 hover:bg-secondary"
          >
            Historic Sites
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer px-4 py-2 hover:bg-secondary"
          >
            Events
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer px-4 py-2 hover:bg-secondary"
          >
            Businesses
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer px-4 py-2 hover:bg-secondary"
          >
            Outdoors
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer px-4 py-2 hover:bg-secondary"
          >
            Museums
          </Badge>
        </div>

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
