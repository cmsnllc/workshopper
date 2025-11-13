import type { Lesson } from "./types";
import LessonContent0101, {
  frontmatter as meta0101,
} from "./01-first-circle.mdx";
import LessonContent0102, {
  frontmatter as meta0102,
} from "./01-02-basics.mdx";
import LessonContent0103, {
  frontmatter as meta0103,
} from "./01-03-challenge-yellow.mdx";

export const lessons: Lesson[] = [
  {
    meta: meta0101,
    Content: LessonContent0101,
  },
  {
    meta: meta0102,
    Content: LessonContent0102,
  },
  {
    meta: meta0103,
    Content: LessonContent0103,
  },
];
