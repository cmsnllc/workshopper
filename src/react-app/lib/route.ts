import { lessons } from "../lessons";

// ページの URL。解説は /lessons/<レッスンID>、演習は /lessons/<レッスンID>/<演習ID>
export interface Route {
  lessonId: string;
  exerciseId: string | null;
}

const LESSONS_SEGMENT = "lessons";

export const pathFor = (route: Route): string =>
  [`/${LESSONS_SEGMENT}`, route.lessonId, ...(route.exerciseId ? [route.exerciseId] : [])].join(
    "/",
  );

/** レッスンが存在しなければ null。演習が存在しなければ、そのレッスンの解説ページ */
export const parsePath = (pathname: string): Route | null => {
  const [root, lessonId, exerciseId] = pathname.split("/").filter(Boolean);
  if (root !== LESSONS_SEGMENT) return null;

  const lesson = lessons.find((l) => l.meta.id === lessonId);
  if (!lesson) return null;

  const exercise = lesson.meta.exercises.find((ex) => ex.id === exerciseId);
  return { lessonId: lesson.meta.id, exerciseId: exercise?.id ?? null };
};
