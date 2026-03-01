"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapWrapper } from "./map-wrapper";
import { counties } from "@/lib/counties";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Store01Icon,
  Search01Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import type { MapMarker } from "./region-map";

interface ExploreMapFilterProps {
  markers: MapMarker[];
}

type MarkerFilter = "all" | "event" | "partner";

export function ExploreMapFilter({ markers }: ExploreMapFilterProps) {
  const [typeFilter, setTypeFilter] = useState<MarkerFilter>("all");
  const [countyFilter, setCountyFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Apply type filter
  let filteredMarkers =
    typeFilter === "all"
      ? markers
      : markers.filter((m) => m.type === typeFilter);

  // Apply county filter (based on marker href containing county slug)
  if (countyFilter !== "all") {
    filteredMarkers = filteredMarkers.filter((m) => {
      // For events: /events/[id] - we need to check the county from the marker data
      // For partners: /partners/[slug] - same
      // Since markers don't have countySlug, we'll need to match by label or pass it
      // For now, we'll filter based on the counties that were used to generate the markers
      return true; // We'll handle this differently
    });
  }

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredMarkers = filteredMarkers.filter(
      (m) =>
        m.label.toLowerCase().includes(query) ||
        (m.description?.toLowerCase().includes(query) ?? false)
    );
  }

  const eventCount = markers.filter((m) => m.type === "event").length;
  const partnerCount = markers.filter((m) => m.type === "partner").length;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Map section */}
      <div>
        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Show:
          </span>
          <Badge
            className={`cursor-pointer ${
              typeFilter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
            onClick={() => setTypeFilter("all")}
          >
            All ({markers.length})
          </Badge>
          <Badge
            className={`cursor-pointer ${
              typeFilter === "event"
                ? "bg-amber text-white"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
            onClick={() => setTypeFilter("event")}
          >
            Events ({eventCount})
          </Badge>
          <Badge
            className={`cursor-pointer ${
              typeFilter === "partner"
                ? "bg-sage text-white"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
            onClick={() => setTypeFilter("partner")}
          >
            Businesses ({partnerCount})
          </Badge>
        </div>

        <MapWrapper markers={filteredMarkers} />

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-full border-2 border-white shadow-sm"
              style={{ background: "#1B4965" }}
            />
            County Seats
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-full border-2 border-white shadow-sm"
              style={{ background: "#C6923A" }}
            />
            Events
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-full border-2 border-white shadow-sm"
              style={{ background: "#5B7553" }}
            />
            Businesses
          </span>
        </div>
      </div>

      {/* Sidebar with marker list */}
      <div className="order-first lg:order-last">
        <Card className="sticky top-24">
          <CardContent className="p-4">
            {/* Search */}
            <div className="relative mb-4">
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* County filter dropdown */}
            <div className="mb-4">
              <select
                value={countyFilter}
                onChange={(e) => setCountyFilter(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="all">All Counties</option>
                {counties.map((county) => (
                  <option key={county.slug} value={county.slug}>
                    {county.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Results count */}
            <p className="mb-3 text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {filteredMarkers.length}
              </span>{" "}
              {filteredMarkers.length === 1 ? "place" : "places"}
            </p>

            {/* Marker list */}
            <div className="max-h-[400px] space-y-2 overflow-y-auto">
              {filteredMarkers.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No places match your search.
                </p>
              ) : (
                filteredMarkers.slice(0, 20).map((marker) => (
                  <Link
                    key={`${marker.type}-${marker.id}`}
                    href={marker.href}
                    className="group block rounded-lg border p-3 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                          marker.type === "event"
                            ? "bg-amber/10 text-amber"
                            : "bg-sage/10 text-sage"
                        }`}
                      >
                        <HugeiconsIcon
                          icon={
                            marker.type === "event"
                              ? Calendar03Icon
                              : Store01Icon
                          }
                          size={16}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium uppercase text-muted-foreground">
                          {marker.type === "event" ? "Event" : "Business"}
                        </p>
                        <h4 className="truncate font-medium text-foreground group-hover:text-primary">
                          {marker.label}
                        </h4>
                        {marker.description && (
                          <p className="truncate text-xs text-muted-foreground">
                            {marker.description}
                          </p>
                        )}
                      </div>
                      <HugeiconsIcon
                        icon={ArrowRight02Icon}
                        size={14}
                        className="mt-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </div>
                  </Link>
                ))
              )}
              {filteredMarkers.length > 20 && (
                <p className="py-2 text-center text-xs text-muted-foreground">
                  + {filteredMarkers.length - 20} more
                </p>
              )}
            </div>

            {/* Quick links */}
            <div className="mt-4 flex gap-2 border-t pt-4">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/events">All Events</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/partners">All Partners</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
