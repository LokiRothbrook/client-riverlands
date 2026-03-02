import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageBanner } from "@/components/page-banner";

export function HeroSection() {
  return (
    <PageBanner size="hero">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Discover the Heart
            <span className="block text-amber-light">of Illinois</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/80 sm:text-xl">
            Explore seven historic counties along the Mississippi and Illinois
            rivers. From Abraham Lincoln&apos;s footsteps to Underground
            Railroad heritage, bald eagle watching to hometown festivals —
            your adventure in western Illinois starts here.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-amber text-river-blue-dark hover:bg-amber-light"
            >
              <Link href="/explore">Explore the Region</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Link href="/events">Upcoming Events</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageBanner>
  );
}
