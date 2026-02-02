"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Partner {
  id: string;
  name: string;
  slug: string;
  category: string;
  is_featured: boolean;
  status: string;
  created_at: string;
  county: { name: string; slug: string } | null;
}

export function PartnersTable({ partners }: { partners: Partner[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this partner?")) return;

    const res = await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Partner deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete partner");
    }
  }

  async function toggleFeatured(id: string, current: boolean) {
    const res = await fetch(`/api/admin/partners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !current }),
    });
    if (res.ok) {
      toast.success(current ? "Removed from featured" : "Marked as featured");
      router.refresh();
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">County</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Featured</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No partners found.
                  </td>
                </tr>
              ) : (
                partners.map((partner) => (
                  <tr key={partner.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{partner.name}</td>
                    <td className="p-4 text-muted-foreground">
                      {partner.county?.name ?? "-"}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {partner.category}
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toggleFeatured(partner.id, partner.is_featured)
                        }
                      >
                        {partner.is_featured ? "Yes" : "No"}
                      </Button>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          partner.status === "active" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {partner.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/partners/${partner.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(partner.id)}
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
