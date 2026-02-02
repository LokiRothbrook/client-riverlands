import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventForm } from "@/components/admin/events/event-form";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: event }, { data: counties }] = await Promise.all([
    supabase.from("events").select("*").eq("id", id).single(),
    supabase.from("counties").select("id, name, slug").order("display_order"),
  ]);

  if (!event) notFound();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Edit Event</h2>
      <EventForm event={event} counties={counties ?? []} />
    </div>
  );
}
