import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Lesson } from "../lessons/types";
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

export function LessonContent({
  lesson,
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
        </div>
      </div>
    </div>
  );
}
