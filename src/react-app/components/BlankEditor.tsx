import { SyntaxHighlighter } from "../lib/syntax-highlighter";
import type { Segment } from "../lib/blanks";
import { codeBlockStyle } from "../lib/code-theme";

interface BlankEditorProps {
  segments: Segment[];
  values: string[];
  /** 空の箱を目立たせて、うめるように促す */
  showMissing: boolean;
  onChange: (index: number, value: string) => void;
  onSubmit: () => void;
}

const MIN_BOX_SIZE = 4;

const INLINE_CODE_STYLE: React.CSSProperties = {
  margin: 0,
  padding: 0,
  background: "transparent",
};

const BOX_CLASS =
  "mx-0.5 h-9 rounded-wobbly border-2 border-ink px-1 text-center font-mono text-code leading-none";

export function BlankEditor({
  segments,
  values,
  showMissing,
  onChange,
  onSubmit,
}: BlankEditorProps) {
  const isMissing = (index: number): boolean => showMissing && (values[index] ?? "").trim() === "";

  return (
    <div className="h-full overflow-auto bg-card px-6 py-5">
      <div className="font-mono text-code whitespace-pre">
        {segments.map((segment, position) =>
          segment.kind === "text" ? (
            <SyntaxHighlighter
              key={position}
              language="javascript"
              style={codeBlockStyle}
              customStyle={INLINE_CODE_STYLE}
              PreTag="span"
              CodeTag="span"
            >
              {segment.text}
            </SyntaxHighlighter>
          ) : (
            <input
              key={position}
              type="text"
              autoComplete="off"
              spellCheck={false}
              aria-label={`${segment.index + 1}番目の箱`}
              aria-invalid={isMissing(segment.index)}
              size={Math.max(segment.answer.length, MIN_BOX_SIZE)}
              value={values[segment.index] ?? ""}
              onChange={(e) => onChange(segment.index, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSubmit();
              }}
              className={`${BOX_CLASS} ${
                isMissing(segment.index) ? "border-dashed bg-coral-wash" : "bg-paper"
              }`}
            />
          ),
        )}
      </div>
      {showMissing && (
        <p role="status" className="mt-5 text-small font-bold">
          箱をぜんぶうめてから、実行をおしてね。
        </p>
      )}
    </div>
  );
}
