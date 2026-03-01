import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { CountiesTable } from "@/components/admin/counties/counties-table";

export default async function AdminCountiesPage() {
  const supabase = await createClient();

  const { data: counties } = await supabase
    .from("counties")
    .select("*")
    .order("display_order");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Counties</h2>
        <Button asChild>
          <Link href="/admin/counties/new">New County</Link>
        </Button>
      </div>
      <CountiesTable counties={counties ?? []} />
    </div>
  );
}
