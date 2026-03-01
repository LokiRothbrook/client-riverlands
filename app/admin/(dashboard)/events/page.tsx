import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { EventsTable } from "@/components/admin/events/events-table";

export default async function AdminEventsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*, county:counties(name, slug)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Events</h2>
        <Button asChild>
          <Link href="/admin/events/new">New Event</Link>
        </Button>
      </div>
      <EventsTable events={events ?? []} />
    </div>
  );
}
