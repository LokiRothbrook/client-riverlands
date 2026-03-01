"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { FieldError } from "@/components/admin/field-error";
import { createCountySchema, updateCountySchema, validateForm } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";
import { toast } from "sonner";

interface CountyFormProps {
  county?: {
    id: string;
    name: string;
    slug: string;
    seat: string;
    description: string;
    short_description: string;
    hero_image: string | null;
    lat: number | null;
    lng: number | null;
    display_order: number;
    meta_title: string | null;
    meta_description: string | null;
  };
}

export function CountyForm({ county }: CountyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState(county?.name ?? "");
  const [slug, setSlug] = useState(county?.slug ?? "");
  const [seat, setSeat] = useState(county?.seat ?? "");
  const [description, setDescription] = useState(county?.description ?? "");
  const [shortDescription, setShortDescription] = useState(
    county?.short_description ?? ""
  );
  const [heroImage, setHeroImage] = useState(county?.hero_image ?? "");
  const [lat, setLat] = useState(county?.lat?.toString() ?? "");
  const [lng, setLng] = useState(county?.lng?.toString() ?? "");
  const [displayOrder, setDisplayOrder] = useState(
    county?.display_order?.toString() ?? "0"
  );
  const [metaTitle, setMetaTitle] = useState(county?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(
    county?.meta_description ?? ""
  );

  const isEdit = !!county;

  function clearError(field: string) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  useEffect(() => {
    if (!isEdit && name) {
      setSlug(slugify(name));
    }
  }, [name, isEdit]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data = {
      name,
      slug,
      seat,
      description,
      shortDescription,
      heroImage: heroImage || null,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      displayOrder: parseInt(displayOrder) || 0,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
    };

    const schema = isEdit ? updateCountySchema : createCountySchema;
    const result = validateForm(schema, data);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setLoading(true);

    try {
      const url = isEdit
        ? `/api/admin/counties/${county.id}`
        : "/api/admin/counties";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Failed to save county");
        return;
      }

      toast.success(isEdit ? "County updated" : "County created");
      router.push("/admin/counties");
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
              <CardTitle>County Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearError("name");
                    }}
                    placeholder="Adams County"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  <FieldError error={errors.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      clearError("slug");
                    }}
                    placeholder="adams"
                    className={errors.slug ? "border-destructive" : ""}
                  />
                  <FieldError error={errors.slug} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seat">County Seat</Label>
                <Input
                  id="seat"
                  value={seat}
                  onChange={(e) => {
                    setSeat(e.target.value);
                    clearError("seat");
                  }}
                  placeholder="Quincy"
                  className={errors.seat ? "border-destructive" : ""}
                />
                <FieldError error={errors.seat} />
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
                  rows={4}
                  placeholder="Full county description..."
                  className={errors.description ? "border-destructive" : ""}
                />
                <FieldError error={errors.description} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={shortDescription}
                  onChange={(e) => {
                    setShortDescription(e.target.value);
                    clearError("shortDescription");
                  }}
                  rows={2}
                  placeholder="Brief tagline for county cards..."
                  className={
                    errors.shortDescription ? "border-destructive" : ""
                  }
                />
                <FieldError error={errors.shortDescription} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={heroImage}
                onChange={setHeroImage}
                folder="riverlands/counties"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  min="0"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                />
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="39.9356"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="-91.4099"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => {
                    setMetaTitle(e.target.value);
                    clearError("metaTitle");
                  }}
                  placeholder="Custom meta title"
                  className={errors.metaTitle ? "border-destructive" : ""}
                />
                <FieldError error={errors.metaTitle} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => {
                    setMetaDescription(e.target.value);
                    clearError("metaDescription");
                  }}
                  placeholder="Custom meta description"
                  rows={2}
                  className={
                    errors.metaDescription ? "border-destructive" : ""
                  }
                />
                <FieldError error={errors.metaDescription} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update County" : "Create County"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/counties")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
