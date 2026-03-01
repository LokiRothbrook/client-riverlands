"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { FieldError } from "@/components/admin/field-error";
import { createAdSchema, updateAdSchema, validateForm } from "@/lib/validations/admin";
import { toast } from "sonner";

interface County {
  id: string;
  name: string;
  slug: string;
}

interface AdFormProps {
  ad?: {
    id: string;
    business_name: string;
    image_url: string;
    link_url: string;
    placement_zone: string;
    county_id: string | null;
    is_active: boolean;
    start_date: string;
    end_date: string;
  };
  counties: County[];
}

export function AdForm({ ad, counties }: AdFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [businessName, setBusinessName] = useState(ad?.business_name ?? "");
  const [imageUrl, setImageUrl] = useState(ad?.image_url ?? "");
  const [linkUrl, setLinkUrl] = useState(ad?.link_url ?? "");
  const [placementZone, setPlacementZone] = useState(
    ad?.placement_zone ?? "homepage_banner"
  );
  const [countyId, setCountyId] = useState(ad?.county_id ?? "");
  const [isActive, setIsActive] = useState(ad?.is_active ?? true);
  const [startDate, setStartDate] = useState(
    ad?.start_date ? ad.start_date.slice(0, 10) : ""
  );
  const [endDate, setEndDate] = useState(
    ad?.end_date ? ad.end_date.slice(0, 10) : ""
  );

  const isEdit = !!ad;

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
      businessName,
      imageUrl,
      linkUrl,
      placementZone,
      countyId: countyId || null,
      isActive,
      startDate,
      endDate,
    };

    const schema = isEdit ? updateAdSchema : createAdSchema;
    const result = validateForm(schema, data);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setLoading(true);

    try {
      const url = isEdit ? `/api/admin/ads/${ad.id}` : "/api/admin/ads";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Failed to save ad");
        return;
      }

      toast.success(isEdit ? "Ad updated" : "Ad created");
      router.push("/admin/ads");
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
              <CardTitle>Ad Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    clearError("businessName");
                  }}
                  className={errors.businessName ? "border-destructive" : ""}
                />
                <FieldError error={errors.businessName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkUrl">Link URL</Label>
                <Input
                  id="linkUrl"
                  type="url"
                  value={linkUrl}
                  onChange={(e) => {
                    setLinkUrl(e.target.value);
                    clearError("linkUrl");
                  }}
                  placeholder="https://..."
                  className={errors.linkUrl ? "border-destructive" : ""}
                />
                <FieldError error={errors.linkUrl} />
              </div>
              <div className="space-y-2">
                <Label>Ad Image</Label>
                <ImageUpload
                  value={imageUrl}
                  onChange={(val) => {
                    setImageUrl(val);
                    clearError("imageUrl");
                  }}
                  folder="riverlands/ads"
                />
                <FieldError error={errors.imageUrl} />
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
                <Label>Placement Zone</Label>
                <Select value={placementZone} onValueChange={setPlacementZone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homepage_banner">
                      Homepage Banner
                    </SelectItem>
                    <SelectItem value="county_sidebar">
                      County Sidebar
                    </SelectItem>
                    <SelectItem value="post_inline">Post Inline</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>County (optional)</Label>
                <Select value={countyId} onValueChange={setCountyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Site-wide" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Site-wide</SelectItem>
                    {counties.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
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
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
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
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Ad" : "Create Ad"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/ads")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
