import type { Lesson, LessonMeta } from "./types";
import LessonContent01, {
  frontmatter as meta01,
} from "./01-first-circle.mdx";

export const lessons: Lesson[] = [
  {
    meta: meta01 as LessonMeta,
    Content: LessonContent01,
  },
];
