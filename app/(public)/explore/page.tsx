import type { Metadata } from "next";
import Link from "next/link";
import { counties, getCountyBySlug } from "@/lib/counties";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon } from "@hugeicons/core-free-icons";
import { ExploreMapFilter } from "@/components/map/explore-map-filter";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";
import { getUpcomingEvents, getActivePartners } from "@/lib/queries";
import type { MapMarker } from "@/components/map/region-map";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

// Deterministic offset to spread markers around a county center
function offsetFor(index: number, total: number): [number, number] {
  const angle = (index / Math.max(total, 1)) * 2 * Math.PI;
  const radius = 0.02 + (index % 3) * 0.008;
  return [Math.cos(angle) * radius, Math.sin(angle) * radius];
}

export const metadata: Metadata = {
  title: "Explore the Region",
  description:
    "Explore the seven river counties of western Illinois with our interactive map. Find historic sites, events, businesses, and points of interest.",
};

export default async function ExplorePage() {
  const [events, partners] = await Promise.all([
    getUpcomingEvents(),
    getActivePartners(),
  ]);

  // Build markers from events — place around their county's coordinates
  const eventMarkers: MapMarker[] = events.flatMap((event, i) => {
    const county = getCountyBySlug(event.countySlug);
    if (!county) return [];
    const [dlat, dlng] = offsetFor(i, events.length);
    return [
      {
        id: event.id,
        label: event.title,
        description: event.location,
        lat: county.lat + dlat,
        lng: county.lng + dlng,
        type: "event" as const,
        href: `/events/${event.id}`,
      },
    ];
  });

  // Build markers from partners — place around their county's coordinates
  const partnerMarkers: MapMarker[] = partners.flatMap((partner, i) => {
    const county = getCountyBySlug(partner.countySlug);
    if (!county) return [];
    const [dlat, dlng] = offsetFor(i, partners.length);
    return [
      {
        id: partner.id,
        label: partner.name,
        description: partner.category,
        lat: county.lat + dlat,
        lng: county.lng + dlng,
        type: "partner" as const,
        href: `/partners/${partner.slug}`,
      },
    ];
  });

  const allMarkers = [...eventMarkers, ...partnerMarkers];

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
        {/* Interactive Map with filters */}
        <ExploreMapFilter markers={allMarkers} />

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
