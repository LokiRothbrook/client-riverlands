"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MapWrapper } from "./map-wrapper";
import type { MapMarker } from "./region-map";

interface ExploreMapFilterProps {
  markers: MapMarker[];
}

type MarkerFilter = "all" | "event" | "partner";

export function ExploreMapFilter({ markers }: ExploreMapFilterProps) {
  const [filter, setFilter] = useState<MarkerFilter>("all");

  const filteredMarkers =
    filter === "all" ? markers : markers.filter((m) => m.type === filter);

  const eventCount = markers.filter((m) => m.type === "event").length;
  const partnerCount = markers.filter((m) => m.type === "partner").length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Show:
        </span>
        <Badge
          className={`cursor-pointer ${
            filter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
          onClick={() => setFilter("all")}
        >
          All ({markers.length})
        </Badge>
        <Badge
          className={`cursor-pointer ${
            filter === "event"
              ? "bg-amber text-white"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
          onClick={() => setFilter("event")}
        >
          Events ({eventCount})
        </Badge>
        <Badge
          className={`cursor-pointer ${
            filter === "partner"
              ? "bg-sage text-white"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
          onClick={() => setFilter("partner")}
        >
          Businesses ({partnerCount})
        </Badge>
      </div>

      <MapWrapper markers={filteredMarkers} />

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
  );
}
