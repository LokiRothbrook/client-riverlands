"use client";

import { useState, useEffect } from "react";
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
import { createPartnerSchema, updatePartnerSchema, validateForm } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";
import { toast } from "sonner";

interface County {
  id: string;
  name: string;
  slug: string;
}

interface PartnerFormProps {
  partner?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    logo: string | null;
    website: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    county_id: string;
    category: string;
    is_featured: boolean;
    status: string;
  };
  counties: County[];
}

export function PartnerForm({ partner, counties }: PartnerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState(partner?.name ?? "");
  const [slug, setSlug] = useState(partner?.slug ?? "");
  const [description, setDescription] = useState(partner?.description ?? "");
  const [logo, setLogo] = useState(partner?.logo ?? "");
  const [website, setWebsite] = useState(partner?.website ?? "");
  const [email, setEmail] = useState(partner?.email ?? "");
  const [phone, setPhone] = useState(partner?.phone ?? "");
  const [address, setAddress] = useState(partner?.address ?? "");
  const [countyId, setCountyId] = useState(partner?.county_id ?? "");
  const [category, setCategory] = useState(partner?.category ?? "");
  const [isFeatured, setIsFeatured] = useState(partner?.is_featured ?? false);
  const [status, setStatus] = useState(partner?.status ?? "active");

  const isEdit = !!partner;

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
      description,
      logo: logo || null,
      website: website || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      countyId,
      category,
      isFeatured,
      status,
    };

    const schema = isEdit ? updatePartnerSchema : createPartnerSchema;
    const result = validateForm(schema, data);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setLoading(true);

    try {
      const url = isEdit
        ? `/api/admin/partners/${partner.id}`
        : "/api/admin/partners";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Failed to save partner");
        return;
      }

      toast.success(isEdit ? "Partner updated" : "Partner created");
      router.push("/admin/partners");
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
              <CardTitle>Partner Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Business Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearError("name");
                    }}
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
                    className={errors.slug ? "border-destructive" : ""}
                  />
                  <FieldError error={errors.slug} />
                </div>
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
                  className={errors.description ? "border-destructive" : ""}
                />
                <FieldError error={errors.description} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError("email");
                    }}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  <FieldError error={errors.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      clearError("phone");
                    }}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  <FieldError error={errors.phone} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => {
                    setWebsite(e.target.value);
                    clearError("website");
                  }}
                  className={errors.website ? "border-destructive" : ""}
                />
                <FieldError error={errors.website} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    clearError("address");
                  }}
                  className={errors.address ? "border-destructive" : ""}
                />
                <FieldError error={errors.address} />
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lodging">Lodging</SelectItem>
                    <SelectItem value="dining">Dining</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="recreation">Recreation</SelectItem>
                    <SelectItem value="museum">Museum</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError error={errors.category} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="featured">Featured Partner</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={logo}
                onChange={setLogo}
                folder="riverlands/partners"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Partner" : "Create Partner"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/partners")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
