"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { counties } from "@/lib/counties";
import { toast } from "sonner";

const topics = [
  { value: "events", label: "Events & Activities" },
  { value: "business_news", label: "Business News & Spotlights" },
];

const frequencies = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every Two Weeks" },
  { value: "monthly", label: "Monthly" },
];

export function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const [frequency, setFrequency] = useState("weekly");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const selectedCounties = formData.getAll("counties") as string[];
    const selectedTopics = formData.getAll("topics") as string[];

    const data = {
      email: formData.get("email") as string,
      firstName: (formData.get("firstName") as string) || undefined,
      lastName: (formData.get("lastName") as string) || undefined,
      counties: selectedCounties.length > 0 ? selectedCounties : undefined,
      topics: selectedTopics.length > 0 ? selectedTopics : undefined,
      frequency: frequency,
    };

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Failed to subscribe");
        return;
      }

      toast.success(result.message);
      form.reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" placeholder="First name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" placeholder="Last name" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="email@example.com"
          required
        />
      </div>

      <div className="space-y-3">
        <Label>Topics of Interest</Label>
        <p className="text-xs text-muted-foreground">
          Select what content you&apos;d like to receive (leave blank for all)
        </p>
        <div className="grid grid-cols-1 gap-2">
          {topics.map((topic) => (
            <label
              key={topic.value}
              className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-secondary"
            >
              <input
                type="checkbox"
                name="topics"
                value={topic.value}
                className="rounded border-input"
              />
              {topic.label}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Counties of Interest</Label>
        <p className="text-xs text-muted-foreground">
          Select which counties you&apos;d like to hear about (leave blank for all)
        </p>
        <div className="grid grid-cols-2 gap-2">
          {counties.map((county) => (
            <label
              key={county.slug}
              className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-secondary"
            >
              <input
                type="checkbox"
                name="counties"
                value={county.slug}
                className="rounded border-input"
              />
              {county.name}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Email Frequency</Label>
        <Select value={frequency} onValueChange={setFrequency}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {frequencies.map((freq) => (
              <SelectItem key={freq.value} value={freq.value}>
                {freq.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg bg-secondary/50 p-4 text-xs text-muted-foreground">
        No spam, ever. You can unsubscribe or change your preferences at any
        time.
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
}
