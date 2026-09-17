import handler from "vinext/server/fetch-handler";

type RuntimeEnv = { DB?: D1Database; IMAGES?: R2Bucket };

export default {
  async fetch(request: Request, env: RuntimeEnv, ctx: ExecutionContext) {
    // Vinext route modules can read these bindings through their runtime
    // fallback while the request is being handled.
    (globalThis as typeof globalThis & RuntimeEnv).DB = env.DB;
    (globalThis as typeof globalThis & RuntimeEnv).IMAGES = env.IMAGES;
    return handler.fetch(request, env, ctx);
  },
};
