"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export function PartnerApplyForm() {
  const [loading, setLoading] = useState(false);
  const [county, setCounty] = useState("");
  const [category, setCategory] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      businessName: formData.get("businessName") as string,
      contactName: formData.get("contactName") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      website: (formData.get("website") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
      county,
      category,
      description: formData.get("description") as string,
      additionalInfo: (formData.get("additionalInfo") as string) || undefined,
    };

    try {
      const res = await fetch("/api/partners/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Failed to submit application");
        return;
      }

      toast.success(result.message);
      form.reset();
      setCounty("");
      setCategory("");
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
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            name="businessName"
            placeholder="Your business name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactName">Contact Person *</Label>
          <Input
            id="contactName"
            name="contactName"
            placeholder="Full name"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="county">County *</Label>
          <Select value={county} onValueChange={setCounty}>
            <SelectTrigger id="county">
              <SelectValue placeholder="Select county" />
            </SelectTrigger>
            <SelectContent>
              {counties.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Business Category *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lodging">Lodging &amp; Hotels</SelectItem>
              <SelectItem value="dining">Restaurants &amp; Dining</SelectItem>
              <SelectItem value="shopping">Shopping &amp; Retail</SelectItem>
              <SelectItem value="recreation">
                Recreation &amp; Outdoors
              </SelectItem>
              <SelectItem value="museum">Museums &amp; Attractions</SelectItem>
              <SelectItem value="services">
                Services &amp; Professional
              </SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          type="url"
          placeholder="https://yourbusiness.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Business Address</Label>
        <Input
          id="address"
          name="address"
          placeholder="Street address, city, state, zip"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Business Description *</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Tell us about your business — what you offer, your history, what makes you special..."
          rows={5}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalInfo">Additional Information</Label>
        <Textarea
          id="additionalInfo"
          name="additionalInfo"
          placeholder="Hours of operation, seasonal availability, anything else visitors should know..."
          rows={3}
        />
      </div>

      <div className="rounded-lg bg-secondary/50 p-4 text-sm text-muted-foreground">
        <p>
          Submissions are reviewed by our team. You&apos;ll receive a
          confirmation email once your listing has been approved. Free basic
          listings are available, with featured placement options for enhanced
          visibility.
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
