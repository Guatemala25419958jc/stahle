import { NextResponse } from "next/server";
import { products as seedProducts } from "../../../data";

type ProductInput = { id?: string; name: string; description?: string; collection: string; room: string; materials?: string[]; dimensions?: string; price?: string; images?: string[] };
type Bucket = { get(key: string): Promise<{ body: ReadableStream } | null>; put(key: string, value: string, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown> };
const CATALOG_KEY = "products/catalog.json";

function database(): D1Database | null {
  return (process.env as unknown as { DB?: D1Database }).DB ?? (globalThis as unknown as { DB?: D1Database }).DB ?? null;
}
function bucket(): Bucket | null {
  return (process.env as unknown as { IMAGES?: Bucket }).IMAGES ?? (globalThis as unknown as { IMAGES?: Bucket }).IMAGES ?? null;
}
function authorized(request: Request) {
  return request.headers.get("Cookie")?.split(";").some((item) => item.trim() === "stahle_admin=authenticated") === true;
}
function seed() {
  return seedProducts.map((item) => ({ ...item, id: item.slug }));
}
async function readStored(): Promise<ProductInput[]> {
  const object = await bucket()?.get(CATALOG_KEY);
  if (!object) return seed();
  try { return JSON.parse(await new Response(object.body).text()) as ProductInput[]; } catch { return seed(); }
}
async function writeStored(items: ProductInput[]) {
  const storage = bucket();
  if (!storage) throw new Error("No hay almacenamiento configurado para el catálogo.");
  await storage.put(CATALOG_KEY, JSON.stringify(items), { httpMetadata: { contentType: "application/json" } });
}

export async function GET() {
  try {
    const db = database();
    if (db) {
      const result = await db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
      return NextResponse.json(result.results);
    }
    return NextResponse.json(await readStored());
  } catch { return NextResponse.json({ error: "No se pudo consultar el catálogo" }, { status: 500 }); }
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await request.json() as ProductInput;
    if (!body.name || !body.collection || !body.room) return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    const db = database();
    if (db) {
      const id = body.id ?? crypto.randomUUID();
      await db.prepare("INSERT INTO products (id,name,description,collection,room,materials,dimensions,price,images) VALUES (?,?,?,?,?,?,?,?,?)").bind(id, body.name, body.description ?? "", body.collection, body.room, JSON.stringify(body.materials ?? []), body.dimensions ?? "", body.price ?? "Precio por confirmar", JSON.stringify(body.images ?? [])).run();
      return NextResponse.json({ id }, { status: 201 });
    }
    const items = await readStored();
    const id = body.id && body.id !== "new" ? body.id : crypto.randomUUID();
    await writeStored([...items.filter((item) => item.id !== id), { ...body, id }]);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo guardar el producto" }, { status: 500 }); }
}

export async function PUT(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const body = await request.json() as ProductInput;
    if (!body.id) return NextResponse.json({ error: "Falta el id del producto" }, { status: 400 });
    const db = database();
    if (db) {
      await db.prepare("UPDATE products SET name=?,description=?,collection=?,room=?,materials=?,dimensions=?,price=?,images=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(body.name, body.description ?? "", body.collection, body.room, JSON.stringify(body.materials ?? []), body.dimensions ?? "", body.price ?? "", JSON.stringify(body.images ?? []), body.id).run();
      return NextResponse.json({ ok: true });
    }
    const items = await readStored();
    await writeStored(items.map((item) => item.id === body.id ? body : item));
    return NextResponse.json({ ok: true });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo actualizar el producto" }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Falta el id del producto" }, { status: 400 });
    const db = database();
    if (db) await db.prepare("DELETE FROM products WHERE id=?").bind(id).run();
    else await writeStored((await readStored()).filter((item) => item.id !== id));
    return NextResponse.json({ ok: true });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo eliminar el producto" }, { status: 500 }); }
}
