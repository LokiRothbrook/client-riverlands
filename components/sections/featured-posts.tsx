import Link from "next/link";
import { getFeaturedPosts, getFeaturedPostsCount, getSiteSettings } from "@/lib/queries";
import { FeaturedPostsGrid } from "./featured-posts-grid";

export async function FeaturedPosts() {
  const settings = await getSiteSettings();
  const initialCount = parseInt(settings.featured_posts_count || "12") || 12;

  const [posts, totalCount] = await Promise.all([
    getFeaturedPosts(initialCount),
    getFeaturedPostsCount(),
  ]);

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

        <FeaturedPostsGrid initialPosts={posts} totalCount={totalCount} />

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
