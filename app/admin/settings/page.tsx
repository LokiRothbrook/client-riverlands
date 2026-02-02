import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/settings/settings-form";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .order("key");

  // Convert to a key-value map for easier access
  const settingsMap: Record<string, string> = {};
  (settings ?? []).forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      <SettingsForm initialSettings={settingsMap} />
    </div>
  );
}
