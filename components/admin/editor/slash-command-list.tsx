"use client";

import {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";

export interface SlashCommandItem {
  title: string;
  description: string;
  command: (props: { editor: unknown; range: unknown }) => void;
}

export interface SlashCommandListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface SlashCommandListProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}

export const SlashCommandList = forwardRef<
  SlashCommandListRef,
  SlashCommandListProps
>(function SlashCommandList({ items, command }, ref) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const itemsKey = items.map((i) => i.title).join(",");

  // Reset selection index when filtered items change
  useEffect(() => {
    setSelectedIndex(0); // eslint-disable-line react-hooks/set-state-in-effect -- items is derived from typed query, reset is safe
  }, [itemsKey]);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (item) command(item);
    },
    [items, command]
  );

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex((i) => (i + items.length - 1) % items.length);
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelectedIndex((i) => (i + 1) % items.length);
        return true;
      }
      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  if (items.length === 0) return null;

  return (
    <div className="slash-command-list">
      {items.map((item, index) => (
        <button
          key={item.title}
          type="button"
          className={`slash-command-item ${
            index === selectedIndex ? "is-selected" : ""
          }`}
          onClick={() => selectItem(index)}
        >
          <span className="slash-command-title">{item.title}</span>
          <span className="slash-command-desc">{item.description}</span>
        </button>
      ))}
    </div>
  );
});
