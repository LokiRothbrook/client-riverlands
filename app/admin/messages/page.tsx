import { createClient } from "@/lib/supabase/server";
import { MessagesList } from "@/components/admin/messages/messages-list";

export default async function AdminMessagesPage() {
  const supabase = await createClient();

  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Messages</h2>
      <MessagesList messages={messages ?? []} />
    </div>
  );
}
