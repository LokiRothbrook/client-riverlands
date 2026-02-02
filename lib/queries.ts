import { createClient } from "@/lib/supabase/server";

// ── Posts ────────────────────────────────────────────────────────

export interface PublishedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  countySlug: string;
  countyName: string;
  categoryName: string;
  categorySlug: string;
  authorName: string;
  publishedAt: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
}

const POST_SELECT = `
  id, title, slug, excerpt, content, featured_image,
  published_at, meta_title, meta_description, og_image,
  counties!inner(slug, name),
  categories!inner(name, slug),
  profiles(full_name)
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPost(row: any): PublishedPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    featuredImage: row.featured_image,
    countySlug: row.counties.slug,
    countyName: row.counties.name,
    categoryName: row.categories.name,
    categorySlug: row.categories.slug,
    authorName: row.profiles?.full_name || "Riverlands Staff",
    publishedAt: row.published_at,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    ogImage: row.og_image,
  };
}

export async function getPublishedPosts(
  limit?: number
): Promise<PublishedPost[]> {
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data } = await query;
  return (data ?? []).map(mapPost);
}

export async function getPublishedPostsByCounty(
  countySlug: string
): Promise<PublishedPost[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .eq("counties.slug", countySlug)
    .order("published_at", { ascending: false });

  return (data ?? []).map(mapPost);
}

export async function getPostBySlug(
  countySlug: string,
  postSlug: string
): Promise<PublishedPost | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .eq("slug", postSlug)
    .eq("counties.slug", countySlug)
    .maybeSingle();

  return data ? mapPost(data) : null;
}

// ── Events ───────────────────────────────────────────────────────

export interface PublishedEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  countySlug: string;
  countyName: string;
  category: string;
  startDate: string;
  endDate: string | null;
  recurring: string | null;
  externalLink: string | null;
  featuredImage: string | null;
}

const EVENT_SELECT = `
  id, title, description, location, category,
  start_date, end_date, recurring, external_link, featured_image,
  counties!inner(slug, name)
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEvent(row: any): PublishedEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    countySlug: row.counties.slug,
    countyName: row.counties.name,
    category: row.category,
    startDate: row.start_date,
    endDate: row.end_date,
    recurring: row.recurring,
    externalLink: row.external_link,
    featuredImage: row.featured_image,
  };
}

export async function getPublishedEvents(): Promise<PublishedEvent[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("status", "published")
    .order("start_date", { ascending: true });

  return (data ?? []).map(mapEvent);
}

export async function getUpcomingEvents(
  limit?: number
): Promise<PublishedEvent[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  let query = supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("status", "published")
    .gte("start_date", today)
    .order("start_date", { ascending: true });

  if (limit) query = query.limit(limit);

  const { data } = await query;
  return (data ?? []).map(mapEvent);
}

export async function getPublishedEventsByCounty(
  countySlug: string
): Promise<PublishedEvent[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("status", "published")
    .eq("counties.slug", countySlug)
    .order("start_date", { ascending: true });

  return (data ?? []).map(mapEvent);
}

// ── Partners ─────────────────────────────────────────────────────

export interface ActivePartner {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  countySlug: string;
  countyName: string;
  category: string;
  isFeatured: boolean;
}

const PARTNER_SELECT = `
  id, name, slug, description, logo, website,
  email, phone, address, category, is_featured,
  counties!inner(slug, name)
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPartner(row: any): ActivePartner {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    logo: row.logo,
    website: row.website,
    email: row.email,
    phone: row.phone,
    address: row.address,
    countySlug: row.counties.slug,
    countyName: row.counties.name,
    category: row.category,
    isFeatured: row.is_featured,
  };
}

export async function getActivePartners(): Promise<ActivePartner[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("partners")
    .select(PARTNER_SELECT)
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .order("name");

  return (data ?? []).map(mapPartner);
}

export async function getActivePartnersByCounty(
  countySlug: string
): Promise<ActivePartner[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("partners")
    .select(PARTNER_SELECT)
    .eq("status", "active")
    .eq("counties.slug", countySlug)
    .order("is_featured", { ascending: false })
    .order("name");

  return (data ?? []).map(mapPartner);
}

// ── Ads ──────────────────────────────────────────────────────────

export interface ActiveAd {
  id: string;
  businessName: string;
  imageUrl: string;
  linkUrl: string;
  placementZone: string;
  countySlug: string | null;
}

export async function getActiveAds(
  zone?: string,
  countySlug?: string
): Promise<ActiveAd[]> {
  const supabase = await createClient();
  const now = new Date().toISOString().split("T")[0];

  let query = supabase
    .from("ad_placements")
    .select(
      "id, business_name, image_url, link_url, placement_zone, counties(slug)"
    )
    .eq("is_active", true)
    .lte("start_date", now)
    .gte("end_date", now);

  if (zone) query = query.eq("placement_zone", zone);

  const { data } = await query;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let ads = (data ?? []).map((ad: any) => ({
    id: ad.id,
    businessName: ad.business_name,
    imageUrl: ad.image_url,
    linkUrl: ad.link_url,
    placementZone: ad.placement_zone,
    countySlug: (ad.counties?.slug as string) ?? null,
  }));

  if (countySlug) {
    ads = ads.filter((ad) => !ad.countySlug || ad.countySlug === countySlug);
  }

  return ads;
}

// ── Categories ───────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("display_order");

  return (data ?? []) as Category[];
}

// ── Counties (from DB) ───────────────────────────────────────────

export async function getCountiesFromDb() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("counties")
    .select(
      "id, name, slug, seat, description, short_description, hero_image"
    )
    .order("display_order");

  return data ?? [];
}

// ── Site Settings ────────────────────────────────────────────────

export async function getSiteSettings(): Promise<Record<string, string>> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .order("key");

  const settings: Record<string, string> = {};
  (data ?? []).forEach((s) => {
    settings[s.key] = s.value;
  });
  return settings;
}
