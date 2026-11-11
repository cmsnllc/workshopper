import type { Server } from "vike/types";
import { Hono } from "hono";
import vike from "@vikejs/hono";

const app = new Hono<{ Bindings: Env }>();

// 静的ファイル (public/ とビルド済みの JS/CSS) は Workers の assets が先に返す。ここに来るのはページだけ
vike(app);

export default { fetch: app.fetch } satisfies Server;
