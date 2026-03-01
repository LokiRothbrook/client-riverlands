"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

interface Preferences {
  email: string;
  firstName: string | null;
  lastName: string | null;
  counties: string[];
  topics: string[];
  frequency: string;
}

export function ManagePreferencesForm({ token }: { token: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unsubscribing, setUnsubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<Preferences | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("weekly");

  useEffect(() => {
    async function fetchPreferences() {
      try {
        const res = await fetch(`/api/newsletter/preferences?token=${token}`);
        if (!res.ok) {
          setError("Invalid or expired link. Please request a new one.");
          return;
        }
        const data = await res.json();
        setPrefs(data);
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setSelectedCounties(data.counties || []);
        setSelectedTopics(data.topics || []);
        setFrequency(data.frequency || "weekly");
      } catch {
        setError("Failed to load preferences. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchPreferences();
  }, [token]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/newsletter/preferences?token=${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          counties: selectedCounties,
          topics: selectedTopics,
          frequency,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Failed to save preferences");
        return;
      }

      toast.success("Your preferences have been updated!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUnsubscribe() {
    setUnsubscribing(true);

    try {
      // Use the existing unsubscribe endpoint
      const res = await fetch(`/api/newsletter/unsubscribe?token=${token}`);
      if (res.redirected) {
        router.push("/newsletter?unsubscribed=true");
      } else {
        toast.error("Failed to unsubscribe. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setUnsubscribing(false);
    }
  }

  function toggleCounty(slug: string) {
    setSelectedCounties((prev) =>
      prev.includes(slug)
        ? prev.filter((c) => c !== slug)
        : [...prev, slug]
    );
  }

  function toggleTopic(value: string) {
    setSelectedTopics((prev) =>
      prev.includes(value)
        ? prev.filter((t) => t !== value)
        : [...prev, value]
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Loading your preferences...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-destructive">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/newsletter/manage")}
          >
            Request New Link
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Preferences</CardTitle>
          <CardDescription>
            Subscribed as: {prefs?.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Topics of Interest</Label>
              <p className="text-xs text-muted-foreground">
                Select what content you&apos;d like to receive (leave blank for
                all)
              </p>
              <div className="grid grid-cols-1 gap-2">
                {topics.map((topic) => (
                  <label
                    key={topic.value}
                    className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-secondary"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTopics.includes(topic.value)}
                      onChange={() => toggleTopic(topic.value)}
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
                Select which counties you&apos;d like to hear about (leave blank
                for all)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {counties.map((county) => (
                  <label
                    key={county.slug}
                    className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-secondary"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCounties.includes(county.slug)}
                      onChange={() => toggleCounty(county.slug)}
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

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : "Save Preferences"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Unsubscribe</CardTitle>
          <CardDescription>
            Remove yourself from our mailing list entirely.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Unsubscribe from All Emails
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove you from our newsletter. You can always
                  subscribe again later if you change your mind.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleUnsubscribe}
                  disabled={unsubscribing}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {unsubscribing ? "Unsubscribing..." : "Yes, Unsubscribe"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
