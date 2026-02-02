"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { counties } from "@/lib/counties";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Location01Icon } from "@hugeicons/core-free-icons";
import type { PublishedEvent } from "@/lib/queries";

function formatDate(isoDate: string): string {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDateParts(isoDate: string): { month: string; day: string } {
  const d = new Date(isoDate + "T00:00:00");
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }),
    day: d.getDate().toString(),
  };
}

export function EventsFilter({ events }: { events: PublishedEvent[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeCounty = searchParams.get("county") || "all";

  function setFilter(county: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (county === "all") {
      params.delete("county");
    } else {
      params.set("county", county);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const filteredEvents =
    activeCounty === "all"
      ? events
      : events.filter((e) => e.countySlug === activeCounty);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Badge
          className={`cursor-pointer ${
            activeCounty === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
          onClick={() => setFilter("all")}
        >
          All Events
        </Badge>
        {counties.map((county) => (
          <Badge
            key={county.slug}
            variant={activeCounty === county.slug ? "default" : "outline"}
            className="cursor-pointer hover:bg-secondary"
            onClick={() => setFilter(county.slug)}
          >
            {county.name}
          </Badge>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {filteredEvents.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No events found for this county.
          </p>
        ) : (
          filteredEvents.map((event) => {
            const { month, day } = getDateParts(event.startDate);
            return (
              <Card
                key={event.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardContent className="flex gap-5 p-6">
                  <div className="flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <HugeiconsIcon icon={Calendar03Icon} size={20} />
                    <span className="mt-1 text-xs font-medium uppercase">
                      {month}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {day}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {event.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {event.countyName}
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
                        {formatDate(event.startDate)}
                        {event.endDate && ` – ${formatDate(event.endDate)}`}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <HugeiconsIcon icon={Location01Icon} size={12} />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </>
  );
}
