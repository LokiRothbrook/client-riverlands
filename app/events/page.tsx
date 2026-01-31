import type { Metadata } from "next";
import { events } from "@/lib/placeholder-data";
import { counties } from "@/lib/counties";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Location01Icon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Discover upcoming events across the seven river counties of western Illinois. Festivals, tours, cultural events, and outdoor activities.",
};

export default function EventsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-river-blue py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Events Calendar
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Festivals, heritage tours, cultural events, and outdoor activities
            happening across the river counties.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Filter badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className="cursor-pointer bg-primary text-primary-foreground">
            All Events
          </Badge>
          {counties.map((county) => (
            <Badge
              key={county.slug}
              variant="outline"
              className="cursor-pointer hover:bg-secondary"
            >
              {county.name}
            </Badge>
          ))}
        </div>

        {/* Events list */}
        <div className="mt-8 space-y-4">
          {events.map((event) => (
            <Card key={event.title} className="transition-shadow hover:shadow-md">
              <CardContent className="flex gap-5 p-6">
                <div className="flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <HugeiconsIcon icon={Calendar03Icon} size={20} />
                  <span className="mt-1 text-xs font-medium">
                    {event.date.split(" ")[0]}
                  </span>
                  <span className="text-lg font-bold leading-none">
                    {event.date.split(" ")[1]?.replace(",", "")}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {event.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {event.county} County
                    </span>
                  </div>
                  <h2 className="mt-1 text-lg font-semibold text-foreground">
                    {event.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {event.description}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <HugeiconsIcon icon={Calendar03Icon} size={12} />
                      {event.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <HugeiconsIcon icon={Location01Icon} size={12} />
                      {event.location}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
