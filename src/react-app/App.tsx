import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubLight } from "@uiw/codemirror-theme-github";
import { FaPlay, FaStop } from "react-icons/fa";
import { Preview } from "./components/Preview";
import { LessonList } from "./components/LessonList";
import { lessons } from "./lessons";
import "./App.css";

function App() {
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    lessons[0]?.meta.id || null
  );
  const [code, setCode] = useState(
    lessons[0]?.meta.initialCode || ""
  );
  const [isRunning, setIsRunning] = useState(false);
  const [runningCode, setRunningCode] = useState("");

  const selectedLesson = lessons.find((l) => l.meta.id === selectedLessonId);

  const handleSelectLesson = (lessonId: string) => {
    const lesson = lessons.find((l) => l.meta.id === lessonId);
    if (lesson) {
      setSelectedLessonId(lessonId);
      setCode(lesson.meta.initialCode);
      setIsRunning(false);
      setRunningCode("");
    }
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
            {selectedLesson && (
              <div style={{ fontSize: "0.9em", color: "#666" }}>
                {selectedLesson.meta.title}
              </div>
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
      </div>
    </div>
  );
}

export default App;
