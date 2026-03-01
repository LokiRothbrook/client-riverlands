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
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import type { PublishedEvent } from "@/lib/queries";

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

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

interface MiniCalendarProps {
  events: PublishedEvent[];
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
}

function MiniCalendar({ events, selectedDate, onSelectDate }: MiniCalendarProps) {
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
    const d = new Date(event.startDate);
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

  function handleDayClick(day: number) {
    const clickedDate = new Date(calYear, calMonth, day);
    if (selectedDate && isSameDay(selectedDate, clickedDate)) {
      onSelectDate(null); // Deselect if clicking same date
    } else {
      onSelectDate(clickedDate);
    }
  }

  const today = new Date();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={prevMonth} className="h-8 w-8 p-0">
            <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
          </Button>
          <h3 className="text-sm font-semibold text-foreground">{monthLabel}</h3>
          <Button variant="ghost" size="sm" onClick={nextMonth} className="h-8 w-8 p-0">
            <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div
              key={i}
              className="py-1 text-center text-[10px] font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}
          {days.map((day, idx) => {
            const hasEvents = day !== null && eventsByDay[day]?.length > 0;
            const isToday =
              day !== null &&
              today.getFullYear() === calYear &&
              today.getMonth() === calMonth &&
              today.getDate() === day;
            const isSelected =
              day !== null &&
              selectedDate &&
              selectedDate.getFullYear() === calYear &&
              selectedDate.getMonth() === calMonth &&
              selectedDate.getDate() === day;

            return (
              <button
                key={idx}
                onClick={() => day !== null && handleDayClick(day)}
                disabled={day === null}
                className={`relative flex h-8 w-full items-center justify-center rounded text-xs transition-colors
                  ${day === null ? "cursor-default" : "cursor-pointer hover:bg-secondary"}
                  ${isToday ? "font-bold text-primary" : "text-foreground"}
                  ${isSelected ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
                `}
              >
                {day}
                {hasEvents && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-amber" />
                )}
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectDate(null)}
            className="mt-3 w-full text-xs"
          >
            Clear date filter
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function EventsFilter({ events }: { events: PublishedEvent[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeCounty = searchParams.get("county") || "all";
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  function setFilter(county: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (county === "all") {
      params.delete("county");
    } else {
      params.set("county", county);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  // Filter by county first
  const countyFilteredEvents =
    activeCounty === "all"
      ? events
      : events.filter((e) => e.countySlug === activeCounty);

  // Then filter by selected date if any
  const filteredEvents = selectedDate
    ? countyFilteredEvents.filter((e) => {
        const eventDate = new Date(e.startDate);
        return isSameDay(eventDate, selectedDate);
      })
    : countyFilteredEvents;

  return (
    <>
      {/* County filter badges */}
      <div className="flex flex-wrap gap-2">
        <Badge
          className={`cursor-pointer ${
            activeCounty === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
          onClick={() => setFilter("all")}
        >
          All Counties
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

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar with calendar */}
        <div className="order-2 lg:order-1">
          <div className="sticky top-24">
            <MiniCalendar
              events={countyFilteredEvents}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            {/* Quick stats */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {countyFilteredEvents.length}
                  </span>{" "}
                  upcoming event{countyFilteredEvents.length !== 1 ? "s" : ""}
                  {activeCounty !== "all" && (
                    <> in {counties.find((c) => c.slug === activeCounty)?.name}</>
                  )}
                </p>
                {selectedDate && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {filteredEvents.length}
                    </span>{" "}
                    on{" "}
                    {selectedDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Event list */}
        <div className="order-1 lg:order-2">
          {selectedDate && (
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Badge>
            </div>
          )}

          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  size={40}
                  className="mx-auto text-muted-foreground/50"
                />
                <p className="mt-4 text-muted-foreground">
                  {selectedDate
                    ? "No events on this date."
                    : "No events found for this county."}
                </p>
                {selectedDate && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate(null)}
                    className="mt-4"
                  >
                    View all events
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => {
                const { month, day } = getDateParts(event.startDate);
                return (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <Card className="transition-shadow hover:shadow-md">
                      <CardContent className="flex gap-5 p-5">
                        <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <span className="text-[10px] font-medium uppercase">
                            {month}
                          </span>
                          <span className="text-xl font-bold leading-none">
                            {day}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {event.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {event.countyName}
                            </span>
                          </div>
                          <h2 className="mt-1 font-semibold text-foreground truncate">
                            {event.title}
                          </h2>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {event.description}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
