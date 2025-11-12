import type { ComponentType } from "react";

export interface LessonMeta {
  id: string;
  title: string;
  description: string;
  initialCode: string;
  solution: string;
  hints?: string[];
  category: "basic" | "advanced" | "challenge";
}

export interface Lesson {
  meta: LessonMeta;
  Content: ComponentType;
}

export interface LessonProgress {
  lessonId: string;
  code: string;
  completed: boolean;
}
