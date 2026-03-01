"use client";

import { useState } from "react";
import { type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  Heading02Icon,
  Heading03Icon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  QuoteDownIcon,
  MinusSignIcon,
  Link01Icon,
  ArrowTurnBackwardIcon,
  ArrowTurnForwardIcon,
} from "@hugeicons/core-free-icons";
import { LinkDialog } from "./link-dialog";
import { ImageButton } from "./image-button";
import { TableControls } from "./table-controls";

interface ToolbarProps {
  editor: Editor | null;
  enableImages?: boolean;
}

export function EditorToolbar({ editor, enableImages = true }: ToolbarProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  if (!editor) return null;

  const btnClass = "h-8 w-8 p-0";

  return (
    <>
      <div className="flex flex-wrap items-center gap-0.5 border-b p-1.5">
        {/* Text formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(btnClass, editor.isActive("bold") && "bg-secondary")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <HugeiconsIcon icon={TextBoldIcon} size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(btnClass, editor.isActive("italic") && "bg-secondary")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <HugeiconsIcon icon={TextItalicIcon} size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            btnClass,
            editor.isActive("underline") && "bg-secondary"
          )}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          <HugeiconsIcon icon={TextUnderlineIcon} size={16} />
        </Button>

        <div className="mx-0.5 h-6 w-px bg-border" />

        {/* Headings */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            btnClass,
            editor.isActive("heading", { level: 2 }) && "bg-secondary"
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          <HugeiconsIcon icon={Heading02Icon} size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            btnClass,
            editor.isActive("heading", { level: 3 }) && "bg-secondary"
          )}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="Heading 3"
        >
          <HugeiconsIcon icon={Heading03Icon} size={16} />
        </Button>

        <div className="mx-0.5 h-6 w-px bg-border" />

        {/* Lists & blocks */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            btnClass,
            editor.isActive("bulletList") && "bg-secondary"
          )}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <HugeiconsIcon icon={LeftToRightListBulletIcon} size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            btnClass,
            editor.isActive("orderedList") && "bg-secondary"
          )}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Ordered List"
        >
          <HugeiconsIcon icon={LeftToRightListNumberIcon} size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            btnClass,
            editor.isActive("blockquote") && "bg-secondary"
          )}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        >
          <HugeiconsIcon icon={QuoteDownIcon} size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={btnClass}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <HugeiconsIcon icon={MinusSignIcon} size={16} />
        </Button>

        <div className="mx-0.5 h-6 w-px bg-border" />

        {/* Link */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(btnClass, editor.isActive("link") && "bg-secondary")}
          onClick={() => setLinkDialogOpen(true)}
          title="Link"
        >
          <HugeiconsIcon icon={Link01Icon} size={16} />
        </Button>

        {/* Image */}
        {enableImages && <ImageButton editor={editor} />}

        {/* Table */}
        <TableControls editor={editor} />

        {/* Undo/Redo */}
        <div className="ml-auto flex gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={btnClass}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <HugeiconsIcon icon={ArrowTurnBackwardIcon} size={16} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={btnClass}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <HugeiconsIcon icon={ArrowTurnForwardIcon} size={16} />
          </Button>
        </div>
      </div>

      <LinkDialog
        editor={editor}
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
      />
    </>
  );
}
