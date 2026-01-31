import { HeroSection } from "@/components/sections/hero";
import { FeaturedPosts } from "@/components/sections/featured-posts";
import { UpcomingEvents } from "@/components/sections/upcoming-events";
import { FeaturedPartners } from "@/components/sections/featured-partners";
import { CountyCards } from "@/components/sections/county-cards";
import { NewsletterCta } from "@/components/sections/newsletter-cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedPosts />
      <CountyCards />
      <UpcomingEvents />
      <FeaturedPartners />
      <NewsletterCta />
    </>
  );
}
