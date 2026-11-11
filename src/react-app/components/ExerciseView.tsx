import { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { FaArrowRight, FaPlay, FaStop } from "react-icons/fa";
import { isBlankExercise, type Exercise, type Lesson } from "../lessons/types";
import { emptyValues, fillBlanks, isCorrect, isFilled, parseBlankCode } from "../lib/blanks";
import { editorTheme } from "../lib/editor-theme";
import { nextLessonPath, pathFor } from "../lib/route";
import { loadBlankState, loadProgress, saveBlankState, saveProgress } from "../lib/storage";
import { BlankEditor } from "./BlankEditor";
import { Celebration } from "./Celebration";
import { Preview } from "./Preview";

interface ExerciseViewProps {
  lesson: Lesson;
  exercise: Exercise;
}

const SMALL_BUTTON_CLASS =
  "pressable flex min-h-11 flex-none items-center gap-2 rounded-wobbly border-2 border-ink px-4 text-small font-bold";

/**
 * 演習の画面 (ツールバー、エディタか穴埋め、プレビュー)。
 * localStorage と iframe を使うのでブラウザ専用。ページからは clientOnly で読み込み、
 * 演習が変わるたびに key を変えて作り直す。
 */
export default function ExerciseView({ lesson, exercise }: ExerciseViewProps) {
  const blankSegments = useMemo(
    () => (isBlankExercise(exercise) ? parseBlankCode(exercise.blankCode) : null),
    [exercise],
  );

  // 保存済みがあればそれ、無ければ初期コード。穴埋め演習はエディタを使わない
  const [code, setCode] = useState(() =>
    isBlankExercise(exercise) ? "" : loadProgress(exercise.id) || exercise.initialCode,
  );
  // 穴埋めの箱の値。保存済みがあればそれ、無ければ全部空
  const [blankValues, setBlankValues] = useState(() =>
    blankSegments ? (loadBlankState(exercise.id)?.values ?? emptyValues(blankSegments)) : [],
  );
  const [showMissing, setShowMissing] = useState(false);
  // 正解するたびに増やす。0 の間は演出を出さない
  const [celebrationCount, setCelebrationCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [runningCode, setRunningCode] = useState("");

  // コード変更のたびに保存。間を置かないので、直後に「戻る」やタブを閉じても消えない
  useEffect(() => {
    if (code) saveProgress(exercise.id, code);
  }, [exercise.id, code]);

  const nextPath = nextLessonPath(lesson.meta.id);

  const handleReset = () => {
    if (!confirm("コードを初期状態にリセットしますか？\n保存されたコードは削除されます。")) return;
    if (isBlankExercise(exercise)) {
      const cleared = emptyValues(parseBlankCode(exercise.blankCode));
      setBlankValues(cleared);
      saveBlankState(exercise.id, cleared, false);
      setShowMissing(false);
    } else {
      setCode(exercise.initialCode);
    }
    setIsRunning(false);
    setRunningCode("");
  };

  const handleToggle = () => {
    if (isRunning) {
      setIsRunning(false);
      return;
    }
    if (!blankSegments) {
      setRunningCode(code);
      setIsRunning(true);
      return;
    }
    // 穴埋め: 空の箱が残っていたら走らせない (構文エラーになって、何が悪いのか伝わらない)
    if (!isFilled(blankSegments, blankValues)) {
      setShowMissing(true);
      return;
    }
    setShowMissing(false);
    setRunningCode(fillBlanks(blankSegments, blankValues));
    setIsRunning(true);
    if (isCorrect(blankSegments, blankValues)) {
      saveBlankState(exercise.id, blankValues, true);
      setCelebrationCount((count) => count + 1);
    }
  };

  const handleBlankChange = (index: number, value: string) => {
    const next = blankValues.map((current, i) => (i === index ? value : current));
    setBlankValues(next);
    saveBlankState(exercise.id, next, false);
    // 実行中に書き換えたら止める。もう一度「実行」で新しい値が走る
    setIsRunning(false);
  };

  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="flex flex-none items-center gap-3 border-b-2 border-ink bg-card px-5 py-3">
        <button
          onClick={handleToggle}
          className={`pressable flex min-h-[46px] flex-none items-center gap-2 rounded-pill border-2 border-ink px-6 text-subheading font-black shadow-offset-sm ${
            isRunning ? "bg-coral" : "bg-leaf"
          }`}
        >
          {isRunning ? <FaStop aria-hidden="true" /> : <FaPlay aria-hidden="true" />}
          {isRunning ? "停止" : "実行"}
        </button>
        <div className="min-w-0 flex-1 truncate font-bold">{lesson.meta.title}</div>
        <button onClick={handleReset} className={`${SMALL_BUTTON_CLASS} border-dashed`}>
          リセット
        </button>
        <a
          href={pathFor({ lessonId: lesson.meta.id, exerciseId: null })}
          className={`${SMALL_BUTTON_CLASS} bg-card`}
        >
          説明を読み直す
        </a>
        {nextPath && (
          <a href={nextPath} className={`${SMALL_BUTTON_CLASS} bg-accent shadow-offset-sm`}>
            次のレッスンへ
            <FaArrowRight aria-hidden="true" />
          </a>
        )}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-2">
        <div className="overflow-hidden border-r-2 border-ink bg-card">
          {blankSegments ? (
            <BlankEditor
              segments={blankSegments}
              values={blankValues}
              showMissing={showMissing}
              onChange={handleBlankChange}
              onSubmit={handleToggle}
            />
          ) : (
            <CodeMirror
              value={code}
              height="100%"
              theme={editorTheme}
              extensions={[javascript()]}
              onChange={(value) => setCode(value)}
              editable={!isRunning}
            />
          )}
        </div>
        <div className="relative min-h-0 min-w-0">
          <Preview code={runningCode} isRunning={isRunning} onStop={() => setIsRunning(false)} />
          {celebrationCount > 0 && <Celebration key={celebrationCount} />}
        </div>
      </div>
    </main>
  );
}
