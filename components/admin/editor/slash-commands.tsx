/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Extension, ReactRenderer } from "@tiptap/react";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import {
  SlashCommandList,
  type SlashCommandItem,
  type SlashCommandListRef,
} from "./slash-command-list";

function getSuggestionItems(
  enableImages: boolean
): (props: { query: string }) => SlashCommandItem[] {
  return ({ query }) => {
    const items: SlashCommandItem[] = [
      {
        title: "Heading 2",
        description: "Medium section heading",
        command: ({ editor, range }) => {
          (editor as any).chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
        },
      },
      {
        title: "Heading 3",
        description: "Small section heading",
        command: ({ editor, range }) => {
          (editor as any).chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
        },
      },
      {
        title: "Bullet List",
        description: "Unordered list of items",
        command: ({ editor, range }) => {
          (editor as any).chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: "Ordered List",
        description: "Numbered list of items",
        command: ({ editor, range }) => {
          (editor as any).chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        title: "Blockquote",
        description: "Highlight a quote",
        command: ({ editor, range }) => {
          (editor as any).chain().focus().deleteRange(range).toggleBlockquote().run();
        },
      },
      {
        title: "Horizontal Rule",
        description: "Visual divider",
        command: ({ editor, range }) => {
          (editor as any).chain().focus().deleteRange(range).setHorizontalRule().run();
        },
      },
      {
        title: "Table",
        description: "Insert a 3x3 table",
        command: ({ editor, range }) => {
          (editor as any).chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        },
      },
    ];

    if (enableImages) {
      items.splice(6, 0, {
        title: "Image",
        description: "Insert an image from the library",
        command: ({ editor, range }) => {
          (editor as any).chain().focus().deleteRange(range).run();
          document.dispatchEvent(new CustomEvent("tiptap:open-image-picker"));
        },
      });
    }

    if (!query) return items;

    return items.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  };
}

function renderSuggestion() {
  let component: ReactRenderer<SlashCommandListRef> | null = null;
  let popup: TippyInstance[] | null = null;

  return {
    onStart: (props: any) => {
      component = new ReactRenderer(SlashCommandList, {
        props,
        editor: props.editor,
      });

      if (!props.clientRect) return;

      popup = tippy("body", {
        getReferenceClientRect: props.clientRect as () => DOMRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },

    onUpdate(props: any) {
      component?.updateProps(props);

      if (!props.clientRect) return;

      popup?.[0]?.setProps({
        getReferenceClientRect: props.clientRect as () => DOMRect,
      });
    },

    onKeyDown(props: { event: KeyboardEvent }) {
      if (props.event.key === "Escape") {
        popup?.[0]?.hide();
        return true;
      }

      return component?.ref?.onKeyDown(props) ?? false;
    },

    onExit() {
      popup?.[0]?.destroy();
      component?.destroy();
    },
  };
}

export function createSlashCommands(enableImages: boolean) {
  return Extension.create({
    name: "slashCommands",

    addOptions() {
      return {
        suggestion: {
          char: "/",
          command: ({
            editor,
            range,
            props,
          }: {
            editor: unknown;
            range: unknown;
            props: SlashCommandItem;
          }) => {
            props.command({ editor, range });
          },
          items: getSuggestionItems(enableImages),
          render: renderSuggestion,
        } as Partial<SuggestionOptions<SlashCommandItem>>,
      };
    },

    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          ...this.options.suggestion,
        }),
      ];
    },
  });
}
