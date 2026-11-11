import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import { CODE_COLORS } from "./code-theme";

const {
  keyword: KEYWORD,
  function: FUNCTION,
  number: NUMBER,
  string: STRING,
  comment: COMMENT,
  ink: INK,
  card: CARD,
} = CODE_COLORS;

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
