import { useState, useEffect, useMemo, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { FaArrowRight, FaPlay, FaStop } from "react-icons/fa";
import { Preview } from "./components/Preview";
import { LessonList } from "./components/LessonList";
import { LessonContent } from "./components/LessonContent";
import { Header } from "./components/Header";
import { BlankEditor } from "./components/BlankEditor";
import { Celebration } from "./components/Celebration";
import { lessons } from "./lessons";
import { isBlankExercise, type Exercise } from "./lessons/types";
import {
  saveProgress,
  loadProgress,
  saveCurrentState,
  loadCurrentState,
  loadBlankState,
  saveBlankState,
} from "./lib/storage";
import { emptyValues, fillBlanks, isCorrect, isFilled, parseBlankCode } from "./lib/blanks";
import { editorTheme } from "./lib/code-theme";

type LessonStep = "description" | "coding";

const AUTOSAVE_DEBOUNCE_MS = 500;

const SMALL_BUTTON_CLASS =
  "pressable flex min-h-11 flex-none items-center gap-2 rounded-wobbly border-2 border-ink px-4 text-small font-bold";

// エディタに出すコード。保存済みがあればそれ、無ければ初期コード。穴埋め演習はエディタを使わない
const codeFor = (exercise: Exercise | undefined): string =>
  !exercise || isBlankExercise(exercise) ? "" : loadProgress(exercise.id) || exercise.initialCode;

// 穴埋めの箱に出す値。保存済みがあればそれ、無ければ全部空
const blankValuesFor = (exercise: Exercise | undefined): string[] =>
  exercise && isBlankExercise(exercise)
    ? (loadBlankState(exercise.id)?.values ?? emptyValues(parseBlankCode(exercise.blankCode)))
    : [];

const findExercise = (
  lessonId: string | null | undefined,
  exerciseId: string | null | undefined,
): Exercise | undefined =>
  lessons.find((l) => l.meta.id === lessonId)?.meta.exercises.find((ex) => ex.id === exerciseId);

function App() {
  // localStorage から前回の状態を復元
  const savedState = loadCurrentState();

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    savedState?.lessonId || lessons[0]?.meta.id || null,
  );
  const [lessonStep, setLessonStep] = useState<LessonStep>(savedState?.step || "description");
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(
    savedState?.exerciseId || null,
  );
  // 復元された exercise があればそのコード、無ければ最初のレッスンの最初の exercise
  const [code, setCode] = useState(() =>
    codeFor(
      findExercise(savedState?.lessonId, savedState?.exerciseId) ?? lessons[0]?.meta.exercises[0],
    ),
  );
  const [blankValues, setBlankValues] = useState(() =>
    blankValuesFor(findExercise(savedState?.lessonId, savedState?.exerciseId)),
  );
  const [showMissing, setShowMissing] = useState(false);
  // 正解するたびに増やす。0 の間は演出を出さない
  const [celebrationCount, setCelebrationCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [runningCode, setRunningCode] = useState("");

  const selectedLesson = lessons.find((l) => l.meta.id === selectedLessonId);
  const currentExercise = selectedLesson?.meta.exercises.find((ex) => ex.id === currentExerciseId);
  const blankCode =
    currentExercise && isBlankExercise(currentExercise) ? currentExercise.blankCode : null;
  const blankSegments = useMemo(() => (blankCode ? parseBlankCode(blankCode) : null), [blankCode]);

  // コード変更時に自動保存
  useEffect(() => {
    if (currentExerciseId && code) {
      const timeoutId = setTimeout(() => {
        saveProgress(currentExerciseId, code);
      }, AUTOSAVE_DEBOUNCE_MS);

      return () => clearTimeout(timeoutId);
    }
  }, [currentExerciseId, code]);

  // 現在の状態を保存（初回レンダリングはスキップ）
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (selectedLessonId) {
      saveCurrentState({
        lessonId: selectedLessonId,
        step: lessonStep,
        exerciseId: currentExerciseId || undefined,
      });
    }
  }, [selectedLessonId, lessonStep, currentExerciseId]);

  const handleSelectLesson = (lessonId: string) => {
    const lesson = lessons.find((l) => l.meta.id === lessonId);
    if (lesson) {
      setSelectedLessonId(lessonId);
      setLessonStep("description"); // 新しいレッスンを選んだら説明から始める
      setCurrentExerciseId(null); // exercise をリセット

      // 最初の exercise のコードを読み込む
      setCode(codeFor(lesson.meta.exercises[0]));
      setBlankValues([]);
      setShowMissing(false);
      setCelebrationCount(0);

      setIsRunning(false);
      setRunningCode("");
    }
  };

  const handleStartExercise = (exerciseId: string) => {
    if (!selectedLesson) return;
    const exercise = selectedLesson.meta.exercises?.find((ex) => ex.id === exerciseId);
    if (exercise) {
      setCurrentExerciseId(exerciseId);
      setCode(codeFor(exercise));
      setBlankValues(blankValuesFor(exercise));
      setShowMissing(false);
      setCelebrationCount(0);
      setLessonStep("coding");
      setIsRunning(false);
      setRunningCode("");
    }
  };

  const handleBackToDescription = () => {
    setCurrentExerciseId(null);
    setLessonStep("description");
    setCelebrationCount(0);
  };

  const handleReset = () => {
    if (!selectedLesson || !currentExerciseId) return;
    if (confirm("コードを初期状態にリセットしますか？\n保存されたコードは削除されます。")) {
      const exercise = selectedLesson.meta.exercises.find((ex) => ex.id === currentExerciseId);
      if (exercise && isBlankExercise(exercise)) {
        const cleared = emptyValues(parseBlankCode(exercise.blankCode));
        setBlankValues(cleared);
        saveBlankState(exercise.id, cleared, false);
        setShowMissing(false);
      } else if (exercise) {
        setCode(exercise.initialCode);
      }
      setIsRunning(false);
      setRunningCode("");
    }
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
      return;
    }
    if (!blankSegments || !currentExerciseId) {
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
      saveBlankState(currentExerciseId, blankValues, true);
      setCelebrationCount((count) => count + 1);
    }
  };

  const handleBlankChange = (index: number, value: string) => {
    if (!currentExerciseId) return;
    const next = blankValues.map((current, i) => (i === index ? value : current));
    setBlankValues(next);
    saveBlankState(currentExerciseId, next, false);
    // 実行中に書き換えたら止める。もう一度「実行」で新しい値が走る
    setIsRunning(false);
  };

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex min-h-0 flex-1">
        <LessonList
          lessons={lessons}
          selectedLessonId={selectedLessonId}
          onSelectLesson={handleSelectLesson}
        />

        {/* 説明ステップ */}
        {lessonStep === "description" && selectedLesson && (
          <main className="min-w-0 flex-1 overflow-hidden">
            <LessonContent lesson={selectedLesson} onStartExercise={handleStartExercise} />
          </main>
        )}

        {/* コーディングステップ */}
        {lessonStep === "coding" && selectedLesson && (
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
              <div className="min-w-0 flex-1 truncate font-bold">{selectedLesson.meta.title}</div>
              <button onClick={handleReset} className={`${SMALL_BUTTON_CLASS} border-dashed`}>
                リセット
              </button>
              <button onClick={handleBackToDescription} className={`${SMALL_BUTTON_CLASS} bg-card`}>
                説明を読み直す
              </button>
              {hasNextLesson() && (
                <button
                  onClick={handleNextLesson}
                  className={`${SMALL_BUTTON_CLASS} bg-accent shadow-offset-sm`}
                >
                  次のレッスンへ
                  <FaArrowRight aria-hidden="true" />
                </button>
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
                <Preview
                  code={runningCode}
                  isRunning={isRunning}
                  onStop={() => setIsRunning(false)}
                />
                {celebrationCount > 0 && <Celebration key={celebrationCount} />}
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
