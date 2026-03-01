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
import { TiptapEditor } from "@/components/admin/editor/tiptap-editor";
import { ImageUpload } from "@/components/admin/image-upload";
import { FieldError } from "@/components/admin/field-error";
import { createPostSchema, updatePostSchema, validateForm } from "@/lib/validations/admin";
import { slugify } from "@/lib/slug";
import { toast } from "sonner";

interface County {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PostFormProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image: string | null;
    county_id: string;
    category_id: string;
    is_featured: boolean;
    show_cover_image: boolean;
    status: string;
    meta_title: string | null;
    meta_description: string | null;
  };
  counties: County[];
  categories: Category[];
}

export function PostForm({ post, counties, categories }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [featuredImage, setFeaturedImage] = useState(
    post?.featured_image ?? ""
  );
  const [countyId, setCountyId] = useState(post?.county_id ?? "");
  const [categoryId, setCategoryId] = useState(post?.category_id ?? "");
  const [isFeatured, setIsFeatured] = useState(post?.is_featured ?? false);
  const [showCoverImage, setShowCoverImage] = useState(
    post?.show_cover_image ?? true
  );
  const [status, setStatus] = useState(post?.status ?? "draft");
  const [metaTitle, setMetaTitle] = useState(post?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(
    post?.meta_description ?? ""
  );

  const isEdit = !!post;

  function clearError(field: string) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  useEffect(() => {
    if (!isEdit && title) {
      setSlug(slugify(title));
    }
  }, [title, isEdit]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data = {
      title,
      slug,
      content,
      excerpt,
      isFeatured,
      showCoverImage,
      featuredImage: featuredImage || null,
      countyId,
      categoryId,
      status,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
    };

    const schema = isEdit ? updatePostSchema : createPostSchema;
    const result = validateForm(schema, data);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setLoading(true);

    try {
      const url = isEdit ? `/api/admin/posts/${post.id}` : "/api/admin/posts";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Failed to save post");
        return;
      }

      toast.success(isEdit ? "Post updated" : "Post created");
      router.push("/admin/posts");
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
              <CardTitle>Content</CardTitle>
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
                  placeholder="Post title"
                  className={errors.title ? "border-destructive" : ""}
                />
                <FieldError error={errors.title} />
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
                  placeholder="post-url-slug"
                  className={errors.slug ? "border-destructive" : ""}
                />
                <FieldError error={errors.slug} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => {
                    setExcerpt(e.target.value);
                    clearError("excerpt");
                  }}
                  placeholder="Brief summary of the post"
                  rows={3}
                  className={errors.excerpt ? "border-destructive" : ""}
                />
                <FieldError error={errors.excerpt} />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <TiptapEditor
                  content={content}
                  onChange={(val) => {
                    setContent(val);
                    clearError("content");
                  }}
                />
                <FieldError error={errors.content} />
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
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="featured">Feature on homepage</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showCoverImage"
                  checked={showCoverImage}
                  onChange={(e) => setShowCoverImage(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="showCoverImage">Show cover image</Label>
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
                  value={categoryId}
                  onValueChange={(val) => {
                    setCategoryId(val);
                    clearError("categoryId");
                  }}
                >
                  <SelectTrigger className={errors.categoryId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError error={errors.categoryId} />
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
                folder="riverlands/posts"
              />
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
                  className={errors.metaDescription ? "border-destructive" : ""}
                />
                <FieldError error={errors.metaDescription} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/posts")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
