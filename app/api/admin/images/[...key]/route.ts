import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type ImageObject = { body: ReadableStream; httpMetadata?: { contentType?: string } };
type ImageBucket = { get(key: string): Promise<ImageObject | null> };

export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  let cloudflare: { IMAGES?: ImageBucket } = {};
  try { cloudflare = (await getCloudflareContext({ async: true })).env as typeof cloudflare; } catch { /* local dev */ }
  const env = cloudflare.IMAGES ?? (process.env as unknown as { IMAGES?: ImageBucket }).IMAGES;
  const runtime = globalThis as unknown as { IMAGES?: ImageBucket };
  const value = env ?? runtime.IMAGES;
  if (!value) return NextResponse.json({ error: "R2 binding unavailable" }, { status: 500 });
  const { key } = await context.params;
  const object = await value.get(key.join("/"));
  if (!object) return new Response("Not found", { status: 404 });
  return new Response(object.body, { headers: { "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable" } });
}
