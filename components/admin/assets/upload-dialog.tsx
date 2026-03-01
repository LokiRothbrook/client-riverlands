"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Upload04Icon } from "@hugeicons/core-free-icons";

interface UploadDialogProps {
  onUploadComplete: () => void;
  folder?: string;
}

export function UploadDialog({
  onUploadComplete,
  folder = "riverlands",
}: UploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFiles = useCallback(
    async (files: FileList) => {
      setUploading(true);
      let successCount = 0;

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 10MB limit`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        try {
          const res = await fetch("/api/admin/media", {
            method: "POST",
            body: formData,
          });

          if (res.ok) {
            successCount++;
          } else {
            const json = await res.json();
            toast.error(`${file.name}: ${json.error || "Upload failed"}`);
          }
        } catch {
          toast.error(`${file.name}: Upload failed`);
        }
      }

      if (successCount > 0) {
        toast.success(
          `Uploaded ${successCount} image${successCount > 1 ? "s" : ""}`
        );
        onUploadComplete();
      }

      setUploading(false);
      setOpen(false);
    },
    [folder, onUploadComplete]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <HugeiconsIcon icon={Upload04Icon} size={16} />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
        </DialogHeader>

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
                : "Drop images here or click to browse"}
            </div>
            <div className="text-[10px] text-muted-foreground">
              Max 10MB per file
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileInput}
              disabled={uploading}
            />
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
}
