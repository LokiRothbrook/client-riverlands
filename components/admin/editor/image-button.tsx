"use client";

import { useState } from "react";
import { type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Image01Icon } from "@hugeicons/core-free-icons";
import {
  AssetPickerDialog,
  type AssetPickerResult,
} from "@/components/admin/assets/asset-picker-dialog";

interface ImageButtonProps {
  editor: Editor;
  className?: string;
}

export function ImageButton({ editor, className }: ImageButtonProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  function handleSelect(result: AssetPickerResult) {
    editor
      .chain()
      .focus()
      .setImage({
        src: result.url,
        alt: result.alt,
        ...(result.width ? { width: result.width } : {}),
      })
      .run();
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("h-8 w-8 p-0", className)}
        onClick={() => setPickerOpen(true)}
        title="Insert Image"
      >
        <HugeiconsIcon icon={Image01Icon} size={16} />
      </Button>

      <AssetPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleSelect}
      />
    </>
  );
}
