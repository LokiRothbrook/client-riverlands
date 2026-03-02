"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TiptapEditor } from "@/components/admin/editor/tiptap-editor";
import { ImageUpload } from "@/components/admin/image-upload";
import { slugify } from "@/lib/slug";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  EyeIcon,
  ViewOffIcon,
  ViewSidebarRightIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

type SaveStatus = "idle" | "pending" | "saving" | "saved" | "error";
type PostStatus = "draft" | "published" | "archived";

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
    published_at?: string | null;
    meta_title: string | null;
    meta_description: string | null;
  };
  counties: County[];
  categories: Category[];
}

/** Format a "YYYY-MM-DD" date string for display (e.g. "Mar 10, 2026") */
function formatScheduledDate(dateStr: string): string {
  // Parse as noon UTC to avoid off-by-one from timezone shifts
  return new Date(dateStr + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Today's date as "YYYY-MM-DD" — used as the minimum for the date picker */
function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function PostForm({ post, counties, categories }: PostFormProps) {
  const router = useRouter();

  // Post ID — updated after first auto-create
  const postIdRef = useRef<string | null>(post?.id ?? null);
  const [postId, setPostId] = useState<string | null>(post?.id ?? null);

  // Content fields
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image ?? "");
  const [countyId, setCountyId] = useState(post?.county_id ?? counties[0]?.id ?? "");
  const [categoryId, setCategoryId] = useState(
    post?.category_id ?? categories[0]?.id ?? ""
  );
  const [isFeatured, setIsFeatured] = useState(post?.is_featured ?? false);
  const [showCoverImage, setShowCoverImage] = useState(
    post?.show_cover_image ?? true
  );
  const [status, setStatus] = useState<PostStatus>(
    (post?.status as PostStatus) ?? "draft"
  );
  const [metaTitle, setMetaTitle] = useState(post?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(
    post?.meta_description ?? ""
  );
  const [slugEdited, setSlugEdited] = useState(!!post);

  // Scheduled publish date (YYYY-MM-DD) — only relevant for draft posts
  const [scheduledFor, setScheduledFor] = useState<string>(() => {
    if (post?.status === "draft" && post.published_at) {
      const d = new Date(post.published_at);
      // Only pre-fill if the stored date is in the future
      if (d > new Date()) {
        return d.toISOString().slice(0, 10);
      }
    }
    return "";
  });

  // UI state
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [previewMode, setPreviewMode] = useState(false);
  // Lazy init from localStorage — no effect needed
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("admin-post-sidebar-open") !== "false";
  });

  // Ref of latest form values for use in async callbacks (avoids stale closures)
  const currentRef = useRef({
    title,
    slug,
    content,
    excerpt,
    featuredImage,
    countyId,
    categoryId,
    isFeatured,
    showCoverImage,
    status,
    metaTitle,
    metaDescription,
    scheduledFor,
  });
  useEffect(() => {
    currentRef.current = {
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      countyId,
      categoryId,
      isFeatured,
      showCoverImage,
      status,
      metaTitle,
      metaDescription,
      scheduledFor,
    };
  });

  // Auto-save debounce timer ref
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function toggleSidebar() {
    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem("admin-post-sidebar-open", String(next));
      return next;
    });
  }

  // ── Core save function ─────────────────────────────────────────
  async function performSave(overrideStatus?: PostStatus): Promise<boolean> {
    const c = currentRef.current;
    const saveWith = overrideStatus ?? c.status;

    if (!c.title.trim() || !c.countyId || !c.categoryId) return false;

    setSaveStatus("saving");
    try {
      // Determine what to send for scheduledFor:
      // - Publishing immediately → clear any existing schedule
      // - Draft with a date set → set to 6am UTC on that date (≈ midnight CST)
      // - Draft with no date → clear it (null)
      let scheduledForValue: string | null = null;
      if (saveWith !== "published" && c.scheduledFor) {
        scheduledForValue = `${c.scheduledFor}T06:00:00.000Z`;
      }

      const body = {
        title: c.title,
        slug: c.slug || slugify(c.title),
        content: c.content || "",
        excerpt: c.excerpt || "",
        featuredImage: c.featuredImage || null,
        countyId: c.countyId,
        categoryId: c.categoryId,
        isFeatured: c.isFeatured,
        showCoverImage: c.showCoverImage,
        metaTitle: c.metaTitle || null,
        metaDescription: c.metaDescription || null,
        status: saveWith,
        scheduledFor: scheduledForValue,
      };

      const id = postIdRef.current;
      const url = id ? `/api/admin/posts/${id}` : "/api/admin/posts";
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        setSaveStatus("error");
        return false;
      }

      // After first creation, update ID and URL without a full navigation
      if (!postIdRef.current && json.id) {
        postIdRef.current = json.id;
        setPostId(json.id);
        window.history.replaceState({}, "", `/admin/posts/${json.id}/edit`);
      }

      setSaveStatus("saved");
      setTimeout(
        () => setSaveStatus((s) => (s === "saved" ? "idle" : s)),
        3000
      );
      return true;
    } catch {
      setSaveStatus("error");
      return false;
    }
  }

  // Keep a ref to always-fresh performSave for the debounce timeout
  const performSaveRef = useRef(performSave);
  useEffect(() => {
    performSaveRef.current = performSave;
  });

  // Mark dirty — called from field onChange handlers to update the save indicator
  function markDirty() {
    setSaveStatus("pending");
  }

  // Title change handler — also auto-generates slug for new posts
  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugEdited && value) setSlug(slugify(value));
    markDirty();
  }

  // Auto-save effect — schedules the API call after a pause in typing
  useEffect(() => {
    if (!title.trim()) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      performSaveRef.current();
    }, 2000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    title,
    slug,
    content,
    excerpt,
    featuredImage,
    countyId,
    categoryId,
    isFeatured,
    showCoverImage,
    metaTitle,
    metaDescription,
    scheduledFor,
  ]);

  // ── Status action buttons ──────────────────────────────────────
  async function handlePublish() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("published");
    setScheduledFor(""); // Clear any pending schedule — publishing immediately
    const ok = await performSaveRef.current("published");
    if (ok) toast.success("Post published");
  }

  async function handleUnpublish() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("draft");
    const ok = await performSaveRef.current("draft");
    if (ok) toast.success("Post moved back to drafts");
  }

  async function handleArchive() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("archived");
    const ok = await performSaveRef.current("archived");
    if (ok) toast.success("Post archived");
  }

  async function handleClearSchedule() {
    setScheduledFor("");
    markDirty();
  }

  // ── Derived state ──────────────────────────────────────────────
  const isScheduled = status === "draft" && !!scheduledFor;

  const selectedCounty = counties.find((c) => c.id === countyId);
  const selectedCategory = categories.find((c) => c.id === categoryId);

  const statusVariant: Record<PostStatus, "secondary" | "default" | "outline"> =
    {
      draft: "secondary",
      published: "default",
      archived: "outline",
    };

  // ── Render ─────────────────────────────────────────────────────
  const headerSlot =
    typeof document !== "undefined"
      ? document.getElementById("admin-header-post-actions")
      : null;

  return (
    <div>
      {/* Actions portaled into the AdminHeader bar */}
      {headerSlot &&
        createPortal(
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/posts")}
              className="gap-1.5 text-muted-foreground"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              <span className="hidden sm:inline">Posts</span>
            </Button>

            <Separator orientation="vertical" className="h-5" />

            {/* Status badge — shows "Scheduled" when a future date is set */}
            <Badge
              variant={isScheduled ? "secondary" : statusVariant[status]}
              className={cn(
                "capitalize",
                isScheduled && "border-amber/50 text-amber"
              )}
            >
              {isScheduled ? "Scheduled" : status}
            </Badge>

            {/* Show the scheduled date in the header */}
            {isScheduled && (
              <span className="hidden text-xs text-muted-foreground sm:block">
                {formatScheduledDate(scheduledFor)}
              </span>
            )}

            <span
              className={cn(
                "hidden text-xs sm:block",
                saveStatus === "idle" && "invisible",
                saveStatus === "pending" && "text-amber-600",
                saveStatus === "saving" && "text-muted-foreground",
                saveStatus === "saved" && "text-green-600 dark:text-green-400",
                saveStatus === "error" && "text-destructive"
              )}
            >
              {saveStatus === "pending" && "Unsaved changes"}
              {saveStatus === "saving" && "Saving…"}
              {saveStatus === "saved" && "Saved"}
              {saveStatus === "error" && "Failed to save"}
            </span>

            {/* Right sidebar toggle */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              title={sidebarOpen ? "Hide settings panel" : "Show settings panel"}
              className={cn(
                "gap-1.5 text-muted-foreground",
                sidebarOpen && "bg-secondary"
              )}
            >
              <HugeiconsIcon icon={ViewSidebarRightIcon} size={16} />
              <span className="hidden lg:inline">Settings</span>
            </Button>

            <Separator orientation="vertical" className="h-5" />

            {/* Preview toggle */}
            <Button
              type="button"
              variant={previewMode ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode((p) => !p)}
              className="gap-1.5"
            >
              <HugeiconsIcon
                icon={previewMode ? ViewOffIcon : EyeIcon}
                size={16}
              />
              {previewMode ? "Edit" : "Preview"}
            </Button>

            {/* Status action buttons */}
            {status === "draft" && (
              <Button
                type="button"
                size="sm"
                onClick={handlePublish}
                disabled={saveStatus === "saving" || !title.trim()}
              >
                {isScheduled ? "Publish Now" : "Publish"}
              </Button>
            )}
            {status === "published" && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUnpublish}
                  disabled={saveStatus === "saving"}
                >
                  Unpublish
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleArchive}
                  disabled={saveStatus === "saving"}
                  className="text-muted-foreground"
                >
                  Archive
                </Button>
              </>
            )}
            {status === "archived" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePublish}
                disabled={saveStatus === "saving" || !title.trim()}
              >
                Republish
              </Button>
            )}
          </div>,
          headerSlot
        )}

      {/* ── Preview mode ── */}
      {previewMode ? (
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 rounded-lg border border-amber/30 bg-amber/5 px-4 py-2 text-sm text-muted-foreground">
            Preview — this is how the post will appear to visitors when published
          </div>

          <article>
            {showCoverImage && (
              featuredImage ? (
                <div className="mb-8 aspect-[16/9] overflow-hidden rounded-xl">
                  {/* Preview only — intentionally using img over next/image (unknown dimensions) */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredImage}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="mb-8 aspect-[16/9] rounded-xl bg-gradient-to-br from-river-blue/20 via-sage/10 to-amber/10" />
              )
            )}

            <div className="mb-3 flex items-center gap-2">
              {selectedCategory && (
                <Badge variant="secondary">{selectedCategory.name}</Badge>
              )}
              {selectedCounty && (
                <span className="text-sm text-muted-foreground">
                  {selectedCounty.name} County
                </span>
              )}
            </div>

            <h1 className="mb-4 font-serif text-4xl font-bold leading-tight text-foreground">
              {title || (
                <span className="italic text-muted-foreground">Untitled post</span>
              )}
            </h1>

            {excerpt && (
              <p className="mb-8 text-lg text-muted-foreground">{excerpt}</p>
            )}

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: content || "<p><em>No content yet…</em></p>",
              }}
            />
          </article>
        </div>
      ) : (
        /* ── Editor mode ── */
        <div className="flex gap-6">
          {/* Main editor */}
          <div className="min-w-0 flex-1">
            <TiptapEditor
              content={content}
              onChange={(v) => { setContent(v); markDirty(); }}
            />
          </div>

          {/* Collapsible right sidebar */}
          {sidebarOpen && (
            <div className="w-72 flex-shrink-0 space-y-4 xl:w-80">
              {/* Title / Slug / Excerpt */}
              <div className="space-y-4 rounded-lg border bg-card p-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Post title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugEdited(true);
                      markDirty();
                    }}
                    placeholder="post-url-slug"
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => { setExcerpt(e.target.value); markDirty(); }}
                    placeholder="Brief summary of the post…"
                    rows={3}
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4 rounded-lg border bg-card p-4">
                <p className="text-sm font-semibold text-card-foreground">
                  Settings
                </p>

                <div className="space-y-2">
                  <Label>County</Label>
                  <Select value={countyId} onValueChange={(v) => { setCountyId(v); markDirty(); }}>
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); markDirty(); }}>
                    <SelectTrigger>
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
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={isFeatured}
                    onChange={(e) => { setIsFeatured(e.target.checked); markDirty(); }}
                    className="rounded"
                  />
                  <Label htmlFor="featured">Feature on homepage</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showCoverImage"
                    checked={showCoverImage}
                    onChange={(e) => { setShowCoverImage(e.target.checked); markDirty(); }}
                    className="rounded"
                  />
                  <Label htmlFor="showCoverImage">Show cover image</Label>
                </div>

                {/* Scheduled publish date — only for draft posts */}
                {status === "draft" && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="scheduledFor">Schedule Publish Date</Label>
                      <div className="flex gap-2">
                        <Input
                          id="scheduledFor"
                          type="date"
                          value={scheduledFor}
                          min={todayIso()}
                          onChange={(e) => {
                            setScheduledFor(e.target.value);
                            markDirty();
                          }}
                          className="flex-1"
                        />
                        {scheduledFor && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleClearSchedule}
                            title="Clear scheduled date"
                            className="shrink-0 text-muted-foreground hover:text-foreground"
                          >
                            <HugeiconsIcon icon={Cancel01Icon} size={14} />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {isScheduled
                          ? `Will publish automatically on ${formatScheduledDate(scheduledFor)}`
                          : "Leave blank to publish manually"}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Featured Image */}
              <div className="space-y-3 rounded-lg border bg-card p-4">
                <p className="text-sm font-semibold text-card-foreground">
                  Featured Image
                </p>
                <ImageUpload
                  value={featuredImage}
                  onChange={(v) => { setFeaturedImage(v); markDirty(); }}
                  folder="riverlands/posts"
                />
              </div>

              {/* SEO */}
              <div className="space-y-4 rounded-lg border bg-card p-4">
                <p className="text-sm font-semibold text-card-foreground">SEO</p>

                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={metaTitle}
                    onChange={(e) => { setMetaTitle(e.target.value); markDirty(); }}
                    placeholder="Custom meta title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => { setMetaDescription(e.target.value); markDirty(); }}
                    placeholder="Custom meta description"
                    rows={2}
                  />
                </div>
              </div>

              {/* Danger zone — only on saved posts */}
              {postId && (
                <div className="space-y-3 rounded-lg border border-destructive/30 bg-card p-4">
                  <p className="text-sm font-semibold text-destructive">
                    Danger Zone
                  </p>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={async () => {
                      if (
                        !confirm(
                          "Delete this post permanently? This cannot be undone."
                        )
                      )
                        return;
                      const res = await fetch(`/api/admin/posts/${postId}`, {
                        method: "DELETE",
                      });
                      if (res.ok) {
                        toast.success("Post deleted");
                        router.push("/admin/posts");
                      } else {
                        toast.error("Failed to delete post");
                      }
                    }}
                  >
                    Delete Post
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
