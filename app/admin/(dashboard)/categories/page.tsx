import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { CategoriesTable } from "@/components/admin/categories/categories-table";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Button asChild>
          <Link href="/admin/categories/new">New Category</Link>
        </Button>
      </div>
      <CategoriesTable categories={categories ?? []} />
    </div>
  );
}
