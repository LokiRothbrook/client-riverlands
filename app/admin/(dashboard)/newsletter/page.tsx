import { createClient } from "@/lib/supabase/server";
import { SubscribersTable } from "@/components/admin/newsletter/subscribers-table";
import { ComposeForm } from "@/components/admin/newsletter/compose-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminNewsletterPage() {
  const supabase = await createClient();

  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  const verified = (subscribers ?? []).filter((s) => s.verified).length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Newsletter</h2>

      <Tabs defaultValue="subscribers">
        <TabsList>
          <TabsTrigger value="subscribers">
            Subscribers ({verified} verified)
          </TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="mt-4">
          <SubscribersTable subscribers={subscribers ?? []} />
        </TabsContent>

        <TabsContent value="compose" className="mt-4">
          <ComposeForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
