import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostForm } from "@/components/admin/posts/post-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: post }, { data: counties }, { data: categories }] =
    await Promise.all([
      supabase.from("posts").select("*").eq("id", id).single(),
      supabase.from("counties").select("id, name, slug").order("display_order"),
      supabase
        .from("categories")
        .select("id, name, slug")
        .order("display_order"),
    ]);

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Edit Post</h2>
      <PostForm
        post={post}
        counties={counties ?? []}
        categories={categories ?? []}
      />
    </div>
  );
}
