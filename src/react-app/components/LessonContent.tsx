import { useEffect, useRef, Children } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import type { Lesson } from "../lessons/types";
import { CATEGORY_LABELS } from "../lessons/labels";
import { codeBlockStyle } from "../lib/code-theme";
import { ExerciseButton } from "./ExerciseButton";

interface LessonContentProps {
  lesson: Lesson;
  onStartExercise: (exerciseId: string) => void;
}

interface CodeComponentProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

interface PassThroughProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

const CODE_BLOCK_STYLE: React.CSSProperties = {
  margin: 0,
  padding: "26px 24px 20px",
  background: "transparent",
  fontSize: "var(--text-code)",
  lineHeight: "var(--text-code--line-height)",
  overflowX: "auto",
};

const CELL_CLASS = "border-2 border-ink px-4 py-3 text-center";

const LANGUAGE_PREFIX = "language-";

const stripTrailingNewline = (text: string): string =>
  text.endsWith("\n") ? text.slice(0, -1) : text;

const childrenToText = (children: React.ReactNode): string =>
  stripTrailingNewline(
    Children.toArray(children)
      .map((child) => (typeof child === "string" || typeof child === "number" ? String(child) : ""))
      .join(""),
  );

// MDX はコードブロックの <code> に "language-javascript" のようなクラスを付ける。インラインコードには付かない
const languageOf = (className: string | undefined): string | undefined =>
  className
    ?.split(" ")
    .find((name) => name.startsWith(LANGUAGE_PREFIX))
    ?.slice(LANGUAGE_PREFIX.length);

const CodeComponent = ({ className, children, ...props }: CodeComponentProps) => {
  const language = languageOf(className);
  return language ? (
    <div className="relative my-6 rounded-wobbly-lg border-2 border-ink bg-card shadow-offset">
      <span aria-hidden="true" className="tape" />
      <SyntaxHighlighter
        style={codeBlockStyle}
        customStyle={CODE_BLOCK_STYLE}
        language={language}
        PreTag="div"
        {...props}
      >
        {childrenToText(children)}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className="rounded-md bg-paper-deep px-1.5 py-0.5 font-mono text-[0.9em]" {...props}>
      {children}
    </code>
  );
};

// コードブロックの枠は CodeComponent が描くので、MDX が付ける <pre> は外す
const PreComponent = ({ children }: PassThroughProps) => <>{children}</>;

const TableComponent = ({ children, ...props }: PassThroughProps) => (
  <table className="my-5 min-w-[300px] border-collapse bg-card" {...props}>
    {children}
  </table>
);

const ThComponent = ({ children, ...props }: PassThroughProps) => (
  <th className={`${CELL_CLASS} bg-accent font-bold first:bg-card`} {...props}>
    {children}
  </th>
);

const TdComponent = ({ children, ...props }: PassThroughProps) => {
  // strong を含むセルは行見出し (真理値表の最初の列)
  const isRowHeader = Children.toArray(children).some(
    (child) =>
      typeof child === "object" && child !== null && "type" in child && child.type === "strong",
  );

  return (
    <td className={`${CELL_CLASS} ${isRowHeader ? "bg-accent font-bold" : "bg-card"}`} {...props}>
      {children}
    </td>
  );
};

export function LessonContent({ lesson, onStartExercise }: LessonContentProps) {
  const { Content, meta } = lesson;
  const scrollRef = useRef<HTMLDivElement>(null);

  // レッスンが変わったらスクロール位置を一番上にリセット
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [lesson.meta.id]);

  const ExerciseComponent = ({ id }: { id?: string }) => {
    if (!id) return null;
    const exercise = meta.exercises?.find((ex) => ex.id === id);
    if (!exercise) return null;
    return <ExerciseButton label={exercise.label} onClick={() => onStartExercise(id)} />;
  };

  const mdxComponents: Record<string, React.ComponentType<unknown>> = {
    code: CodeComponent as React.ComponentType<unknown>,
    pre: PreComponent as React.ComponentType<unknown>,
    Exercise: ExerciseComponent as React.ComponentType<unknown>,
    table: TableComponent as React.ComponentType<unknown>,
    th: ThComponent as React.ComponentType<unknown>,
    td: TdComponent as React.ComponentType<unknown>,
  };

  return (
    <div ref={scrollRef} className="bg-dots h-full overflow-y-auto px-8 pt-10 pb-28">
      <article className="mx-auto max-w-[720px]">
        <span className="inline-block rounded-wobbly border-2 border-ink bg-card px-3 py-0.5 text-label">
          {CATEGORY_LABELS[meta.category]}
        </span>
        <h1 className="mt-4 text-title">
          <span className="marker">{meta.title}</span>
        </h1>
        {meta.description && <p className="mt-3 text-ink-soft">{meta.description}</p>}

        <div className="lesson-content mt-8">
          <Content components={mdxComponents} />
        </div>
      </article>
    </div>
  );
}
