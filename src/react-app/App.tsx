import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubLight } from "@uiw/codemirror-theme-github";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  circle(200, 200, 100);
}`);

  return (
    <div style={{ padding: "20px" }}>
      <h1>p5.js Workshop</h1>
      <div style={{ border: "1px solid #ccc", marginTop: "20px" }}>
        <CodeMirror
          value={code}
          height="400px"
          theme={githubLight}
          extensions={[javascript()]}
          onChange={(value) => setCode(value)}
        />
      </div>
    </div>
  );
}

export default App;
