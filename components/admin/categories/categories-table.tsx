"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
}

export function CategoriesTable({ categories }: { categories: Category[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const json = await res.json();

    if (res.ok) {
      toast.success("Category deleted");
      router.refresh();
    } else {
      toast.error(json.error || "Failed to delete category");
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-b last:border-0">
                    <td className="p-4 text-muted-foreground">
                      {category.display_order}
                    </td>
                    <td className="p-4 font-medium">{category.name}</td>
                    <td className="p-4 text-muted-foreground">{category.slug}</td>
                    <td className="p-4 text-muted-foreground">
                      {category.description
                        ? category.description.length > 60
                          ? category.description.slice(0, 60) + "..."
                          : category.description
                        : "-"}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/categories/${category.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(category.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
