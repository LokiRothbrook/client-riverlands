import { getActiveAds } from "@/lib/queries";
import { AdBanner } from "./ad-banner";

export async function HomepageBannerAd() {
  const ads = await getActiveAds("homepage_banner");
  return <AdBanner ads={ads} zone="homepage_banner" className="py-8" />;
}
