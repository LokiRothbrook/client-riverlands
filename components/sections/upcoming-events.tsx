import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { getUpcomingEvents } from "@/lib/queries";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDateParts(dateStr: string): { month: string; day: string } {
  const d = new Date(dateStr);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }),
    day: d.getDate().toString(),
  };
}

export async function UpcomingEvents() {
  const events = await getUpcomingEvents(4);

  if (events.length === 0) return null;

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
          {events.map((event) => {
            const { month, day } = getDateParts(event.startDate);
            return (
              <Card
                key={event.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardContent className="flex gap-4 p-5">
                  <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="text-xs font-medium uppercase">
                      {month}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {day}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {event.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {event.countyName}
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
                        {formatDate(event.startDate)}
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
          })}
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
