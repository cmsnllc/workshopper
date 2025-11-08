import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubLight } from "@uiw/codemirror-theme-github";
import { FaPlay, FaStop } from "react-icons/fa";
import { Preview } from "./components/Preview";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  circle(200, 200, 100);
}`);
  const [isRunning, setIsRunning] = useState(false);
  const [runningCode, setRunningCode] = useState("");

  const handleToggle = () => {
    if (isRunning) {
      // 停止時はrunningCodeはそのまま保持
      setIsRunning(false);
    } else {
      // 実行時は最新のコードで更新
      setRunningCode(code);
      setIsRunning(true);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header style={{ padding: "10px 20px", borderBottom: "1px solid #ccc" }}>
        <h1 style={{ margin: 0, fontSize: "1.5em" }}>p5.js Workshop</h1>
      </header>
      <div
        style={{
          padding: "10px 20px",
          borderBottom: "1px solid #ccc",
          display: "flex",
          gap: "10px",
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
  );
}

export default App;
