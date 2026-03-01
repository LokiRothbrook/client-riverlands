"use client";

import { type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const buttonClass = "h-8 px-2 text-xs";

  return (
    <div className="flex flex-wrap gap-1 border-b p-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(buttonClass, editor.isActive("bold") && "bg-secondary")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <strong>B</strong>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          buttonClass,
          editor.isActive("italic") && "bg-secondary"
        )}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <em>I</em>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          buttonClass,
          editor.isActive("underline") && "bg-secondary"
        )}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
      >
        <u>U</u>
      </Button>

      <div className="mx-1 w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          buttonClass,
          editor.isActive("heading", { level: 2 }) && "bg-secondary"
        )}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
      >
        H2
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          buttonClass,
          editor.isActive("heading", { level: 3 }) && "bg-secondary"
        )}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Heading 3"
      >
        H3
      </Button>

      <div className="mx-1 w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          buttonClass,
          editor.isActive("bulletList") && "bg-secondary"
        )}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
      >
        &bull;
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          buttonClass,
          editor.isActive("orderedList") && "bg-secondary"
        )}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Ordered List"
      >
        1.
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          buttonClass,
          editor.isActive("blockquote") && "bg-secondary"
        )}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Blockquote"
      >
        &ldquo;
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={buttonClass}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        ―
      </Button>

      <div className="mx-1 w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          buttonClass,
          editor.isActive("link") && "bg-secondary"
        )}
        onClick={() => {
          const url = window.prompt("Enter URL:");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          } else {
            editor.chain().focus().unsetLink().run();
          }
        }}
        title="Link"
      >
        🔗
      </Button>

      <div className="ml-auto flex gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={buttonClass}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          ↩
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={buttonClass}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          ↪
        </Button>
      </div>
    </div>
  );
}
