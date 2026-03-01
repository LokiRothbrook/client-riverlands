"use client";

import { useState, useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EditorToolbar } from "./toolbar";
import { createSlashCommands } from "./slash-commands";
import {
  AssetPickerDialog,
  type AssetPickerResult,
} from "@/components/admin/assets/asset-picker-dialog";

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  enableImages?: boolean;
}

export function TiptapEditor({
  content = "",
  onChange,
  placeholder = "Start writing... (type / for commands)",
  enableImages = true,
}: TiptapEditorProps) {
  const [tab, setTab] = useState("write");
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
      Image,
      Placeholder.configure({ placeholder }),
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
        class:
          "prose prose-sm max-w-none min-h-[300px] p-4 focus:outline-none",
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
      document.removeEventListener(
        "tiptap:open-image-picker",
        handleOpenPicker
      );
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

  return (
    <div className="overflow-hidden rounded-md border">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between border-b bg-muted/30 px-2">
          <TabsList className="h-auto bg-transparent p-0">
            <TabsTrigger value="write" className="text-xs">
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="write" className="m-0">
          <EditorToolbar editor={editor} enableImages={enableImages} />
          <EditorContent editor={editor} />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div
            className="prose prose-lg max-w-none p-4"
            dangerouslySetInnerHTML={{
              __html: editor?.getHTML() || "<p>Nothing to preview</p>",
            }}
          />
        </TabsContent>
      </Tabs>

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
