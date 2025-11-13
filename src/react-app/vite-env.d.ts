/// <reference types="vite/client" />

declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { LessonMeta } from "./lessons/types";
  const Component: ComponentType<Record<string, unknown>>;
  export default Component;
  export const frontmatter: LessonMeta;
}
