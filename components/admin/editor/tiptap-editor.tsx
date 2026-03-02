"use client";

import { useState, useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { Button } from "@/components/ui/button";
import { EditorToolbar } from "./toolbar";
import { createSlashCommands } from "./slash-commands";
import {
  AssetPickerDialog,
  type AssetPickerResult,
} from "@/components/admin/assets/asset-picker-dialog";

// Extended Image node that supports a style attribute for resizing/alignment
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (el) => el.getAttribute("style") || null,
        renderHTML: (attrs: { style: string | null }) =>
          attrs.style ? { style: attrs.style } : {},
      },
    };
  },
});

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  enableImages?: boolean;
}

const IMAGE_SIZES = [
  { label: "25%", style: "width: 25%" },
  { label: "50%", style: "width: 50%" },
  { label: "75%", style: "width: 75%" },
  { label: "100%", style: "width: 100%" },
];

const IMAGE_ALIGNS = [
  { label: "Left", style: "display: block; margin-right: auto; margin-left: 0" },
  { label: "Center", style: "display: block; margin-left: auto; margin-right: auto" },
  { label: "Right", style: "display: block; margin-left: auto; margin-right: 0" },
];

export function TiptapEditor({
  content = "",
  onChange,
  placeholder = "Start writing… (type / for commands)",
  enableImages = true,
}: TiptapEditorProps) {
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  const slashCommands = useMemo(
    () => createSlashCommands(enableImages),
    [enableImages]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      ResizableImage,
      Placeholder.configure({ placeholder }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
        defaultAlignment: "left",
      }),
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      slashCommands,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none p-4 focus:outline-none min-h-[300px]",
      },
    },
  });

  // Listen for slash command image picker event
  useEffect(() => {
    if (!enableImages) return;

    function handleOpenPicker() {
      setImagePickerOpen(true);
    }

    document.addEventListener("tiptap:open-image-picker", handleOpenPicker);
    return () => {
      document.removeEventListener("tiptap:open-image-picker", handleOpenPicker);
    };
  }, [enableImages]);

  function handleImageSelect(result: AssetPickerResult) {
    if (!editor) return;
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

  function setImageStyle(extra: string) {
    if (!editor) return;
    const current = editor.getAttributes("image").style as string | null;
    // Merge extra into current style (override matching props)
    const base = (current || "")
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => {
        const prop = s.split(":")[0].trim();
        return !extra.split(";").some((e) => e.split(":")[0].trim() === prop);
      });
    const merged = [...base, ...extra.split(";").map((s) => s.trim()).filter(Boolean)].join("; ");
    editor.chain().focus().updateAttributes("image", { style: merged }).run();
  }

  return (
    <div className="overflow-hidden rounded-md border">
      {/* Toolbar — always visible, never hides */}
      <EditorToolbar editor={editor} enableImages={enableImages} />

      {/* Scrollable editor content area */}
      <div className="max-h-[600px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {/* Image resize / alignment bubble menu */}
      {editor && enableImages && (
        <BubbleMenu
          editor={editor}
          shouldShow={({ editor: e }) => e.isActive("image")}
          options={{ placement: "top", offset: 8 }}
        >
          <div className="flex items-center gap-1 rounded-lg border bg-background p-1 shadow-lg">
            <span className="px-1 text-xs text-muted-foreground">Size:</span>
            {IMAGE_SIZES.map(({ label, style }) => (
              <Button
                key={label}
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setImageStyle(style)}
              >
                {label}
              </Button>
            ))}
            <div className="mx-0.5 h-5 w-px bg-border" />
            <span className="px-1 text-xs text-muted-foreground">Align:</span>
            {IMAGE_ALIGNS.map(({ label, style }) => (
              <Button
                key={label}
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setImageStyle(style)}
              >
                {label}
              </Button>
            ))}
          </div>
        </BubbleMenu>
      )}

      {enableImages && (
        <AssetPickerDialog
          open={imagePickerOpen}
          onOpenChange={setImagePickerOpen}
          onSelect={handleImageSelect}
        />
      )}
    </div>
  );
}
