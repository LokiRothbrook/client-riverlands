/**
 * Static query functions for use in generateStaticParams and sitemap generation.
 * These don't require cookies and can run at build time.
 */
import { createStaticClient } from "@/lib/supabase/static";

const POST_SELECT = `
  id, title, slug, published_at,
  counties!inner(slug, name)
`;

const EVENT_SELECT = `
  id, title, start_date,
  counties!inner(slug)
`;

interface PostParam {
  slug: string;
  postSlug: string;
}

interface PostSitemapEntry {
  countySlug: string;
  slug: string;
  publishedAt: string;
}

interface EventSitemapEntry {
  id: string;
  startDate: string;
}

/**
 * Get post params for generateStaticParams (minimal data)
 */
export async function getPostParams(): Promise<PostParam[]> {
  const supabase = createStaticClient();

  const { data } = await supabase
    .from("posts")
    .select("slug, counties!inner(slug)")
    .eq("status", "published");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    slug: row.counties?.slug ?? "",
    postSlug: row.slug,
  }));
}

/**
 * Get published posts for sitemap generation
 */
export async function getPublishedPostsForSitemap(): Promise<PostSitemapEntry[]> {
  const supabase = createStaticClient();

  const { data } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    countySlug: row.counties?.slug ?? "",
    slug: row.slug,
    publishedAt: row.published_at,
  }));
}

/**
 * Get published events for sitemap generation
 */
export async function getPublishedEventsForSitemap(): Promise<EventSitemapEntry[]> {
  const supabase = createStaticClient();

  const { data } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("status", "published")
    .order("start_date", { ascending: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    id: row.id,
    startDate: row.start_date,
  }));
}
