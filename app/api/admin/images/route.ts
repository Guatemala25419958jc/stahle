import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type ImageBucket = { put(key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown> };

async function bucket(): Promise<ImageBucket | null> {
  let cloudflare: { IMAGES?: ImageBucket } = {};
  try { cloudflare = (await getCloudflareContext({ async: true })).env as typeof cloudflare; } catch { /* local dev */ }
  const env = cloudflare.IMAGES ?? (process.env as unknown as { IMAGES?: ImageBucket }).IMAGES;
  const runtime = globalThis as unknown as { IMAGES?: ImageBucket };
  return env ?? runtime.IMAGES ?? null;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No se recibió una imagen" }, { status: 400 });
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Solo se permiten imágenes" }, { status: 400 });
    if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "La imagen no puede superar 8 MB" }, { status: 400 });
    const bytes = await file.arrayBuffer();
    const storage = await bucket();
    if (storage) {
      const key = `products/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      await storage.put(key, bytes, { httpMetadata: { contentType: file.type } });
      return NextResponse.json({ key, url: `/api/admin/images/${encodeURIComponent(key)}` }, { status: 201 });
    }
    return NextResponse.json({ error: "El almacenamiento de fotografías no está disponible. No se publicó la imagen." }, { status: 503 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo subir la imagen" }, { status: 500 });
  }
}
