import { createClient } from "@/lib/supabase/server";
import { counties, type County } from "./counties";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCounty(row: any): County {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    seat: row.seat,
    description: row.description,
    shortDescription: row.short_description,
    heroImage: row.hero_image,
    lat: row.lat,
    lng: row.lng,
    displayOrder: row.display_order,
  };
}

export async function getCounties(): Promise<County[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("counties")
      .select(
        "id, name, slug, seat, description, short_description, hero_image, lat, lng, display_order"
      )
      .order("display_order");

    if (data && data.length > 0) {
      return data.map(mapCounty);
    }
  } catch {
    // DB not available, use fallback
  }
  return counties;
}

export async function getCountyBySlug(
  slug: string
): Promise<County | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("counties")
      .select(
        "id, name, slug, seat, description, short_description, hero_image, lat, lng, display_order"
      )
      .eq("slug", slug)
      .maybeSingle();

    if (data) return mapCounty(data);
  } catch {
    // DB not available, use fallback
  }
  return counties.find((c) => c.slug === slug) ?? null;
}
