"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { UploadDialog } from "./upload-dialog";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  format: string | null;
  folder: string;
  alt_text: string | null;
  created_at: string;
  inUse: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AssetsGrid() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null);
  const [altText, setAltText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const perPage = 24;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        perPage: String(perPage),
      });
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await fetch(`/api/admin/media?${params}`);
      const json = await res.json();

      if (res.ok) {
        setItems(json.data);
        setTotal(json.total);
      } else {
        toast.error(json.error || "Failed to load media");
      }
    } catch {
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected image(s)?`)) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/admin/media/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [...selected] }),
      });

      if (res.ok) {
        toast.success(`Deleted ${selected.size} image(s)`);
        setSelected(new Set());
        fetchMedia();
      } else {
        const json = await res.json();
        toast.error(json.error || "Delete failed");
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  async function handleDeleteSingle(id: string) {
    if (!confirm("Delete this image?")) return;

    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Image deleted");
        setDetailItem(null);
        fetchMedia();
      } else {
        const json = await res.json();
        toast.error(json.error || "Delete failed");
      }
    } catch {
      toast.error("Delete failed");
    }
  }

  async function handleUpdateAlt(id: string) {
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ altText }),
      });

      if (res.ok) {
        toast.success("Alt text updated");
        fetchMedia();
        setDetailItem((prev) =>
          prev ? { ...prev, alt_text: altText } : null
        );
      } else {
        const json = await res.json();
        toast.error(json.error || "Update failed");
      }
    } catch {
      toast.error("Update failed");
    }
  }

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <UploadDialog onUploadComplete={fetchMedia} />

        {selected.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={deleting}
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
            Delete {selected.size} selected
          </Button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
          {debouncedSearch
            ? "No images matching your search"
            : "No images uploaded yet"}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative cursor-pointer overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
              onClick={() => {
                setDetailItem(item);
                setAltText(item.alt_text || "");
              }}
            >
              {/* Selection checkbox */}
              <button
                type="button"
                className="absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded border bg-background/80 transition-opacity group-hover:opacity-100"
                style={{
                  opacity: selected.has(item.id) ? 1 : undefined,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelect(item.id);
                }}
              >
                {selected.has(item.id) && (
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    size={14}
                    className="text-primary"
                  />
                )}
              </button>

              {/* Badges */}
              {item.inUse && (
                <Badge
                  variant="secondary"
                  className="absolute right-2 top-2 z-10 text-[10px]"
                >
                  In Use
                </Badge>
              )}

              {/* Thumbnail */}
              <div className="relative aspect-square">
                <Image
                  src={item.url}
                  alt={item.alt_text || item.filename}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>

              {/* Info */}
              <div className="p-2">
                <p className="truncate text-xs font-medium">{item.filename}</p>
                <p className="text-[10px] text-muted-foreground">
                  {item.width && item.height
                    ? `${item.width}x${item.height}`
                    : ""}
                  {item.size_bytes
                    ? ` · ${formatBytes(item.size_bytes)}`
                    : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={!!detailItem}
        onOpenChange={(open) => !open && setDetailItem(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="truncate">
              {detailItem?.filename}
            </DialogTitle>
          </DialogHeader>

          {detailItem && (
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-md">
                <Image
                  src={detailItem.url}
                  alt={detailItem.alt_text || detailItem.filename}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Dimensions:</span>{" "}
                  {detailItem.width}x{detailItem.height}
                </div>
                <div>
                  <span className="text-muted-foreground">Size:</span>{" "}
                  {detailItem.size_bytes
                    ? formatBytes(detailItem.size_bytes)
                    : "—"}
                </div>
                <div>
                  <span className="text-muted-foreground">Format:</span>{" "}
                  {detailItem.format || "—"}
                </div>
                <div>
                  <span className="text-muted-foreground">Uploaded:</span>{" "}
                  {new Date(detailItem.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="altText">Alt Text</Label>
                <div className="flex gap-2">
                  <Input
                    id="altText"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Describe this image..."
                  />
                  <Button
                    size="sm"
                    onClick={() => handleUpdateAlt(detailItem.id)}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => detailItem && handleDeleteSingle(detailItem.id)}
            >
              <HugeiconsIcon icon={Delete02Icon} size={16} />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
