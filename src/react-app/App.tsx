import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubLight } from "@uiw/codemirror-theme-github";
import { FaPlay, FaStop } from "react-icons/fa";
import { Preview } from "./components/Preview";
import { LessonList } from "./components/LessonList";
import { LessonContent } from "./components/LessonContent";
import { lessons } from "./lessons";
import "./App.css";

type LessonStep = "description" | "coding";

function App() {
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    lessons[0]?.meta.id || null
  );
  const [lessonStep, setLessonStep] = useState<LessonStep>("description");
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(
    null
  );
  const [code, setCode] = useState(lessons[0]?.meta.initialCode || "");
  const [isRunning, setIsRunning] = useState(false);
  const [runningCode, setRunningCode] = useState("");

  const selectedLesson = lessons.find((l) => l.meta.id === selectedLessonId);

  const handleSelectLesson = (lessonId: string) => {
    const lesson = lessons.find((l) => l.meta.id === lessonId);
    if (lesson) {
      setSelectedLessonId(lessonId);
      setLessonStep("description"); // 新しいレッスンを選んだら説明から始める
      setCode(lesson.meta.initialCode);
      setIsRunning(false);
      setRunningCode("");
    }
  };

  const handleStartCoding = () => {
    setCurrentExerciseId(null);
    setLessonStep("coding");
  };

  const handleStartExercise = (exerciseId: string) => {
    if (!selectedLesson) return;
    const exercise = selectedLesson.meta.exercises?.find(
      (ex) => ex.id === exerciseId
    );
    if (exercise) {
      setCurrentExerciseId(exerciseId);
      setCode(exercise.initialCode);
      setLessonStep("coding");
      setIsRunning(false);
      setRunningCode("");
    }
  };

  const handleBackToDescription = () => {
    setCurrentExerciseId(null);
    setLessonStep("description");
  };

  const handleNextLesson = () => {
    if (!selectedLessonId) return;
    const currentIndex = lessons.findIndex((l) => l.meta.id === selectedLessonId);
    if (currentIndex >= 0 && currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      handleSelectLesson(nextLesson.meta.id);
    }
  };

  const hasNextLesson = () => {
    if (!selectedLessonId) return false;
    const currentIndex = lessons.findIndex((l) => l.meta.id === selectedLessonId);
    return currentIndex >= 0 && currentIndex < lessons.length - 1;
  };

  const handleToggle = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setRunningCode(code);
      setIsRunning(true);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header style={{ padding: "10px 20px", borderBottom: "1px solid #ccc" }}>
        <h1 style={{ margin: 0, fontSize: "1.5em" }}>p5.js Workshop</h1>
      </header>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <LessonList
          lessons={lessons}
          selectedLessonId={selectedLessonId}
          onSelectLesson={handleSelectLesson}
        />

        {/* 説明ステップ */}
        {lessonStep === "description" && selectedLesson && (
          <div style={{ flex: 1, overflow: "hidden" }}>
            <LessonContent
              lesson={selectedLesson}
              onStartCoding={handleStartCoding}
              onStartExercise={handleStartExercise}
            />
          </div>
        )}

        {/* コーディングステップ */}
        {lessonStep === "coding" && selectedLesson && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "10px 20px",
                borderBottom: "1px solid #ccc",
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <button
                onClick={handleToggle}
                style={{
                  padding: "8px 16px",
                  backgroundColor: isRunning ? "#f44336" : "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {isRunning ? <FaStop /> : <FaPlay />}
                {isRunning ? "停止" : "実行"}
              </button>
              <div style={{ fontSize: "0.9em", color: "#666" }}>
                {selectedLesson.meta.title}
              </div>
              <button
                onClick={handleBackToDescription}
                style={{
                  marginLeft: "auto",
                  padding: "6px 12px",
                  backgroundColor: "transparent",
                  color: "#007bff",
                  border: "1px solid #007bff",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.9em",
                }}
              >
                説明を見る
              </button>
              {hasNextLesson() && (
                <button
                  onClick={handleNextLesson}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.9em",
                    fontWeight: "bold",
                  }}
                >
                  次のレッスンへ
                </button>
              )}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0",
                flex: 1,
                overflow: "hidden",
              }}
            >
              <div style={{ borderRight: "1px solid #ccc", overflow: "hidden" }}>
                <CodeMirror
                  value={code}
                  height="100%"
                  theme={githubLight}
                  extensions={[javascript()]}
                  onChange={(value) => setCode(value)}
                  editable={!isRunning}
                />
              </div>
              <Preview
                code={runningCode}
                isRunning={isRunning}
                onStop={() => setIsRunning(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
