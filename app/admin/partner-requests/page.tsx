import { createClient } from "@/lib/supabase/server";
import { RequestReview } from "@/components/admin/partner-requests/request-review";

export default async function PartnerRequestsPage() {
  const supabase = await createClient();

  const { data: requests } = await supabase
    .from("partner_requests")
    .select("*, county:counties(name, slug)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Partner Requests</h2>
      <RequestReview requests={requests ?? []} />
    </div>
  );
}
