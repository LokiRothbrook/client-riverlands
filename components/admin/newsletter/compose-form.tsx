"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TiptapEditor } from "@/components/admin/editor/tiptap-editor";
import { FieldError } from "@/components/admin/field-error";
import { composeNewsletterSchema, validateForm } from "@/lib/validations/admin";
import { counties } from "@/lib/counties";
import { toast } from "sonner";

export function ComposeForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [targetCounties, setTargetCounties] = useState<string[]>([]);

  function clearError(field: string) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function toggleCounty(slug: string) {
    setTargetCounties((prev) =>
      prev.includes(slug)
        ? prev.filter((c) => c !== slug)
        : [...prev, slug]
    );
  }

  async function handleSend() {
    const result = validateForm(composeNewsletterSchema, { subject, html });
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    if (
      !confirm(
        `Send this newsletter to ${targetCounties.length > 0 ? targetCounties.join(", ") : "all"} subscribers?`
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          html,
          targetCounties: targetCounties.length > 0 ? targetCounties : undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Failed to send newsletter");
        return;
      }

      toast.success(`Newsletter sent to ${json.sent} subscribers`);
      setSubject("");
      setHtml("");
      setTargetCounties([]);
      setErrors({});
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose Newsletter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              clearError("subject");
            }}
            placeholder="Newsletter subject"
            className={errors.subject ? "border-destructive" : ""}
          />
          <FieldError error={errors.subject} />
        </div>

        <div className="space-y-2">
          <Label>Target Counties (leave empty for all)</Label>
          <div className="flex flex-wrap gap-2">
            {counties.map((county) => (
              <label
                key={county.slug}
                className="flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs hover:bg-secondary"
              >
                <input
                  type="checkbox"
                  checked={targetCounties.includes(county.slug)}
                  onChange={() => toggleCounty(county.slug)}
                  className="rounded"
                />
                {county.name.replace(" County", "")}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <TiptapEditor
            content={html}
            onChange={(val) => {
              setHtml(val);
              clearError("html");
            }}
            placeholder="Write your newsletter..."
          />
          <FieldError error={errors.html} />
        </div>

        <Button onClick={handleSend} disabled={loading}>
          {loading ? "Sending..." : "Send Newsletter"}
        </Button>
      </CardContent>
    </Card>
  );
}
