import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";

const placeholderEvents = [
  {
    title: "Quincy Museum Passport Weekend",
    date: "Feb 15-16, 2026",
    location: "Quincy, IL",
    county: "Adams",
    category: "Culture",
    description:
      "Buy-one-get-one-free admission to 10 of Quincy's museums with the complimentary Museum Passport.",
  },
  {
    title: "Bald Eagle Days at Two Rivers",
    date: "Feb 22, 2026",
    location: "Brussels, IL",
    county: "Calhoun",
    category: "Outdoors",
    description:
      "Join naturalists at the Two Rivers National Wildlife Refuge for guided eagle watching along the river.",
  },
  {
    title: "Pittsfield Lincoln Heritage Walk",
    date: "Mar 7, 2026",
    location: "Pittsfield, IL",
    county: "Pike",
    category: "History",
    description:
      "Guided walking tour of Abraham Lincoln-associated sites with local historians.",
  },
  {
    title: "Winchester Burgoo Festival",
    date: "Mar 14, 2026",
    location: "Winchester, IL",
    county: "Scott",
    category: "Festival",
    description:
      "Annual celebration of community and food featuring the traditional burgoo stew and live entertainment.",
  },
];

export function UpcomingEvents() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Upcoming Events
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              What&apos;s happening across the region
            </p>
          </div>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/events">View all events</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {placeholderEvents.map((event) => (
            <Card key={event.title} className="transition-shadow hover:shadow-md">
              <CardContent className="flex gap-4 p-5">
                {/* Date block */}
                <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="text-xs font-medium uppercase">
                    {event.date.split(" ")[0]}
                  </span>
                  <span className="text-lg font-bold leading-none">
                    {event.date.split(" ")[1]?.replace(",", "")}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {event.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {event.county} County
                    </span>
                  </div>
                  <h3 className="mt-1 font-semibold text-foreground">
                    {event.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {event.description}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
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

        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/events">View all events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
