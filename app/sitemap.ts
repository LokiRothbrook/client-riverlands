import type { MetadataRoute } from "next";
import { counties } from "@/lib/counties";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/about",
    "/contact",
    "/events",
    "/partners",
    "/partners/apply",
    "/history",
    "/explore",
    "/newsletter",
    "/advertise",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.8,
  }));

  const countyRoutes: MetadataRoute.Sitemap = counties.map((county) => ({
    url: `${BASE_URL}/counties/${county.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticRoutes, countyRoutes[0], ...countyRoutes.slice(1)];
}
