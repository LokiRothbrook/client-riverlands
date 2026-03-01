"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { FieldError } from "@/components/admin/field-error";
import { createEventSchema, updateEventSchema, validateForm } from "@/lib/validations/admin";
import { toast } from "sonner";

interface County {
  id: string;
  name: string;
  slug: string;
}

interface EventFormProps {
  event?: {
    id: string;
    title: string;
    description: string;
    location: string;
    county_id: string;
    category: string;
    status: string;
    start_date: string;
    end_date: string | null;
    recurring: string | null;
    external_link: string | null;
    featured_image: string | null;
  };
  counties: County[];
}

export function EventForm({ event, counties }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [location, setLocation] = useState(event?.location ?? "");
  const [countyId, setCountyId] = useState(event?.county_id ?? "");
  const [category, setCategory] = useState(event?.category ?? "general");
  const [status, setStatus] = useState(event?.status ?? "draft");
  const [startDate, setStartDate] = useState(
    event?.start_date ? event.start_date.slice(0, 16) : ""
  );
  const [endDate, setEndDate] = useState(
    event?.end_date ? event.end_date.slice(0, 16) : ""
  );
  const [recurring, setRecurring] = useState(event?.recurring ?? "");
  const [externalLink, setExternalLink] = useState(
    event?.external_link ?? ""
  );
  const [featuredImage, setFeaturedImage] = useState(
    event?.featured_image ?? ""
  );

  const isEdit = !!event;

  function clearError(field: string) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data = {
      title,
      description,
      location,
      countyId,
      category,
      status,
      startDate,
      endDate: endDate || null,
      recurring: recurring || null,
      externalLink: externalLink || null,
      featuredImage: featuredImage || null,
    };

    const schema = isEdit ? updateEventSchema : createEventSchema;
    const result = validateForm(schema, data);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setLoading(true);

    // Convert dates to ISO for the API
    const apiData = {
      ...data,
      startDate: new Date(startDate).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : null,
    };

    try {
      const url = isEdit
        ? `/api/admin/events/${event.id}`
        : "/api/admin/events";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Failed to save event");
        return;
      }

      toast.success(isEdit ? "Event updated" : "Event created");
      router.push("/admin/events");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    clearError("title");
                  }}
                  placeholder="Event title"
                  className={errors.title ? "border-destructive" : ""}
                />
                <FieldError error={errors.title} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    clearError("description");
                  }}
                  placeholder="Event description"
                  rows={5}
                  className={errors.description ? "border-destructive" : ""}
                />
                <FieldError error={errors.description} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    clearError("location");
                  }}
                  placeholder="Event venue / address"
                  className={errors.location ? "border-destructive" : ""}
                />
                <FieldError error={errors.location} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date & Time</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      clearError("startDate");
                    }}
                    className={errors.startDate ? "border-destructive" : ""}
                  />
                  <FieldError error={errors.startDate} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date & Time</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      clearError("endDate");
                    }}
                    className={errors.endDate ? "border-destructive" : ""}
                  />
                  <FieldError error={errors.endDate} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="externalLink">External Link</Label>
                <Input
                  id="externalLink"
                  type="url"
                  value={externalLink}
                  onChange={(e) => {
                    setExternalLink(e.target.value);
                    clearError("externalLink");
                  }}
                  placeholder="https://..."
                  className={errors.externalLink ? "border-destructive" : ""}
                />
                <FieldError error={errors.externalLink} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>County</Label>
                <Select
                  value={countyId}
                  onValueChange={(val) => {
                    setCountyId(val);
                    clearError("countyId");
                  }}
                >
                  <SelectTrigger className={errors.countyId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    {counties.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError error={errors.countyId} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(val) => {
                    setCategory(val);
                    clearError("category");
                  }}
                >
                  <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="festival">Festival</SelectItem>
                    <SelectItem value="tour">Tour</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError error={errors.category} />
              </div>
              <div className="space-y-2">
                <Label>Recurring</Label>
                <Select value={recurring} onValueChange={setRecurring}>
                  <SelectTrigger>
                    <SelectValue placeholder="One-time event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">One-time</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={featuredImage}
                onChange={setFeaturedImage}
                folder="riverlands/events"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/events")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
