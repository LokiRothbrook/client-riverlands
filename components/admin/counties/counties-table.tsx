"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface County {
  id: string;
  name: string;
  slug: string;
  seat: string;
  display_order: number;
  hero_image: string | null;
}

export function CountiesTable({ counties }: { counties: County[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this county? This will also delete all associated posts, events, and partners.")) return;

    const res = await fetch(`/api/admin/counties/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("County deleted");
      router.refresh();
    } else {
      const json = await res.json();
      toast.error(json.error || "Failed to delete county");
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
                <th className="p-4 font-medium">County Seat</th>
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {counties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No counties found.
                  </td>
                </tr>
              ) : (
                counties.map((county) => (
                  <tr key={county.id} className="border-b last:border-0">
                    <td className="p-4 text-muted-foreground">
                      {county.display_order}
                    </td>
                    <td className="p-4 font-medium">{county.name}</td>
                    <td className="p-4 text-muted-foreground">{county.slug}</td>
                    <td className="p-4 text-muted-foreground">{county.seat}</td>
                    <td className="p-4 text-muted-foreground">
                      {county.hero_image ? "Yes" : "No"}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/counties/${county.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(county.id)}
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
