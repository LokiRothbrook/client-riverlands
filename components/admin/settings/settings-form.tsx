"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const settingsGroups = [
  {
    title: "General",
    settings: [
      { key: "site_name", label: "Site Name", type: "text" },
      { key: "site_description", label: "Site Description", type: "textarea" },
      { key: "site_url", label: "Site URL", type: "text" },
    ],
  },
  {
    title: "Contact",
    settings: [
      { key: "contact_email", label: "Contact Email", type: "email" },
      { key: "contact_phone", label: "Contact Phone", type: "text" },
      { key: "contact_address", label: "Address", type: "text" },
    ],
  },
  {
    title: "Social Media",
    settings: [
      { key: "social_facebook", label: "Facebook URL", type: "url" },
      { key: "social_instagram", label: "Instagram URL", type: "url" },
      { key: "social_twitter", label: "Twitter/X URL", type: "url" },
      { key: "social_youtube", label: "YouTube URL", type: "url" },
    ],
  },
  {
    title: "Newsletter",
    settings: [
      { key: "newsletter_from_name", label: "From Name", type: "text" },
      { key: "newsletter_reply_to", label: "Reply-To Email", type: "email" },
    ],
  },
  {
    title: "Advertising",
    settings: [
      { key: "ads_contact_email", label: "Ads Contact Email", type: "email" },
      { key: "ads_rate_card_url", label: "Rate Card URL", type: "url" },
    ],
  },
];

export function SettingsForm({
  initialSettings,
}: {
  initialSettings: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialSettings);
  const [loading, setLoading] = useState(false);

  function updateValue(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setLoading(true);

    const settings = Object.entries(values).map(([key, value]) => ({
      key,
      value,
    }));

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (res.ok) {
        toast.success("Settings saved");
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {settingsGroups.map((group) => (
        <Card key={group.title}>
          <CardHeader>
            <CardTitle className="text-base">{group.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {group.settings.map((setting) => (
              <div key={setting.key} className="space-y-2">
                <Label htmlFor={setting.key}>{setting.label}</Label>
                {setting.type === "textarea" ? (
                  <Textarea
                    id={setting.key}
                    value={values[setting.key] ?? ""}
                    onChange={(e) => updateValue(setting.key, e.target.value)}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={setting.key}
                    type={setting.type}
                    value={values[setting.key] ?? ""}
                    onChange={(e) => updateValue(setting.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
}
