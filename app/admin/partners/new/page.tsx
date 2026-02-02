import { createClient } from "@/lib/supabase/server";
import { PartnerForm } from "@/components/admin/partners/partner-form";

export default async function NewPartnerPage() {
  const supabase = await createClient();

  const { data: counties } = await supabase
    .from("counties")
    .select("id, name, slug")
    .order("display_order");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">New Partner</h2>
      <PartnerForm counties={counties ?? []} />
    </div>
  );
}
