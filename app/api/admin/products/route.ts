import { NextResponse } from "next/server";

type ProductInput = {
  id?: string; name: string; description?: string; collection: string; room: string;
  materials?: string[]; dimensions?: string; price?: string; images?: string[];
};

function database(): D1Database {
  const db = (process.env as unknown as { DB?: D1Database }).DB;
  if (!db) throw new Error("D1 binding DB is not available");
  return db;
}

export async function GET() {
  try {
    const result = await database().prepare("SELECT * FROM products ORDER BY created_at DESC").all();
    return NextResponse.json(result.results);
  } catch {
    return NextResponse.json({ error: "No se pudo consultar el catálogo" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as ProductInput;
    if (!body.name || !body.collection || !body.room) return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    const id = body.id ?? crypto.randomUUID();
    await database().prepare("INSERT INTO products (id,name,description,collection,room,materials,dimensions,price,images) VALUES (?,?,?,?,?,?,?,?,?)")
      .bind(id, body.name, body.description ?? "", body.collection, body.room, JSON.stringify(body.materials ?? []), body.dimensions ?? "", body.price ?? "Precio por confirmar", JSON.stringify(body.images ?? [])).run();
    return NextResponse.json({ id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar el producto" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json() as ProductInput;
    if (!body.id) return NextResponse.json({ error: "Falta el id del producto" }, { status: 400 });
    await database().prepare("UPDATE products SET name=?,description=?,collection=?,room=?,materials=?,dimensions=?,price=?,images=?,updated_at=CURRENT_TIMESTAMP WHERE id=?")
      .bind(body.name, body.description ?? "", body.collection, body.room, JSON.stringify(body.materials ?? []), body.dimensions ?? "", body.price ?? "", JSON.stringify(body.images ?? []), body.id).run();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar el producto" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Falta el id del producto" }, { status: 400 });
    await database().prepare("DELETE FROM products WHERE id=?").bind(id).run();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo eliminar el producto" }, { status: 500 });
  }
}
