"use client";

import { useState } from "react";
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError } from "@/components/admin/field-error";
import { toast } from "sonner";

interface SettingConfig {
  key: string;
  label: string;
  type: string;
  placeholder?: string;
}

const settingsGroups: { title: string; settings: SettingConfig[] }[] = [
  {
    title: "General",
    settings: [
      { key: "site_name", label: "Site Name", type: "text" },
      { key: "site_description", label: "Site Description", type: "textarea" },
      { key: "site_url", label: "Site URL", type: "url" },
      {
        key: "featured_posts_count",
        label: "Featured Posts on Homepage",
        type: "number",
        placeholder: "12",
      },
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
  {
    title: "Affiliate Links",
    settings: [
      { key: "affiliate_hotels_url", label: "Hotels URL", type: "url" },
      { key: "affiliate_hotels_label", label: "Hotels Label", type: "text" },
      { key: "affiliate_activities_url", label: "Activities URL", type: "url" },
      { key: "affiliate_activities_label", label: "Activities Label", type: "text" },
      { key: "affiliate_rentals_url", label: "Rentals URL", type: "url" },
      { key: "affiliate_rentals_label", label: "Rentals Label", type: "text" },
      { key: "affiliate_vacation_url", label: "Vacation URL", type: "url" },
      { key: "affiliate_vacation_label", label: "Vacation Label", type: "text" },
    ],
  },
];

function validateSettingValue(
  value: string,
  type: string
): string | undefined {
  if (!value) return undefined;
  if (type === "email") {
    const result = z.string().email().safeParse(value);
    if (!result.success) return "Must be a valid email address";
  }
  if (type === "url") {
    const result = z.string().url().safeParse(value);
    if (!result.success) return "Must be a valid URL";
  }
  if (type === "number") {
    const num = parseInt(value);
    if (isNaN(num) || num < 1 || num > 50) return "Must be a number between 1 and 50";
  }
  return undefined;
}

export function SettingsForm({
  initialSettings,
}: {
  initialSettings: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialSettings);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function updateValue(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function handleSave() {
    // Validate all fields based on their type
    const newErrors: Record<string, string> = {};
    for (const group of settingsGroups) {
      for (const setting of group.settings) {
        const error = validateSettingValue(
          values[setting.key] ?? "",
          setting.type
        );
        if (error) newErrors[setting.key] = error;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
                    type={setting.type === "email" || setting.type === "url" ? "text" : setting.type}
                    value={values[setting.key] ?? ""}
                    onChange={(e) => updateValue(setting.key, e.target.value)}
                    placeholder={setting.placeholder}
                    className={errors[setting.key] ? "border-destructive" : ""}
                  />
                )}
                <FieldError error={errors[setting.key]} />
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
