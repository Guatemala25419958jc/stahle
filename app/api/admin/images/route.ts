import { NextResponse } from "next/server";

type ImageBucket = { put(key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown> };

function bucket(): ImageBucket | null {
  const env = (process.env as unknown as { IMAGES?: ImageBucket }).IMAGES;
  const runtime = globalThis as unknown as { IMAGES?: ImageBucket };
  return env ?? runtime.IMAGES ?? null;
}

function asDataUrl(bytes: Uint8Array, type: string) {
  let binary = "";
  const chunk = 0x8000;
  for (let index = 0; index < bytes.length; index += chunk) binary += String.fromCharCode(...bytes.subarray(index, Math.min(index + chunk, bytes.length)));
  return `data:${type};base64,${btoa(binary)}`;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No se recibió una imagen" }, { status: 400 });
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Solo se permiten imágenes" }, { status: 400 });
    if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "La imagen no puede superar 8 MB" }, { status: 400 });
    const bytes = await file.arrayBuffer();
    const storage = bucket();
    if (storage) {
      const key = `products/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      await storage.put(key, bytes, { httpMetadata: { contentType: file.type } });
      return NextResponse.json({ key, url: `/api/admin/images/${encodeURIComponent(key)}` }, { status: 201 });
    }
    // Fallback for deployments where the R2 binding has not propagated yet.
    return NextResponse.json({ key: null, url: asDataUrl(new Uint8Array(bytes), file.type), warning: "R2 no disponible; se usó almacenamiento temporal." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo subir la imagen" }, { status: 500 });
  }
}
