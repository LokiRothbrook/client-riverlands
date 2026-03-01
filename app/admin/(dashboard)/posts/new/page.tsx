import { createClient } from "@/lib/supabase/server";
import { PostForm } from "@/components/admin/posts/post-form";

export default async function NewPostPage() {
  const supabase = await createClient();

  const [{ data: counties }, { data: categories }] = await Promise.all([
    supabase.from("counties").select("id, name, slug").order("display_order"),
    supabase.from("categories").select("id, name, slug").order("display_order"),
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">New Post</h2>
      <PostForm counties={counties ?? []} categories={categories ?? []} />
    </div>
  );
}
