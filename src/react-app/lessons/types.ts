import type { ComponentType } from "react";

export interface Exercise {
  id: string;
  label: string;
  initialCode: string;
}

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
