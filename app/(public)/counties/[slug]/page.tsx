import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getCounties, getCountyBySlug } from "@/lib/counties-server";
import {
  getPublishedPostsByCounty,
  getPublishedEventsByCounty,
  getActivePartnersByCounty,
} from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Location01Icon,
  Store01Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";
import { PageBanner } from "@/components/page-banner";
import { CountySidebarAd } from "@/components/ads/county-sidebar-ad";
import { AffiliateSidebar } from "@/components/ads/affiliate-sidebar";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

interface CountyPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const counties = await getCounties();
  return counties.map((county) => ({ slug: county.slug }));
}

export async function generateMetadata({
  params,
}: CountyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const county = await getCountyBySlug(slug);
  if (!county) return {};
  return {
    title: `${county.name} | Explore ${county.seat}, IL`,
    description: county.description,
    alternates: {
      canonical: `${SITE_URL}/counties/${slug}`,
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function CountyPage({ params }: CountyPageProps) {
  const { slug } = await params;
  const county = await getCountyBySlug(slug);
  if (!county) notFound();

  const allCounties = await getCounties();

  const [countyPosts, countyEvents, countyPartners] = await Promise.all([
    getPublishedPostsByCounty(slug),
    getPublishedEventsByCounty(slug),
    getActivePartnersByCounty(slug),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Counties", url: `${SITE_URL}/counties` },
          { name: county.name, url: `${SITE_URL}/counties/${slug}` },
        ])}
      />

      {/* Hero */}
      <PageBanner className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
      </PageBanner>

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
                    <Link
                      key={post.slug}
                      href={`/counties/${slug}/posts/${post.slug}`}
                    >
                      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                        <div className="flex flex-col sm:flex-row">
                          {post.featuredImage ? (
                            <div className="relative aspect-[16/10] w-full sm:aspect-[4/3] sm:w-48 sm:flex-shrink-0">
                              <Image
                                src={post.featuredImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, 192px"
                              />
                            </div>
                          ) : (
                            <div className="aspect-[16/10] w-full bg-gradient-to-br from-river-blue/20 via-sage/10 to-amber/10 sm:aspect-[4/3] sm:w-48 sm:flex-shrink-0" />
                          )}
                          <div className="flex-1 p-5">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {post.categoryName}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(post.publishedAt)}
                              </span>
                            </div>
                            <h3 className="mt-2 font-semibold text-foreground group-hover:text-primary">
                              {post.title}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Link>
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
                    <Card key={event.id}>
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
                              {formatDate(event.startDate)}
                              {event.endDate &&
                                ` – ${formatDate(event.endDate)}`}
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
                    <Card key={partner.id}>
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

            {/* County Ad */}
            <CountySidebarAd countySlug={slug} />

            {/* Affiliate Links */}
            <AffiliateSidebar
              countyName={county.name}
              countySeat={county.seat}
            />

            {/* Other counties */}
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Other Counties
              </h3>
              <div className="mt-4 space-y-2">
                {allCounties
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
