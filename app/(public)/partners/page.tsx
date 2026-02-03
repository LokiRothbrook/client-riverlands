import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Store01Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { PartnersFilter } from "@/components/partners/partners-filter";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";
import { getActivePartners } from "@/lib/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "Partners & Business Directory",
  description:
    "Discover local businesses, attractions, and services across the seven river counties of western Illinois.",
  alternates: {
    canonical: `${SITE_URL}/partners`,
  },
};

export default async function PartnersPage() {
  const partners = await getActivePartners();
  const featuredPartners = partners.filter((p) => p.isFeatured);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Partners", url: `${SITE_URL}/partners` },
        ])}
      />

      {/* Hero */}
      <section className="bg-river-blue py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Partners &amp; Business Directory
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Local businesses, attractions, and services that make the river
            counties special. Support local — explore what our communities
            have to offer.
          </p>
        </div>
      </section>

      <div className="border-b bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Partners" }]} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Featured */}
        {featuredPartners.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Featured Partners
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredPartners.map((partner) => (
                <Link key={partner.id} href={`/partners/${partner.slug}`}>
                  <Card className="group transition-shadow hover:shadow-md">
                    {partner.logo ? (
                      <div className="relative aspect-[16/10] w-full">
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-gradient-to-br from-amber/20 via-sage/10 to-river-blue/10" />
                    )}
                    <CardContent className="p-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10">
                        <HugeiconsIcon
                          icon={Store01Icon}
                          size={18}
                          className="text-amber"
                        />
                      </div>
                      <h3 className="mt-3 font-semibold text-foreground group-hover:text-primary">
                        {partner.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {partner.category}
                        </Badge>
                      </div>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {partner.description}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {partner.countyName}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Partners with filter */}
        <div className={featuredPartners.length > 0 ? "mt-16" : undefined}>
          <Suspense>
            <PartnersFilter partners={partners} />
          </Suspense>
        </div>

        {/* Become a partner CTA */}
        <div className="mt-16 rounded-xl bg-secondary/50 px-6 py-10 text-center sm:px-12">
          <h2 className="text-2xl font-bold text-foreground">
            Own a Local Business?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
            Join our directory and get exposure to visitors exploring the river
            counties. Featured listings receive prominent placement across the
            site.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/partners/apply">
              Apply to Become a Partner
              <HugeiconsIcon icon={ArrowRight02Icon} size={16} className="ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
