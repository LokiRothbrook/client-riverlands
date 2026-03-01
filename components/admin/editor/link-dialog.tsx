"use client";

import { useState, useCallback } from "react";
import { type Editor } from "@tiptap/react";
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

interface LinkDialogProps {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LinkDialog({ editor, open, onOpenChange }: LinkDialogProps) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [newTab, setNewTab] = useState(true);

  const isEditing = editor.isActive("link");

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        // Initialize form state when dialog opens
        const attrs = editor.getAttributes("link");
        setUrl(attrs.href || "");
        setNewTab(attrs.target !== "_self");

        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, " ");
        setText(selectedText);
      }
      onOpenChange(nextOpen);
    },
    [editor, onOpenChange]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!url) {
      handleRemove();
      return;
    }

    const attrs = {
      href: url,
      target: newTab ? "_blank" : "_self",
      rel: newTab ? "noopener noreferrer" : null,
    };

    if (text && !editor.state.selection.empty) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink(attrs)
        .run();
    } else if (text) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${url}" target="${attrs.target}">${text}</a>`)
        .run();
    } else {
      editor.chain().focus().setLink(attrs).run();
    }

    onOpenChange(false);
  }

  function handleRemove() {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Link" : "Insert Link"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="linkUrl" className="text-xs">
              URL
            </Label>
            <Input
              id="linkUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="h-8 text-xs"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="linkText" className="text-xs">
              Display Text
            </Label>
            <Input
              id="linkText"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Link text"
              className="h-8 text-xs"
            />
          </div>

          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={newTab}
              onChange={(e) => setNewTab(e.target.checked)}
              className="rounded"
            />
            Open in new tab
          </label>

          <DialogFooter>
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
              >
                Remove Link
              </Button>
            )}
            <Button type="submit" size="sm">
              {isEditing ? "Update Link" : "Insert Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
