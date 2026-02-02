"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { counties } from "@/lib/counties";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Location01Icon,
  Menu02Icon,
  GridIcon,
} from "@hugeicons/core-free-icons";
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

type ViewMode = "list" | "calendar";

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++) days.push(d);
  return days;
}

function CalendarView({ events }: { events: PublishedEvent[] }) {
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  const days = getCalendarDays(calYear, calMonth);
  const monthLabel = new Date(calYear, calMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Index events by day number in this month
  const eventsByDay: Record<number, PublishedEvent[]> = {};
  events.forEach((event) => {
    const d = new Date(event.startDate + "T00:00:00");
    if (d.getFullYear() === calYear && d.getMonth() === calMonth) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(event);
    }
  });

  function prevMonth() {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  }

  function nextMonth() {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={prevMonth}>
          &larr; Prev
        </Button>
        <h3 className="text-lg font-semibold text-foreground">{monthLabel}</h3>
        <Button variant="outline" size="sm" onClick={nextMonth}>
          Next &rarr;
        </Button>
      </div>

      <div className="grid grid-cols-7 border-l border-t">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="border-b border-r bg-secondary/50 px-1 py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {d}
          </div>
        ))}
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`min-h-[80px] border-b border-r p-1 sm:min-h-[100px] ${
              day === null ? "bg-secondary/20" : ""
            }`}
          >
            {day !== null && (
              <>
                <span className="text-xs font-medium text-muted-foreground">
                  {day}
                </span>
                <div className="mt-0.5 space-y-0.5">
                  {(eventsByDay[day] || []).map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="block truncate rounded bg-primary/10 px-1 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20 sm:text-xs"
                      title={event.title}
                    >
                      {event.title}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EventsFilter({ events }: { events: PublishedEvent[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeCounty = searchParams.get("county") || "all";
  const [viewMode, setViewMode] = useState<ViewMode>("list");

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
        <div className="flex gap-1">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <HugeiconsIcon icon={Menu02Icon} size={16} />
            <span className="ml-1 hidden sm:inline">List</span>
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            <HugeiconsIcon icon={GridIcon} size={16} />
            <span className="ml-1 hidden sm:inline">Calendar</span>
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {viewMode === "calendar" ? (
          <CalendarView events={filteredEvents} />
        ) : filteredEvents.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No events found for this county.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const { month, day } = getDateParts(event.startDate);
              return (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="transition-shadow hover:shadow-md">
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
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {event.description}
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <HugeiconsIcon icon={Calendar03Icon} size={12} />
                            {formatDate(event.startDate)}
                            {event.endDate &&
                              ` – ${formatDate(event.endDate)}`}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <HugeiconsIcon icon={Location01Icon} size={12} />
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
