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

// Colored marker for events (amber)
const EventIcon = L.divIcon({
  html: `<div style="background:#C6923A;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`,
  className: "",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
  popupAnchor: [0, -8],
});

// Colored marker for partners (sage)
const PartnerIcon = L.divIcon({
  html: `<div style="background:#5B7553;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`,
  className: "",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
  popupAnchor: [0, -8],
});

// Center of the region (roughly between all counties)
const REGION_CENTER: [number, number] = [39.7, -90.7];
const REGION_ZOOM = 9;

export interface MapMarker {
  id: string;
  label: string;
  description?: string;
  lat: number;
  lng: number;
  type: "event" | "partner";
  href: string;
}

interface RegionMapProps {
  filteredCounties?: string[];
  markers?: MapMarker[];
}

export default function RegionMap({ filteredCounties, markers }: RegionMapProps) {
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
      {displayCounties.filter((c: County) => c.lat != null && c.lng != null).map((county: County) => (
        <Marker key={county.slug} position={[county.lat!, county.lng!]}>
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
      {(markers || []).map((marker) => (
        <Marker
          key={`${marker.type}-${marker.id}`}
          position={[marker.lat, marker.lng]}
          icon={marker.type === "event" ? EventIcon : PartnerIcon}
        >
          <Popup>
            <div className="min-w-[160px]">
              <p className="text-[10px] font-medium uppercase text-gray-400">
                {marker.type === "event" ? "Event" : "Business"}
              </p>
              <h3 className="text-sm font-bold">{marker.label}</h3>
              {marker.description && (
                <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                  {marker.description}
                </p>
              )}
              <Link
                href={marker.href}
                className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline"
              >
                View details &rarr;
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
