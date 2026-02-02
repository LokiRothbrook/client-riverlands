import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { AdsTable } from "@/components/admin/ads/ads-table";

export default async function AdminAdsPage() {
  const supabase = await createClient();

  const { data: ads } = await supabase
    .from("ad_placements")
    .select("*, county:counties(name, slug)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ad Placements</h2>
        <Button asChild>
          <Link href="/admin/ads/new">New Ad</Link>
        </Button>
      </div>
      <AdsTable ads={ads ?? []} />
    </div>
  );
}
