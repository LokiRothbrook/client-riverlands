"use client";

import dynamic from "next/dynamic";
import { MapSkeleton } from "./map-skeleton";
import type { MapMarker } from "./region-map";

const RegionMap = dynamic(() => import("./region-map"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

interface MapWrapperProps {
  filteredCounties?: string[];
  markers?: MapMarker[];
}

export function MapWrapper({ filteredCounties, markers }: MapWrapperProps) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="aspect-[16/9]">
        <RegionMap filteredCounties={filteredCounties} markers={markers} />
      </div>
    </div>
  );
}
