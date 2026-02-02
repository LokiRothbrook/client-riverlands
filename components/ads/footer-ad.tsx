import { getActiveAds } from "@/lib/queries";
import { AdBanner } from "./ad-banner";

export async function FooterAd() {
  const ads = await getActiveAds("footer");
  return <AdBanner ads={ads} zone="footer" className="py-6" />;
}
