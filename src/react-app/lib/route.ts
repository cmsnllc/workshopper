import { lessons } from "../lessons";
import { loadCurrentState } from "./storage";

// ページの URL。解説は /lessons/<レッスンID>、演習は /lessons/<レッスンID>/<演習ID>
export interface Route {
  lessonId: string;
  exerciseId: string | null;
}

const LESSONS_SEGMENT = "lessons";
const LESSON_DEPTH = 2;
const EXERCISE_DEPTH = 3;

export const pathFor = (route: Route): string =>
  [`/${LESSONS_SEGMENT}`, route.lessonId, ...(route.exerciseId ? [route.exerciseId] : [])].join(
    "/",
  );

/** 実在するレッスン・演習を指す URL だけを受け付ける。それ以外は null */
export const parsePath = (pathname: string): Route | null => {
  const segments = pathname.split("/").filter(Boolean);
  const [root, lessonId, exerciseId] = segments;
  if (root !== LESSONS_SEGMENT) return null;

  const lesson = lessons.find((l) => l.meta.id === lessonId);
  if (!lesson) return null;
  if (segments.length === LESSON_DEPTH) return { lessonId: lesson.meta.id, exerciseId: null };

  const exercise = lesson.meta.exercises.find((ex) => ex.id === exerciseId);
  if (!exercise || segments.length !== EXERCISE_DEPTH) return null;
  return { lessonId: lesson.meta.id, exerciseId: exercise.id };
};

/** 次のレッスンの解説ページ。最後のレッスンなら null */
export const nextLessonPath = (lessonId: string): string | null => {
  const next = lessons[lessons.findIndex((l) => l.meta.id === lessonId) + 1];
  return next ? pathFor({ lessonId: next.meta.id, exerciseId: null }) : null;
};

/** 前回開いていたページ。無ければ最初のレッスン。localStorage を読むのでブラウザ専用 */
export const lastPath = (): string => {
  const saved = loadCurrentState();
  const savedPath = saved
    ? pathFor({
        lessonId: saved.lessonId,
        exerciseId: saved.step === "coding" ? (saved.exerciseId ?? null) : null,
      })
    : null;
  return savedPath && parsePath(savedPath)
    ? savedPath
    : pathFor({ lessonId: lessons[0].meta.id, exerciseId: null });
};
