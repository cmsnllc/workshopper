import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Lesson } from "../lessons/types";
import { ExerciseButton } from "./ExerciseButton";

interface LessonContentProps {
  lesson: Lesson;
  onStartCoding: () => void;
  onStartExercise: (exerciseId: string) => void;
}

interface CodeComponentProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function LessonContent({
  lesson,
  onStartCoding,
  onStartExercise,
}: LessonContentProps) {
  const { Content, meta } = lesson;

  const CodeComponent = ({ className, children, ...props }: CodeComponentProps) => {
    const match = /language-(\w+)/.exec(className || "");
    return match ? (
      <SyntaxHighlighter
        style={prism}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  const ExerciseComponent = ({ id }: { id?: string }) => {
    if (!id) return null;
    const exercise = meta.exercises?.find((ex) => ex.id === id);
    if (!exercise) return null;
    return (
      <ExerciseButton
        label={exercise.label}
        onClick={() => onStartExercise(id)}
      />
    );
  };

  const mdxComponents: Record<string, React.ComponentType<unknown>> = {
    code: CodeComponent as React.ComponentType<unknown>,
    Exercise: ExerciseComponent as React.ComponentType<unknown>,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "40px",
          paddingBottom: "120px", // ボタン分の余白を確保
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ marginBottom: "8px" }}>{meta.title}</h1>
          <p style={{ color: "#666", marginBottom: "32px" }}>
            {meta.description}
          </p>

          <div
            style={{
              lineHeight: 1.6,
              fontSize: "16px",
            }}
            className="lesson-content"
          >
            <Content components={mdxComponents} />
          </div>

          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <button
              onClick={onStartCoding}
              style={{
                padding: "12px 32px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0056b3";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#007bff";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }}
            >
              コードを書いてみる →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
