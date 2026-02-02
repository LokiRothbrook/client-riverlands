import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { PostsTable } from "@/components/admin/posts/posts-table";

export default async function AdminPostsPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("*, county:counties(name, slug), category:categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Posts</h2>
        <Button asChild>
          <Link href="/admin/posts/new">New Post</Link>
        </Button>
      </div>
      <PostsTable posts={posts ?? []} />
    </div>
  );
}
