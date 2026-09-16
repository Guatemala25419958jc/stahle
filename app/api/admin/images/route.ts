import { NextResponse } from "next/server";

type ImageBucket = { put(key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown> };

function bucket(): ImageBucket {
  const value = (process.env as unknown as { IMAGES?: ImageBucket }).IMAGES;
  if (!value) throw new Error("R2 binding IMAGES is not available");
  return value;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No se recibió una imagen" }, { status: 400 });
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Solo se permiten imágenes" }, { status: 400 });
    if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "La imagen no puede superar 8 MB" }, { status: 400 });
    const key = `products/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    await bucket().put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
    return NextResponse.json({ key, url: `/api/admin/images/${encodeURIComponent(key)}` }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo subir la imagen" }, { status: 500 });
  }
}
