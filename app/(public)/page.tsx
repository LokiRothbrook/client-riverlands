import { Suspense } from "react";
import { HeroSection } from "@/components/sections/hero";
import { FeaturedPosts } from "@/components/sections/featured-posts";
import { UpcomingEvents } from "@/components/sections/upcoming-events";
import { FeaturedPartners } from "@/components/sections/featured-partners";
import { CountyCards } from "@/components/sections/county-cards";
import { NewsletterCta } from "@/components/sections/newsletter-cta";
import { JsonLd } from "@/components/json-ld";
import { websiteSchema } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteSchema()} />
      <HeroSection />
      <Suspense>
        <FeaturedPosts />
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
