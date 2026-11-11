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
import { parsePath, pathFor, type Route } from "./lib/route";
import { emptyValues, fillBlanks, isCorrect, isFilled, parseBlankCode } from "./lib/blanks";
import { editorTheme } from "./lib/code-theme";

type LessonStep = "description" | "coding";

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

const firstExerciseOf = (lessonId: string | null | undefined): Exercise | undefined =>
  lessons.find((l) => l.meta.id === lessonId)?.meta.exercises[0];

// 最初に開くページ。URL が指していればそこ、無ければ前回開いていたページ、それも無ければ最初のレッスン
const initialRoute = (): Route | null => {
  const fromUrl = parsePath(window.location.pathname);
  if (fromUrl) return fromUrl;

  const saved = loadCurrentState();
  const fromSaved = saved
    ? parsePath(
        pathFor({
          lessonId: saved.lessonId,
          exerciseId: saved.step === "coding" ? (saved.exerciseId ?? null) : null,
        }),
      )
    : null;
  if (fromSaved) return fromSaved;

  return lessons[0] ? { lessonId: lessons[0].meta.id, exerciseId: null } : null;
};

function App() {
  const [initial] = useState(initialRoute);

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    initial?.lessonId ?? null,
  );
  const [lessonStep, setLessonStep] = useState<LessonStep>(
    initial?.exerciseId ? "coding" : "description",
  );
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(
    initial?.exerciseId ?? null,
  );
  // 開いている exercise があればそのコード、無ければそのレッスンの最初の exercise
  const [code, setCode] = useState(() =>
    codeFor(
      findExercise(initial?.lessonId, initial?.exerciseId) ?? firstExerciseOf(initial?.lessonId),
    ),
  );
  const [blankValues, setBlankValues] = useState(() =>
    blankValuesFor(findExercise(initial?.lessonId, initial?.exerciseId)),
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

  // コード変更のたびに保存。間を置かないので、直後に「戻る」やタブを閉じても消えない
  useEffect(() => {
    if (currentExerciseId && code) {
      saveProgress(currentExerciseId, code);
    }
  }, [currentExerciseId, code]);

  // 開いているページを URL と localStorage に反映する
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (!selectedLessonId) return;
    const exerciseId = lessonStep === "coding" ? currentExerciseId : null;
    const path = pathFor({ lessonId: selectedLessonId, exerciseId });

    if (isFirstRender.current) {
      // 最初は履歴を増やさず、今の履歴を正しい URL に置き換える (?debug は残す)
      isFirstRender.current = false;
      window.history.replaceState(null, "", path + window.location.search);
      return;
    }
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
    saveCurrentState({
      lessonId: selectedLessonId,
      step: lessonStep,
      exerciseId: currentExerciseId || undefined,
    });
  }, [selectedLessonId, lessonStep, currentExerciseId]);

  // ページを開く。ボタンからも、ブラウザの「戻る」「進む」からも、ここを通る
  const openRoute = (route: Route) => {
    const exercise = findExercise(route.lessonId, route.exerciseId);
    setSelectedLessonId(route.lessonId);
    setLessonStep(exercise ? "coding" : "description");
    setCurrentExerciseId(exercise?.id ?? null);
    setCode(codeFor(exercise ?? firstExerciseOf(route.lessonId)));
    setBlankValues(blankValuesFor(exercise));
    setShowMissing(false);
    setCelebrationCount(0);
    setIsRunning(false);
    setRunningCode("");
  };

  // ブラウザの「戻る」「進む」
  useEffect(() => {
    const handlePopState = () => {
      const route = parsePath(window.location.pathname);
      if (route) openRoute(route);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSelectLesson = (lessonId: string) => {
    if (lessons.some((l) => l.meta.id === lessonId)) {
      openRoute({ lessonId, exerciseId: null });
    }
  };

  const handleStartExercise = (exerciseId: string) => {
    if (selectedLessonId) openRoute({ lessonId: selectedLessonId, exerciseId });
  };

  const handleBackToDescription = () => {
    if (selectedLessonId) openRoute({ lessonId: selectedLessonId, exerciseId: null });
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
