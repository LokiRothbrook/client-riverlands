"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Ad {
  id: string;
  business_name: string;
  placement_zone: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  impressions: number;
  clicks: number;
  county: { name: string; slug: string } | null;
}

export function AdsTable({ ads }: { ads: Ad[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this ad?")) return;

    const res = await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Ad deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete ad");
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-4 font-medium">Business</th>
                <th className="p-4 font-medium">Zone</th>
                <th className="p-4 font-medium">County</th>
                <th className="p-4 font-medium">Active</th>
                <th className="p-4 font-medium">Dates</th>
                <th className="p-4 font-medium">Impressions</th>
                <th className="p-4 font-medium">Clicks</th>
                <th className="p-4 font-medium">CTR</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-muted-foreground">
                    No ad placements found.
                  </td>
                </tr>
              ) : (
                ads.map((ad) => {
                  const ctr =
                    ad.impressions > 0
                      ? ((ad.clicks / ad.impressions) * 100).toFixed(1)
                      : "0.0";
                  return (
                    <tr key={ad.id} className="border-b last:border-0">
                      <td className="p-4 font-medium">{ad.business_name}</td>
                      <td className="p-4">
                        <Badge variant="secondary" className="text-xs">
                          {ad.placement_zone}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {ad.county?.name ?? "Site-wide"}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={ad.is_active ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {ad.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        {new Date(ad.start_date).toLocaleDateString()} &ndash;{" "}
                        {new Date(ad.end_date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {ad.impressions.toLocaleString()}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {ad.clicks.toLocaleString()}
                      </td>
                      <td className="p-4 text-muted-foreground">{ctr}%</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/ads/${ad.id}/edit`}>Edit</Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDelete(ad.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
