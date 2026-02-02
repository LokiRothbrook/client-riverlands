"use client";

import dynamic from "next/dynamic";
import { MapSkeleton } from "./map-skeleton";

const RegionMap = dynamic(() => import("./region-map"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

interface MapWrapperProps {
  filteredCounties?: string[];
}

export function MapWrapper({ filteredCounties }: MapWrapperProps) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="aspect-[16/9]">
        <RegionMap filteredCounties={filteredCounties} />
      </div>
    </div>
  );
}
