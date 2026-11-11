import type { PageContext } from "vike/types";
import { lessons } from "../../src/react-app/lessons";

const SITE_TITLE = "トライ・やる・DAY";

export function title(pageContext: PageContext): string {
  const lesson = lessons.find((l) => l.meta.id === pageContext.routeParams.lessonId);
  return lesson ? `${lesson.meta.title} | ${SITE_TITLE}` : SITE_TITLE;
}
