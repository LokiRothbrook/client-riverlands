"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError } from "@/components/admin/field-error";
import { createCategorySchema, updateCategorySchema, validateForm } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";
import { toast } from "sonner";

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    display_order: number;
  };
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [displayOrder, setDisplayOrder] = useState(
    category?.display_order?.toString() ?? "0"
  );

  const isEdit = !!category;

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
      description: description || null,
      displayOrder: parseInt(displayOrder) || 0,
    };

    const schema = isEdit ? updateCategorySchema : createCategorySchema;
    const result = validateForm(schema, data);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setLoading(true);

    try {
      const url = isEdit
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Failed to save category");
        return;
      }

      toast.success(isEdit ? "Category updated" : "Category created");
      router.push("/admin/categories");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("name");
              }}
              placeholder="Category name"
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
              placeholder="category-slug"
              className={errors.slug ? "border-destructive" : ""}
            />
            <FieldError error={errors.slug} />
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
              rows={3}
              placeholder="Optional description"
              className={errors.description ? "border-destructive" : ""}
            />
            <FieldError error={errors.description} />
          </div>
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
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : isEdit
              ? "Update Category"
              : "Create Category"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/categories")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
