"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TiptapEditor } from "@/components/admin/editor/tiptap-editor";
import { counties } from "@/lib/counties";
import { toast } from "sonner";

export function ComposeForm() {
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [targetCounties, setTargetCounties] = useState<string[]>([]);

  function toggleCounty(slug: string) {
    setTargetCounties((prev) =>
      prev.includes(slug)
        ? prev.filter((c) => c !== slug)
        : [...prev, slug]
    );
  }

  async function handleSend() {
    if (!subject || !html) {
      toast.error("Subject and content are required");
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

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Failed to send newsletter");
        return;
      }

      toast.success(`Newsletter sent to ${result.sent} subscribers`);
      setSubject("");
      setHtml("");
      setTargetCounties([]);
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
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Newsletter subject"
          />
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
            onChange={setHtml}
            placeholder="Write your newsletter..."
          />
        </div>

        <Button onClick={handleSend} disabled={loading}>
          {loading ? "Sending..." : "Send Newsletter"}
        </Button>
      </CardContent>
    </Card>
  );
}
