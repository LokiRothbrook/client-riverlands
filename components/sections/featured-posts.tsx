import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getPublishedPosts } from "@/lib/queries";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function FeaturedPosts() {
  const posts = await getPublishedPosts(6);

  if (posts.length === 0) return null;

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
          {posts.map((post) => (
            <Card
              key={post.slug}
              className="group overflow-hidden transition-shadow hover:shadow-lg"
            >
              {post.featuredImage ? (
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="aspect-[16/10] bg-gradient-to-br from-river-blue/20 via-sage/10 to-amber/10" />
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {post.categoryName}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {post.countyName}
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
                  {formatDate(post.publishedAt)}
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
