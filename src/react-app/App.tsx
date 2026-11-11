import { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { FaArrowRight, FaPlay, FaStop } from "react-icons/fa";
import { Preview } from "./components/Preview";
import { LessonList } from "./components/LessonList";
import { LessonContent } from "./components/LessonContent";
import { Header } from "./components/Header";
import { lessons } from "./lessons";
import { saveProgress, loadProgress, saveCurrentState, loadCurrentState } from "./lib/storage";
import { editorTheme } from "./lib/code-theme";

type LessonStep = "description" | "coding";

const AUTOSAVE_DEBOUNCE_MS = 500;

const SMALL_BUTTON_CLASS =
  "pressable flex min-h-11 flex-none items-center gap-2 rounded-wobbly border-2 border-ink px-4 text-small font-bold";

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
  const [code, setCode] = useState(() => {
    // 復元された exercise がある場合はそのコードを読み込む
    if (savedState?.exerciseId) {
      const savedCode = loadProgress(savedState.exerciseId);
      const lesson = lessons.find((l) => l.meta.id === savedState.lessonId);
      const exercise = lesson?.meta.exercises.find((ex) => ex.id === savedState.exerciseId);
      if (exercise) {
        return savedCode || exercise.initialCode;
      }
    }

    // デフォルトは最初のレッスンの最初の exercise
    const firstLesson = lessons[0];
    if (firstLesson) {
      const firstExercise = firstLesson.meta.exercises[0];
      if (firstExercise) {
        const savedCode = loadProgress(firstExercise.id);
        return savedCode || firstExercise.initialCode;
      }
    }
    return "";
  });
  const [isRunning, setIsRunning] = useState(false);
  const [runningCode, setRunningCode] = useState("");

  const selectedLesson = lessons.find((l) => l.meta.id === selectedLessonId);

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
      const firstExercise = lesson.meta.exercises[0];
      if (firstExercise) {
        const savedCode = loadProgress(firstExercise.id);
        setCode(savedCode || firstExercise.initialCode);
      }

      setIsRunning(false);
      setRunningCode("");
    }
  };

  const handleStartExercise = (exerciseId: string) => {
    if (!selectedLesson) return;
    const exercise = selectedLesson.meta.exercises?.find((ex) => ex.id === exerciseId);
    if (exercise) {
      setCurrentExerciseId(exerciseId);
      // 保存されたコードがあれば読み込む、なければ initialCode を使う
      const savedCode = loadProgress(exerciseId);
      setCode(savedCode || exercise.initialCode);
      setLessonStep("coding");
      setIsRunning(false);
      setRunningCode("");
    }
  };

  const handleBackToDescription = () => {
    setCurrentExerciseId(null);
    setLessonStep("description");
  };

  const handleReset = () => {
    if (!selectedLesson || !currentExerciseId) return;
    if (confirm("コードを初期状態にリセットしますか？\n保存されたコードは削除されます。")) {
      const exercise = selectedLesson.meta.exercises.find((ex) => ex.id === currentExerciseId);
      if (exercise) {
        setCode(exercise.initialCode);
        setIsRunning(false);
        setRunningCode("");
      }
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
    } else {
      setRunningCode(code);
      setIsRunning(true);
    }
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
                <CodeMirror
                  value={code}
                  height="100%"
                  theme={editorTheme}
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
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
