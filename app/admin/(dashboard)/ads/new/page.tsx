import { createClient } from "@/lib/supabase/server";
import { AdForm } from "@/components/admin/ads/ad-form";

export default async function NewAdPage() {
  const supabase = await createClient();

  const { data: counties } = await supabase
    .from("counties")
    .select("id, name, slug")
    .order("display_order");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">New Ad Placement</h2>
      <AdForm counties={counties ?? []} />
    </div>
  );
}
