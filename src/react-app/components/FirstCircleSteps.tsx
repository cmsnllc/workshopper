import { useEffect, useState } from "react";
import { FaPause, FaPlay, FaStepForward, FaUndo } from "react-icons/fa";
import { codeBlockStyle } from "../lib/code-theme";
import { SyntaxHighlighter } from "../lib/syntax-highlighter";

// 「最初の円」のプログラムを 1 行ずつ進めて、キャンバスがどう変わるかを見せる。
// 本物の p5 は動かさず SVG で描く (解説ページはサーバーでも描くので、iframe を持ち込まない)

interface Line {
  code: string;
  /** この行が実行されるステップ番号。function の行と閉じ括弧は実行の対象にしない */
  step: number | null;
}

const STEP_CANVAS = 1;
const STEP_BACKGROUND = 2;
const STEP_FILL = 3;
const STEP_ELLIPSE = 4;
const LAST_STEP = STEP_ELLIPSE;

const LINES: Line[] = [
  { code: "function setup() {", step: null },
  { code: "  createCanvas(400, 400);", step: STEP_CANVAS },
  { code: "  background(255, 255, 255);", step: STEP_BACKGROUND },
  { code: "  fill(255, 0, 0);", step: STEP_FILL },
  { code: "  ellipse(200, 200, 200, 200);", step: STEP_ELLIPSE },
  { code: "}", step: null },
];

const CAPTIONS: Record<number, string> = {
  0: "「再生」を押すと、上から 1 行ずつ動きます。",
  [STEP_CANVAS]: "createCanvas で、400×400 のキャンバスを作る。",
  [STEP_BACKGROUND]: "background で、背景を白くする。",
  [STEP_FILL]: "fill で、これからぬる色を赤にする。まだ何も描かれない。",
  [STEP_ELLIPSE]: "ellipse で円を描く。fill で決めた赤でぬられる。",
};

const STEP_INTERVAL_MS = 1400;

const INLINE_CODE_STYLE: React.CSSProperties = {
  margin: 0,
  padding: 0,
  background: "transparent",
};

const BUTTON_CLASS =
  "pressable flex min-h-11 items-center gap-2 rounded-wobbly border-2 border-ink px-4 text-small font-bold disabled:opacity-40";

const lineClass = (line: Line, step: number): string => {
  if (line.step === step) return "bg-accent";
  // まだ実行されていない行は薄くする
  return line.step !== null && line.step > step ? "opacity-50" : "";
};

function Canvas({ step }: { step: number }) {
  return (
    <svg
      viewBox="0 0 400 400"
      role="img"
      aria-label={`キャンバスの様子: ${CAPTIONS[step]}`}
      className="aspect-square w-full max-w-[220px]"
    >
      {step < STEP_CANVAS ? (
        // キャンバスはまだ無い
        <rect
          x="4"
          y="4"
          width="392"
          height="392"
          className="fill-none stroke-ink-soft"
          strokeWidth="4"
          strokeDasharray="16 14"
        />
      ) : (
        <rect
          x="4"
          y="4"
          width="392"
          height="392"
          className={`stroke-ink transition-colors duration-300 ${
            step >= STEP_BACKGROUND ? "fill-white" : "fill-paper-deep"
          }`}
          strokeWidth="4"
        />
      )}
      {/* 色は p5 の fill(255, 0, 0) の結果そのもの。テーマの色ではない */}
      <circle
        cx="200"
        cy="200"
        r="100"
        strokeWidth="2"
        className={`origin-center fill-[#ff0000] stroke-black transition-transform duration-300 [transform-box:fill-box] ${
          step >= STEP_ELLIPSE ? "scale-100" : "scale-0"
        }`}
      />
    </svg>
  );
}

export function FirstCircleSteps() {
  const [step, setStep] = useState(0);
  const [playRequested, setPlayRequested] = useState(false);
  // 最後の行まで来たら、再生は自然に終わる
  const playing = playRequested && step < LAST_STEP;

  // 再生中は一定の間隔で 1 行ずつ進める
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setStep(step + 1), STEP_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [playing, step]);

  const handlePlay = () => {
    if (playing) {
      setPlayRequested(false);
      return;
    }
    // 最後まで進んでいたら、最初からもう一度
    setStep(step >= LAST_STEP ? STEP_CANVAS : step + 1);
    setPlayRequested(true);
  };

  const handleNext = () => {
    setPlayRequested(false);
    setStep(Math.min(step + 1, LAST_STEP));
  };

  const handleRestart = () => {
    setPlayRequested(false);
    setStep(0);
  };

  return (
    <div className="relative my-6 rounded-wobbly-lg border-2 border-ink bg-card p-5 shadow-offset">
      <span aria-hidden="true" className="tape" />
      <div className="flex flex-wrap items-center gap-6 pt-2">
        <div className="min-w-0 flex-1 basis-[320px] font-mono text-code whitespace-pre">
          {LINES.map((line) => (
            <div
              key={line.code}
              aria-current={line.step === step ? "step" : undefined}
              className={`flex items-center gap-2 rounded-md px-2 transition-colors duration-200 ${lineClass(line, step)}`}
            >
              <span className="flex w-3 flex-none justify-center">
                {line.step === step && <FaPlay aria-hidden="true" className="size-2.5" />}
              </span>
              <SyntaxHighlighter
                language="javascript"
                style={codeBlockStyle}
                customStyle={INLINE_CODE_STYLE}
                PreTag="span"
                CodeTag="span"
              >
                {line.code}
              </SyntaxHighlighter>
            </div>
          ))}
        </div>

        <div className="flex flex-none flex-col items-center gap-3">
          <Canvas step={step} />
          <div className="flex items-center gap-2 text-small">
            <span>ぬる色</span>
            <span
              className={`size-6 rounded-md border-2 border-ink transition-all duration-300 ${
                step >= STEP_FILL ? "bg-[#ff0000]" : "bg-white"
              } ${step === STEP_FILL ? "scale-150" : "scale-100"}`}
            />
          </div>
        </div>
      </div>

      <p aria-live="polite" className="mt-4 min-h-[2lh] font-bold">
        {CAPTIONS[step]}
      </p>

      <div className="mt-2 flex flex-wrap gap-3">
        <button onClick={handlePlay} className={`${BUTTON_CLASS} bg-leaf shadow-offset-sm`}>
          {playing ? <FaPause aria-hidden="true" /> : <FaPlay aria-hidden="true" />}
          {playing ? "一時停止" : "再生"}
        </button>
        <button
          onClick={handleNext}
          disabled={step >= LAST_STEP}
          className={`${BUTTON_CLASS} bg-card`}
        >
          <FaStepForward aria-hidden="true" />1 行進める
        </button>
        <button
          onClick={handleRestart}
          disabled={step === 0}
          className={`${BUTTON_CLASS} border-dashed`}
        >
          <FaUndo aria-hidden="true" />
          最初から
        </button>
      </div>
    </div>
  );
}
