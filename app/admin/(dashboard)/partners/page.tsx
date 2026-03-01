import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { PartnersTable } from "@/components/admin/partners/partners-table";

export default async function AdminPartnersPage() {
  const supabase = await createClient();

  const { data: partners } = await supabase
    .from("partners")
    .select("*, county:counties(name, slug)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Partners</h2>
        <Button asChild>
          <Link href="/admin/partners/new">New Partner</Link>
        </Button>
      </div>
      <PartnersTable partners={partners ?? []} />
    </div>
  );
}
