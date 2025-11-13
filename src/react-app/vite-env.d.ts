/// <reference types="vite/client" />

declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { LessonMeta, MDXComponentProps } from "./lessons/types";

  const Component: ComponentType<MDXComponentProps>;
  export default Component;
  export const frontmatter: LessonMeta;
}
