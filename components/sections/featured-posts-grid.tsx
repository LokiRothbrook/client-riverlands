"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  countySlug: string;
  countyName: string;
  categoryName: string;
  publishedAt: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function FeaturedPostsGrid({
  initialPosts,
  totalCount,
}: {
  initialPosts: Post[];
  totalCount: number;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);

  const hasMore = posts.length < totalCount;

  async function loadMore() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/posts/featured?offset=${posts.length}&limit=6`
      );
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) => [...prev, ...data]);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/counties/${post.countySlug}/posts/${post.slug}`}
          >
            <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
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
                  <Badge variant="secondary" className="text-xs font-normal">
                    {post.categoryName}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {post.countyName}
                  </span>
                </div>
                <CardTitle className="line-clamp-2 text-lg leading-snug group-hover:text-primary">
                  {post.title}
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
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More Stories"}
          </Button>
        </div>
      )}
    </>
  );
}
