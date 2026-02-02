import { getActiveAds } from "@/lib/queries";
import { AdBanner } from "./ad-banner";

export async function CountySidebarAd({
  countySlug,
}: {
  countySlug: string;
}) {
  const ads = await getActiveAds("county_sidebar", countySlug);
  return <AdBanner ads={ads} zone="county_sidebar" />;
}
