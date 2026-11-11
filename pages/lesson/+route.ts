import type { PageContext } from "vike/types";
import { parsePath } from "../../src/react-app/lib/route";

// /lessons/<レッスンID> と /lessons/<レッスンID>/<演習ID>。実在しない ID は 404
export function route(pageContext: PageContext) {
  const parsed = parsePath(pageContext.urlPathname);
  if (!parsed) return false;
  return {
    routeParams: {
      lessonId: parsed.lessonId,
      ...(parsed.exerciseId ? { exerciseId: parsed.exerciseId } : {}),
    },
  };
}
