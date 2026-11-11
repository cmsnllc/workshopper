import type { CSSProperties } from "react";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

// 色は theme/tokens.json の code-* トークン。エディタと解説ページのコードブロックで揃える
const KEYWORD = "var(--color-code-keyword)";
const FUNCTION = "var(--color-code-function)";
const NUMBER = "var(--color-code-number)";
const STRING = "var(--color-code-string)";
const COMMENT = "var(--color-ink-soft)";
const INK = "var(--color-ink)";
const CARD = "var(--color-card)";

/** CodeMirror 用 */
export const editorTheme = createTheme({
  theme: "light",
  settings: {
    background: CARD,
    foreground: INK,
    caret: INK,
    selection: "color-mix(in srgb, var(--color-accent) 45%, transparent)",
    selectionMatch: "color-mix(in srgb, var(--color-accent) 25%, transparent)",
    lineHighlight: "color-mix(in srgb, var(--color-dot) 35%, transparent)",
    gutterBackground: CARD,
    gutterForeground: COMMENT,
    gutterActiveForeground: INK,
    gutterBorder: "transparent",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-code)",
  },
  styles: [
    {
      tag: [t.keyword, t.definitionKeyword, t.controlKeyword, t.operatorKeyword],
      color: KEYWORD,
      fontWeight: "600",
    },
    {
      tag: [t.function(t.variableName), t.function(t.definition(t.variableName))],
      color: FUNCTION,
    },
    { tag: [t.number, t.bool, t.null], color: NUMBER },
    { tag: [t.string, t.special(t.string), t.regexp], color: STRING },
    { tag: [t.comment, t.lineComment, t.blockComment], color: COMMENT, fontStyle: "italic" },
  ],
});

/** react-syntax-highlighter (Prism) 用 */
export const codeBlockStyle: Record<string, CSSProperties> = {
  'code[class*="language-"]': { color: INK, fontFamily: "var(--font-mono)" },
  'pre[class*="language-"]': { color: INK, fontFamily: "var(--font-mono)" },
  keyword: { color: KEYWORD, fontWeight: 600 },
  function: { color: FUNCTION },
  number: { color: NUMBER },
  boolean: { color: NUMBER },
  string: { color: STRING },
  "template-string": { color: STRING },
  comment: { color: COMMENT, fontStyle: "italic" },
};
