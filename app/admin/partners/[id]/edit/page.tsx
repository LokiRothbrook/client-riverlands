import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PartnerForm } from "@/components/admin/partners/partner-form";

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: partner }, { data: counties }] = await Promise.all([
    supabase.from("partners").select("*").eq("id", id).single(),
    supabase.from("counties").select("id, name, slug").order("display_order"),
  ]);

  if (!partner) notFound();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Edit Partner</h2>
      <PartnerForm partner={partner} counties={counties ?? []} />
    </div>
  );
}
