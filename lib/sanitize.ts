import sanitizeHtml from "sanitize-html";

/**
 * Sanitize HTML content for safe rendering in the browser.
 * Allows common formatting tags and removes potentially dangerous content.
 */
export function sanitizeContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "hr",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "a",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "strike",
      "sub",
      "sup",
      "img",
      "figure",
      "figcaption",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "div",
      "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading", "style"],
      p: ["style"],
      h1: ["style"],
      h2: ["style"],
      h3: ["style"],
      h4: ["style"],
      h5: ["style"],
      h6: ["style"],
      "*": ["class", "id"],
    },
    allowedStyles: {
      // Images: width percentages/px and block alignment via margins
      img: {
        width: [/^\d+(?:\.\d+)?(?:%|px)$/],
        display: [/^block$/, /^inline$/, /^inline-block$/],
        "margin-left": [/^auto$/, /^\d+(?:\.\d+)?(?:px|em|rem|%)$/],
        "margin-right": [/^auto$/, /^\d+(?:\.\d+)?(?:px|em|rem|%)$/],
      },
      // Headings and paragraphs: text alignment (set by TipTap TextAlign extension)
      p: { "text-align": [/^left$/, /^center$/, /^right$/] },
      h1: { "text-align": [/^left$/, /^center$/, /^right$/] },
      h2: { "text-align": [/^left$/, /^center$/, /^right$/] },
      h3: { "text-align": [/^left$/, /^center$/, /^right$/] },
      h4: { "text-align": [/^left$/, /^center$/, /^right$/] },
      h5: { "text-align": [/^left$/, /^center$/, /^right$/] },
      h6: { "text-align": [/^left$/, /^center$/, /^right$/] },
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: "noopener noreferrer",
          target: attribs.target || "_blank",
        },
      }),
    },
  });
}

/**
 * Escape HTML entities for safe display in HTML context.
 * Use this for user-provided text that should be displayed as-is (not rendered as HTML).
 */
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}
