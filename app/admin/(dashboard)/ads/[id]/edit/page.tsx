import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdForm } from "@/components/admin/ads/ad-form";

export default async function EditAdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: ad }, { data: counties }] = await Promise.all([
    supabase.from("ad_placements").select("*").eq("id", id).single(),
    supabase.from("counties").select("id, name, slug").order("display_order"),
  ]);

  if (!ad) notFound();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Edit Ad Placement</h2>
      <AdForm ad={ad} counties={counties ?? []} />
    </div>
  );
}
