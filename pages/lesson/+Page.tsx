import { lazy, Suspense, useEffect } from "react";
import { useHydrated } from "vike-react/useHydrated";
import { usePageContext } from "vike-react/usePageContext";
import { LessonContent } from "../../src/react-app/components/LessonContent";
import { LessonList } from "../../src/react-app/components/LessonList";
import { lessons } from "../../src/react-app/lessons";
import { saveCurrentState } from "../../src/react-app/lib/storage";

// 演習の画面は localStorage と iframe を使うので、サーバーでは描かない。
// ブラウザで hydrate が済んでから、動的 import で読み込む
const ExerciseView = lazy(() => import("../../src/react-app/components/ExerciseView"));

const EXERCISE_FALLBACK = <main className="bg-dots min-w-0 flex-1" />;

export default function Page() {
  const hydrated = useHydrated();
  const { lessonId, exerciseId } = usePageContext().routeParams;
  const lesson = lessons.find((l) => l.meta.id === lessonId);
  const exercise = lesson?.meta.exercises.find((ex) => ex.id === exerciseId);

  // "/" で開いたときに戻ってこられるよう、今のページを覚えておく
  useEffect(() => {
    saveCurrentState({ lessonId, step: exerciseId ? "coding" : "description", exerciseId });
  }, [lessonId, exerciseId]);

  // +route.ts が実在するレッスンだけを通すので、ここには来ない
  if (!lesson) return null;

  return (
    <div className="flex min-h-0 flex-1">
      <LessonList lessons={lessons} selectedLessonId={lessonId} />
      {exercise ? (
        hydrated ? (
          <Suspense fallback={EXERCISE_FALLBACK}>
            <ExerciseView key={exercise.id} lesson={lesson} exercise={exercise} />
          </Suspense>
        ) : (
          EXERCISE_FALLBACK
        )
      ) : (
        <main className="min-w-0 flex-1 overflow-hidden">
          <LessonContent lesson={lesson} />
        </main>
      )}
    </div>
  );
}
