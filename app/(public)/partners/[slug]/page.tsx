import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  ArrowLeft02Icon,
  Link01Icon,
  Mail01Icon,
  Call02Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { PageBanner } from "@/components/page-banner";
import {
  localBusinessSchema,
  breadcrumbSchema,
} from "@/lib/structured-data";
import { getPartnerBySlug } from "@/lib/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

interface PartnerPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PartnerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const partner = await getPartnerBySlug(slug);

  if (!partner) {
    return { title: "Partner Not Found" };
  }

  return {
    title: partner.name,
    description: partner.description,
    openGraph: {
      title: partner.name,
      description: partner.description,
      ...(partner.logo && { images: [partner.logo] }),
    },
  };
}

export default async function PartnerDetailPage({
  params,
}: PartnerPageProps) {
  const { slug } = await params;
  const partner = await getPartnerBySlug(slug);

  if (!partner) notFound();

  return (
    <>
      <JsonLd
        data={localBusinessSchema({
          name: partner.name,
          description: partner.description,
          address: partner.address || undefined,
          url: partner.website || undefined,
          phone: partner.phone || undefined,
          image: partner.logo || undefined,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Partners", url: `${SITE_URL}/partners` },
          {
            name: partner.name,
            url: `${SITE_URL}/partners/${partner.slug}`,
          },
        ])}
      />

      {/* Hero */}
      <PageBanner>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 text-white">{partner.category}</Badge>
            {partner.isFeatured && (
              <Badge className="bg-amber/20 text-amber">Featured</Badge>
            )}
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {partner.name}
          </h1>
          <p className="mt-4 text-lg text-white/80">{partner.countyName}</p>
        </div>
      </PageBanner>

      <div className="border-b bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: "Partners", href: "/partners" },
              { label: partner.name },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            <Button asChild variant="ghost" size="sm" className="mb-6">
              <Link href="/partners">
                <HugeiconsIcon
                  icon={ArrowLeft02Icon}
                  size={16}
                  className="mr-1"
                />
                Back to Partners
              </Link>
            </Button>

            {partner.logo && (
              <div className="mb-8 overflow-hidden rounded-xl border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/10">
                <HugeiconsIcon
                  icon={Store01Icon}
                  size={22}
                  className="text-amber"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  About {partner.name}
                </h2>
                <Badge variant="secondary" className="text-xs mt-0.5">
                  {partner.category}
                </Badge>
              </div>
            </div>

            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
              {partner.description}
            </p>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold text-foreground">
                  Contact Information
                </h2>

                {partner.address && (
                  <div className="flex items-start gap-3">
                    <HugeiconsIcon
                      icon={Location01Icon}
                      size={18}
                      className="mt-0.5 text-primary"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Address
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {partner.address}
                      </p>
                    </div>
                  </div>
                )}

                {partner.phone && (
                  <div className="flex items-start gap-3">
                    <HugeiconsIcon
                      icon={Call02Icon}
                      size={18}
                      className="mt-0.5 text-primary"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Phone
                      </p>
                      <a
                        href={`tel:${partner.phone}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {partner.phone}
                      </a>
                    </div>
                  </div>
                )}

                {partner.email && (
                  <div className="flex items-start gap-3">
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      size={18}
                      className="mt-0.5 text-primary"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Email
                      </p>
                      <a
                        href={`mailto:${partner.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {partner.email}
                      </a>
                    </div>
                  </div>
                )}

                {partner.website && (
                  <Button asChild className="w-full">
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <HugeiconsIcon
                        icon={Link01Icon}
                        size={16}
                        className="mr-1"
                      />
                      Visit Website
                    </a>
                  </Button>
                )}

                {!partner.address &&
                  !partner.phone &&
                  !partner.email &&
                  !partner.website && (
                    <p className="text-sm text-muted-foreground">
                      No contact information available.
                    </p>
                  )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-foreground">Location</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {partner.countyName}
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                >
                  <Link href={`/counties/${partner.countySlug}`}>
                    Explore {partner.countyName}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
