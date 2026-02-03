import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/sections/hero";
import { FeaturedPosts } from "@/components/sections/featured-posts";
import { UpcomingEvents } from "@/components/sections/upcoming-events";
import { FeaturedPartners } from "@/components/sections/featured-partners";
import { CountyCards } from "@/components/sections/county-cards";
import { NewsletterCta } from "@/components/sections/newsletter-cta";
import { HomepageBannerAd } from "@/components/ads/homepage-banner-ad";
import { JsonLd } from "@/components/json-ld";
import { websiteSchema } from "@/lib/structured-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

export const metadata: Metadata = {
  title: "Riverlands | Discover Illinois River Country",
  description:
    "Explore the seven river counties of western Illinois — Adams, Pike, Brown, Schuyler, Calhoun, Scott, and Morgan. Discover local history, events, attractions, and businesses along the Illinois and Mississippi Rivers.",
  alternates: {
    canonical: SITE_URL,
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteSchema()} />
      <HeroSection />
      <Suspense>
        <FeaturedPosts />
      </Suspense>
      <Suspense>
        <HomepageBannerAd />
      </Suspense>
      <CountyCards />
      <Suspense>
        <UpcomingEvents />
      </Suspense>
      <Suspense>
        <FeaturedPartners />
      </Suspense>
      <NewsletterCta />
    </>
  );
}
