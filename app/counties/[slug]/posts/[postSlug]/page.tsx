import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { counties, getCountyBySlug } from "@/lib/counties";
import { posts, getPostBySlug, getPostsByCounty } from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PostPageProps {
  params: Promise<{ slug: string; postSlug: string }>;
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.countySlug,
    postSlug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { postSlug } = await params;
  const post = getPostBySlug(postSlug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug, postSlug } = await params;
  const county = getCountyBySlug(slug);
  const post = getPostBySlug(postSlug);

  if (!county || !post || post.countySlug !== slug) notFound();

  const relatedPosts = getPostsByCounty(slug).filter(
    (p) => p.slug !== postSlug
  );

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b bg-secondary/30">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6">
          <nav className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/counties/${slug}`}
              className="hover:text-foreground"
            >
              {county.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{post.title}</span>
          </nav>
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Header */}
        <header>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{post.category}</Badge>
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
            <span>By {post.author}</span>
            <span>&middot;</span>
            <span>{post.date}</span>
          </div>
        </header>

        <Separator className="my-8" />

        {/* Placeholder image */}
        <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-river-blue/20 via-sage/10 to-amber/10" />

        {/* Content */}
        <div className="prose prose-lg mt-8 max-w-none">
          {post.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="mb-4 leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Social sharing placeholder */}
        <Separator className="my-8" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Share this story:
            </span>
            <Button variant="outline" size="sm">
              Facebook
            </Button>
            <Button variant="outline" size="sm">
              Twitter
            </Button>
          </div>
        </div>

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
                      {related.category}
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
