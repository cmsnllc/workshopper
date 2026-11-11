import type { ComponentType } from "react";

interface ExerciseBase {
  id: string;
  label: string;
}

/** エディタで自由にコードを書く演習 */
export interface CodeExercise extends ExerciseBase {
  initialCode: string;
}

/**
 * 穴埋めの演習。コードは書き換えられず、`{{答え}}` と書いた場所だけが入力欄になる。
 * 例: `fill({{255}}, {{255}}, {{0}});`
 */
export interface BlankExercise extends ExerciseBase {
  blankCode: string;
}

export type Exercise = CodeExercise | BlankExercise;

export const isBlankExercise = (exercise: Exercise): exercise is BlankExercise =>
  "blankCode" in exercise;

export interface LessonMeta {
  id: string;
  title: string;
  description?: string;
  exercises: Exercise[];
  category: "basic" | "advanced" | "challenge";
}

export interface MDXComponentProps {
  components?: Record<string, ComponentType<unknown>>;
  [key: string]: unknown;
}

export interface Lesson {
  meta: LessonMeta;
  Content: ComponentType<MDXComponentProps>;
}

export interface LessonProgress {
  lessonId: string;
  code: string;
  completed: boolean;
}
