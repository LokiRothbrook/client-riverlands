import type { Metadata } from "next";
import Link from "next/link";
import { counties } from "@/lib/counties";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

export const metadata: Metadata = {
  title: "All Counties",
  description:
    "Explore all seven river counties of western Illinois — Adams, Pike, Brown, Schuyler, Calhoun, Scott, and Morgan. History, events, businesses, and outdoor adventures.",
};

const countyHighlights: Record<string, string[]> = {
  adams: [
    "Lincoln-Douglas Debate Site",
    "Underground Railroad Heritage",
    "Villa Kathrine",
    "100+ Historic Landmarks",
  ],
  pike: [
    "Lincoln's Talking Houses Tour",
    "New Philadelphia National Landmark",
    "Pike County Courthouse",
    "550+ Lincoln Legal Cases",
  ],
  brown: [
    "Oldest County Fair in Illinois",
    "Whistle Stop Depot Museum",
    "Premier Deer Hunting",
    "Mount Sterling Historic District",
  ],
  schuyler: [
    "1882 Jail Museum",
    "Phoenix Opera House",
    "Carnegie Library",
    "1938 Post Office Mural",
  ],
  calhoun: [
    "Bald Eagle Watching",
    "Brussels Historic District",
    "Joe Page Lift Bridge",
    "Famous Peach Orchards",
  ],
  scott: [
    "Winchester Burgoo Festival",
    "Stephen A. Douglas History",
    "Potawatomi Trail of Death",
    "Old School Museum",
  ],
  morgan: [
    "Underground Railroad Sites",
    "Big Eli Ferris Wheel",
    "Governor Duncan Mansion",
    "Illinois College (1st in State)",
  ],
};

const countyGradients = [
  "from-river-blue/25 via-river-blue/10 to-transparent",
  "from-amber/25 via-amber/10 to-transparent",
  "from-sage/25 via-sage/10 to-transparent",
  "from-rustic-red/20 via-amber/10 to-transparent",
  "from-river-blue/20 via-sage/10 to-transparent",
  "from-amber/20 via-rustic-red/10 to-transparent",
  "from-sage/20 via-river-blue/10 to-transparent",
];

export default function CountiesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Counties", url: `${SITE_URL}/counties` },
        ])}
      />

      {/* Hero */}
      <section className="bg-river-blue py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Explore Our Counties
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Seven counties, countless stories. Each shaped by the Mississippi
            and Illinois rivers, with its own character, history, and hidden
            gems waiting to be discovered.
          </p>
        </div>
      </section>

      <div className="border-b bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Counties" }]} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {counties.map((county, i) => (
            <Link key={county.slug} href={`/counties/${county.slug}`}>
              <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div className="flex flex-col sm:flex-row">
                  {/* Image placeholder */}
                  <div
                    className={`aspect-[16/10] w-full bg-gradient-to-br ${countyGradients[i]} sm:aspect-auto sm:w-72 sm:flex-shrink-0 lg:w-80`}
                  />

                  {/* Content */}
                  <CardContent className="flex flex-1 flex-col justify-center p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                      <HugeiconsIcon
                        icon={Location01Icon}
                        size={18}
                        className="text-amber"
                      />
                      <span className="text-sm font-medium text-muted-foreground">
                        County Seat: {county.seat}
                      </span>
                    </div>

                    <h2 className="mt-2 text-2xl font-bold text-foreground group-hover:text-primary sm:text-3xl">
                      {county.name}
                    </h2>

                    <p className="mt-3 text-muted-foreground">
                      {county.description}
                    </p>

                    {/* Highlights */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(countyHighlights[county.slug] || []).map(
                        (highlight) => (
                          <Badge
                            key={highlight}
                            variant="secondary"
                            className="text-xs"
                          >
                            {highlight}
                          </Badge>
                        )
                      )}
                    </div>

                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Explore {county.name}
                      <HugeiconsIcon
                        icon={ArrowRight02Icon}
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
