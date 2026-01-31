import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { counties, getCountyBySlug } from "@/lib/counties";
import {
  getPostsByCounty,
  getEventsByCounty,
  getPartnersByCounty,
} from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Location01Icon,
  Store01Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";

interface CountyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return counties.map((county) => ({ slug: county.slug }));
}

export async function generateMetadata({
  params,
}: CountyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const county = getCountyBySlug(slug);
  if (!county) return {};
  return {
    title: `${county.name} | Explore ${county.seat}, IL`,
    description: county.description,
  };
}

export default async function CountyPage({ params }: CountyPageProps) {
  const { slug } = await params;
  const county = getCountyBySlug(slug);
  if (!county) notFound();

  const countyPosts = getPostsByCounty(slug);
  const countyEvents = getEventsByCounty(slug);
  const countyPartners = getPartnersByCounty(slug);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-river-blue py-16 sm:py-24">
        <svg
          className="absolute inset-0 h-full w-full opacity-10"
          preserveAspectRatio="none"
          viewBox="0 0 1200 400"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 200 C100 170, 200 230, 300 200 S500 170, 600 200 S800 230, 900 200 S1100 170, 1200 200"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-4 text-sm text-white/60">
            <Link href="/" className="hover:text-white/80">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/counties" className="hover:text-white/80">
              Counties
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{county.name}</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {county.name}
          </h1>
          <p className="mt-2 text-lg text-amber-light">
            County Seat: {county.seat}
          </p>
          <p className="mt-4 max-w-3xl text-lg text-white/80">
            {county.description}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Posts */}
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Latest Stories
              </h2>
              {countyPosts.length > 0 ? (
                <div className="mt-6 space-y-6">
                  {countyPosts.map((post) => (
                    <Card key={post.slug} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="aspect-[16/10] w-full bg-gradient-to-br from-river-blue/20 via-sage/10 to-amber/10 sm:aspect-auto sm:w-48 sm:flex-shrink-0" />
                        <div className="flex-1 p-5">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {post.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {post.date}
                            </span>
                          </div>
                          <h3 className="mt-2 font-semibold text-foreground hover:text-primary">
                            <Link
                              href={`/counties/${slug}/posts/${post.slug}`}
                            >
                              {post.title}
                            </Link>
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-muted-foreground">
                  No stories yet for {county.name}. Check back soon!
                </p>
              )}
            </div>

            {/* Events */}
            {countyEvents.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-foreground">
                  Upcoming Events
                </h2>
                <div className="mt-6 space-y-4">
                  {countyEvents.map((event) => (
                    <Card key={event.title}>
                      <CardContent className="flex gap-4 p-5">
                        <div className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <HugeiconsIcon icon={Calendar03Icon} size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {event.description}
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <HugeiconsIcon icon={Calendar03Icon} size={12} />
                              {event.date}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <HugeiconsIcon icon={Location01Icon} size={12} />
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Partners */}
            {countyPartners.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Local Businesses
                </h3>
                <div className="mt-4 space-y-3">
                  {countyPartners.map((partner) => (
                    <Card key={partner.name}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber/10">
                            <HugeiconsIcon
                              icon={Store01Icon}
                              size={18}
                              className="text-amber"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold">
                              {partner.name}
                            </h4>
                            <Badge
                              variant="secondary"
                              className="mt-1 text-xs"
                            >
                              {partner.category}
                            </Badge>
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                              {partner.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Affiliate placeholder */}
            <Card className="border-dashed">
              <CardContent className="p-5 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Planning a visit to {county.seat}?
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  <Link href="/advertise">Find Hotels & Lodging</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Other counties */}
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Other Counties
              </h3>
              <div className="mt-4 space-y-2">
                {counties
                  .filter((c) => c.slug !== slug)
                  .map((c) => (
                    <Link
                      key={c.slug}
                      href={`/counties/${c.slug}`}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                    >
                      <HugeiconsIcon
                        icon={ArrowRight02Icon}
                        size={12}
                        className="text-primary"
                      />
                      {c.name}
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
