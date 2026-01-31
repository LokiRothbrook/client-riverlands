import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-river-blue py-24 sm:py-32 lg:py-40">
      {/* Decorative river lines */}
      <svg
        className="absolute inset-0 h-full w-full opacity-10"
        preserveAspectRatio="none"
        viewBox="0 0 1200 600"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 300 C100 250, 200 350, 300 300 S500 250, 600 300 S800 350, 900 300 S1100 250, 1200 300"
          stroke="white"
          strokeWidth="3"
        />
        <path
          d="M0 340 C100 290, 200 390, 300 340 S500 290, 600 340 S800 390, 900 340 S1100 290, 1200 340"
          stroke="white"
          strokeWidth="2"
        />
        <path
          d="M0 380 C100 330, 200 430, 300 380 S500 330, 600 380 S800 430, 900 380 S1100 330, 1200 380"
          stroke="white"
          strokeWidth="1"
        />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
    </section>
  );
}
