"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { counties, type County } from "@/lib/counties";

// Fix default marker icons for webpack/next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Center of the region (roughly between all counties)
const REGION_CENTER: [number, number] = [39.7, -90.7];
const REGION_ZOOM = 9;

interface RegionMapProps {
  filteredCounties?: string[];
}

export default function RegionMap({ filteredCounties }: RegionMapProps) {
  const displayCounties = filteredCounties
    ? counties.filter((c) => filteredCounties.includes(c.slug))
    : counties;

  return (
    <MapContainer
      center={REGION_CENTER}
      zoom={REGION_ZOOM}
      scrollWheelZoom={true}
      className="h-full w-full"
      style={{ minHeight: "500px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {displayCounties.map((county: County) => (
        <Marker key={county.slug} position={[county.lat, county.lng]}>
          <Popup>
            <div className="min-w-[180px]">
              <h3 className="text-sm font-bold">{county.name}</h3>
              <p className="text-xs text-gray-500">
                County Seat: {county.seat}
              </p>
              <p className="mt-1 text-xs">{county.shortDescription}</p>
              <Link
                href={`/counties/${county.slug}`}
                className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline"
              >
                Explore {county.name} &rarr;
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
