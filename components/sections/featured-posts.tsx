import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const placeholderPosts = [
  {
    title: "Walking in Lincoln's Footsteps: The Talking Houses of Pittsfield",
    excerpt:
      "Discover the self-guided tour that brings Abraham Lincoln's history to life through restored homes and FM radio narration.",
    county: "Pike County",
    countySlug: "pike",
    category: "History",
    slug: "lincoln-talking-houses-pittsfield",
    date: "Jan 15, 2026",
  },
  {
    title: "Eagle Season Returns to Calhoun County",
    excerpt:
      "The Brussels Free Ferry becomes a prime viewing spot as hundreds of bald eagles return to the river corridor this winter.",
    county: "Calhoun County",
    countySlug: "calhoun",
    category: "Outdoors",
    slug: "eagle-season-calhoun",
    date: "Jan 10, 2026",
  },
  {
    title: "Quincy's Underground Railroad: Stories of Courage",
    excerpt:
      "The Dr. Richard Eells House stands as a testament to the hundreds who found passage to freedom through Adams County.",
    county: "Adams County",
    countySlug: "adams",
    category: "History",
    slug: "quincy-underground-railroad",
    date: "Jan 8, 2026",
  },
  {
    title: "Big Eli Wheel: The World's First Portable Ferris Wheel",
    excerpt:
      "Still giving free rides in Jacksonville, this 1900 invention was inspired by the original Chicago World's Fair Ferris wheel.",
    county: "Morgan County",
    countySlug: "morgan",
    category: "Attractions",
    slug: "big-eli-wheel-jacksonville",
    date: "Jan 5, 2026",
  },
  {
    title: "Brown County Fair: 150+ Years of Illinois Tradition",
    excerpt:
      "The longest continuously running county fair in the state celebrates its agricultural roots and community spirit.",
    county: "Brown County",
    countySlug: "brown",
    category: "Events",
    slug: "brown-county-fair-tradition",
    date: "Jan 3, 2026",
  },
  {
    title: "New Philadelphia: America's First African American-Platted Town",
    excerpt:
      "The remarkable story of 'Free' Frank McWorter, who purchased his family's freedom and founded a town in 1836.",
    county: "Pike County",
    countySlug: "pike",
    category: "History",
    slug: "new-philadelphia-history",
    date: "Dec 28, 2025",
  },
];

export function FeaturedPosts() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured Stories
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              The latest from across the river counties
            </p>
          </div>
          <Link
            href="/counties"
            className="hidden text-sm font-medium text-primary hover:text-primary/80 sm:block"
          >
            View all stories &rarr;
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderPosts.map((post) => (
            <Card
              key={post.slug}
              className="group overflow-hidden transition-shadow hover:shadow-lg"
            >
              {/* Placeholder image area */}
              <div className="aspect-[16/10] bg-gradient-to-br from-river-blue/20 via-sage/10 to-amber/10" />
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {post.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {post.county}
                  </span>
                </div>
                <CardTitle className="line-clamp-2 text-lg leading-snug group-hover:text-primary">
                  <Link
                    href={`/counties/${post.countySlug}/posts/${post.slug}`}
                  >
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2">
                  {post.excerpt}
                </CardDescription>
                <p className="mt-3 text-xs text-muted-foreground">
                  {post.date}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/counties"
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            View all stories &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
