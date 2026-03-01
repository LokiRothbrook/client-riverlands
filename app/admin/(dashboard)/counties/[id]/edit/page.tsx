import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CountyForm } from "@/components/admin/counties/county-form";

export default async function EditCountyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: county } = await supabase
    .from("counties")
    .select("*")
    .eq("id", id)
    .single();

  if (!county) notFound();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Edit County</h2>
      <CountyForm county={county} />
    </div>
  );
}
