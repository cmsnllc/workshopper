import type { CSSProperties } from "react";

// 色は theme/tokens.json の code-* トークン。エディタと解説ページのコードブロックで揃える。
// サーバーでも読むファイルなので、CodeMirror はここから import しない (エディタ用は editor-theme.ts)
export const CODE_COLORS = {
  keyword: "var(--color-code-keyword)",
  function: "var(--color-code-function)",
  number: "var(--color-code-number)",
  string: "var(--color-code-string)",
  comment: "var(--color-ink-soft)",
  ink: "var(--color-ink)",
  card: "var(--color-card)",
};

const {
  keyword: KEYWORD,
  function: FUNCTION,
  number: NUMBER,
  string: STRING,
  comment: COMMENT,
  ink: INK,
} = CODE_COLORS;

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
