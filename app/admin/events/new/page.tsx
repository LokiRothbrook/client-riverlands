import { createClient } from "@/lib/supabase/server";
import { EventForm } from "@/components/admin/events/event-form";

export default async function NewEventPage() {
  const supabase = await createClient();

  const { data: counties } = await supabase
    .from("counties")
    .select("id, name, slug")
    .order("display_order");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">New Event</h2>
      <EventForm counties={counties ?? []} />
    </div>
  );
}
