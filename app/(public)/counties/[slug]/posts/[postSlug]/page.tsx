import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getCountyBySlug } from "@/lib/counties";
import { getPostBySlug, getPublishedPostsByCounty } from "@/lib/queries";
import { getPostParams } from "@/lib/queries-static";
import { sanitizeContent } from "@/lib/sanitize";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { articleSchema, breadcrumbSchema } from "@/lib/structured-data";
import { PostInlineAd } from "@/components/ads/post-inline-ad";
import { SocialShare } from "@/components/social-share";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

export const revalidate = 3600; // Revalidate every hour

interface PostPageProps {
  params: Promise<{ slug: string; postSlug: string }>;
}

export async function generateStaticParams() {
  return getPostParams();
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug, postSlug } = await params;
  const post = await getPostBySlug(slug, postSlug);
  if (!post) return {};
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      images: post.ogImage || post.featuredImage || undefined,
    },
    alternates: {
      canonical: `${SITE_URL}/counties/${slug}/posts/${postSlug}`,
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

export default async function PostPage({ params }: PostPageProps) {
  const { slug, postSlug } = await params;
  const county = getCountyBySlug(slug);
  const post = await getPostBySlug(slug, postSlug);

  if (!county || !post) notFound();

  const relatedPosts = (await getPublishedPostsByCounty(slug)).filter(
    (p) => p.slug !== postSlug
  );

  const postUrl = `${SITE_URL}/counties/${slug}/posts/${postSlug}`;

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          author: post.authorName,
          image: post.featuredImage || undefined,
          url: postUrl,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: county.name, url: `${SITE_URL}/counties/${slug}` },
          { name: post.title, url: postUrl },
        ])}
      />

      {/* Breadcrumb */}
      <div className="border-b bg-secondary/30">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6">
          <Breadcrumb
            items={[
              { label: county.name, href: `/counties/${slug}` },
              { label: post.title },
            ]}
          />
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Header */}
        <header>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{post.categoryName}</Badge>
            <Link
              href={`/counties/${slug}`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {county.name}
            </Link>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
          <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
            <span>By {post.authorName}</span>
            <span>&middot;</span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </header>

        <Separator className="my-8" />

        {/* Featured image */}
        {post.featuredImage ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-river-blue/20 via-sage/10 to-amber/10" />
        )}

        {/* Content */}
        <div
          className="prose prose-lg mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeContent(post.content) }}
        />

        {/* Inline ad */}
        <Suspense>
          <PostInlineAd countySlug={slug} />
        </Suspense>

        {/* Social sharing */}
        <Separator className="my-8" />
        <SocialShare url={postUrl} title={post.title} />

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground">
              More from {county.name}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {relatedPosts.slice(0, 4).map((related) => (
                <Card key={related.slug}>
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="text-xs">
                      {related.categoryName}
                    </Badge>
                    <h3 className="mt-2 font-semibold hover:text-primary">
                      <Link
                        href={`/counties/${slug}/posts/${related.slug}`}
                      >
                        {related.title}
                      </Link>
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {related.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
