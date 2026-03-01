"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Upload04Icon, Tick02Icon } from "@hugeicons/core-free-icons";

export interface AssetPickerResult {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
}

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  width: number | null;
  height: number | null;
  alt_text: string | null;
}

interface AssetPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (result: AssetPickerResult) => void;
}

export function AssetPickerDialog({
  open,
  onOpenChange,
  onSelect,
}: AssetPickerDialogProps) {
  const [tab, setTab] = useState("library");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ perPage: "48" });
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await fetch(`/api/admin/media?${params}`);
      const json = await res.json();

      if (res.ok) {
        setItems(json.data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (open) {
      fetchMedia();
      setSelectedItem(null);
      setAltText("");
    }
  }, [open, fetchMedia]);

  async function handleUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "riverlands");

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (res.ok) {
        toast.success("Image uploaded");
        const newItem: MediaItem = {
          id: json.id,
          url: json.url,
          filename: json.filename,
          width: json.width,
          height: json.height,
          alt_text: null,
        };
        setSelectedItem(newItem);
        setTab("library");
        fetchMedia();
      } else {
        toast.error(json.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }

  function handleInsert() {
    if (!selectedItem) return;
    onSelect({
      url: selectedItem.url,
      alt: altText || selectedItem.alt_text || "",
      width: selectedItem.width,
      height: selectedItem.height,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Image</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex-1 min-h-0">
          <TabsList>
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="flex-1 min-h-0 space-y-3">
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search images..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>

            <div className="overflow-y-auto max-h-[40vh] rounded-md border p-2">
              {loading ? (
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square animate-pulse rounded bg-muted"
                    />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  No images found
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`relative aspect-square overflow-hidden rounded border-2 transition-colors ${
                        selectedItem?.id === item.id
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent hover:border-border"
                      }`}
                      onClick={() => {
                        setSelectedItem(item);
                        setAltText(item.alt_text || "");
                      }}
                    >
                      <Image
                        src={item.url}
                        alt={item.alt_text || item.filename}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                      {selectedItem?.id === item.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                          <HugeiconsIcon
                            icon={Tick02Icon}
                            size={24}
                            className="text-primary"
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-3">
            <div
              className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-border"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <label className="flex cursor-pointer flex-col items-center gap-3">
                <HugeiconsIcon
                  icon={Upload04Icon}
                  size={32}
                  className="text-muted-foreground"
                />
                <div className="text-sm text-muted-foreground">
                  {uploading
                    ? "Uploading..."
                    : "Drop an image here or click to browse"}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                  disabled={uploading}
                />
              </label>
            </div>
          </TabsContent>
        </Tabs>

        {/* Alt text input */}
        <div className="space-y-1.5">
          <Label htmlFor="pickerAlt" className="text-xs">
            Alt Text
          </Label>
          <Input
            id="pickerAlt"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe this image for accessibility..."
            className="h-8 text-xs"
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleInsert}
            disabled={!selectedItem}
            size="sm"
          >
            Insert Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
