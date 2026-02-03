import type { MetadataRoute } from "next";
import { counties } from "@/lib/counties";
import {
  getPublishedPostsForSitemap,
  getPublishedEventsForSitemap,
} from "@/lib/queries-static";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Fetch published posts and events for dynamic routes
  const [posts, events] = await Promise.all([
    getPublishedPostsForSitemap(),
    getPublishedEventsForSitemap(),
  ]);

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/counties/${post.countySlug}/posts/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${BASE_URL}/events/${event.id}`,
    lastModified: new Date(event.startDate),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...countyRoutes,
    ...postRoutes,
    ...eventRoutes,
  ];
}
