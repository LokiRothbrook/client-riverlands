import { getActiveAds } from "@/lib/queries";
import { AdBanner } from "./ad-banner";

export async function PostInlineAd({
  countySlug,
}: {
  countySlug: string;
}) {
  const ads = await getActiveAds("post_inline", countySlug);
  return <AdBanner ads={ads} zone="post_inline" className="py-4" />;
}
