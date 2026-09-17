"use client";
import { use, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Header, Footer } from "../../components";
import { rooms, products as seedProducts, collections } from "../../data";

type PublicProduct = typeof seedProducts[number];
function parse<T>(value: unknown, fallback: T): T {
  if (Array.isArray(value)) return value as T;
  if (typeof value === "string") { try { return JSON.parse(value) as T; } catch { return fallback; } }
  return fallback;
}
function normalize(row: Record<string, unknown>): PublicProduct {
  const base = seedProducts.find((item) => item.slug === row.id || item.slug === row.slug);
  return {
    ...(base || { slug: String(row.id || row.slug || crypto.randomUUID()), type: "Mueble", stats: [], tagline: "", description: "", materials: [], dimensions: "" }),
    name: String(row.name || base?.name || "Producto Stahlé"),
    collection: String(row.collection || base?.collection || "savia"),
    room: String(row.room || base?.room || "oficina"),
    price: String(row.price || base?.price || "Precio por confirmar"),
    description: String(row.description || base?.description || ""),
    materials: parse<string[]>(row.materials, base?.materials || []),
    dimensions: String(row.dimensions || base?.dimensions || ""),
    images: parse<string[]>(row.images, base?.images || [])
  } as PublicProduct;
}
function dedupeProducts(items: PublicProduct[]) {
  const byKey = new Map<string, PublicProduct>();
  for (const item of items) {
    const key = item.name.trim().toLowerCase().replace(/\\s+/g, " ");
    if (key) { const previous = byKey.get(key); if (!previous || (previous.id === key && item.id !== key)) byKey.set(key, item); }
  }
  return [...byKey.values()];
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const room = rooms.find((item) => item.slug === slug);
  const [items, setItems] = useState<PublicProduct[]>(seedProducts.filter((item) => item.room === slug));
  const [filter, setFilter] = useState("Todos");

  useEffect(() => {
    const local = JSON.parse(window.localStorage.getItem("stahle_admin_products") || "[]") as Record<string, unknown>[];
    if (local.length) setItems(dedupeProducts(local.map(normalize).filter((item) => item.room === slug)));
    fetch("/api/admin/products").then((response) => response.ok ? response.json() : []).then((rows: Record<string, unknown>[]) => {
      if (Array.isArray(rows) && rows.length) {
        const combined = [...rows, ...local.filter((localItem) => !rows.some((row) => String(row.id) === String(localItem.id)))];
        setItems(dedupeProducts(combined.map(normalize).filter((item) => item.room === slug)));
      }
    }).catch(() => undefined);
  }, [slug]);

  if (!room) return null;
  const types = ["Todos", ...Array.from(new Set(items.map((item) => item.type)))];
  const visible = filter === "Todos" ? items : items.filter((item) => item.type === filter);
  return <main><Header /><section className="inner-hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(9,8,7,.9),rgba(9,8,7,.25)),url('${room.image}')` }}><a href="/#ambientes" className="back"><ArrowLeft size={16} /> Ambientes</a><div><p className="kicker">EXPLORAR POR AMBIENTE</p><h1>Muebles para<br /><em>{room.name}</em></h1><p>Piezas pensadas para acompañar la función y personalidad de tu {room.name.toLowerCase()}.</p></div></section><section className="section catalog"><div className="filter-row">{types.map((type) => <button className={filter === type ? "active" : ""} onClick={() => setFilter(type)} key={type}>{type}</button>)}</div>{visible.length ? <div className="product-grid">{visible.map((product) => <a href={`/producto/${product.slug}`} className="product-card" key={product.slug}><img src={product.images[0]} alt={product.name} /><div><p>{product.type} · {collections.find((item) => item.slug === product.collection)?.name || product.collection}</p><h3>{product.name}</h3><span>{product.price}</span><b>Ver pieza <ArrowRight size={15} /></b></div></a>)}</div> : <div className="empty"><p className="kicker">PRÓXIMAMENTE</p><h3>Estamos preparando piezas para {room.name}.</h3><p>Mientras tanto, puedes enviarnos una referencia y cotizamos un diseño personalizado.</p><a className="btn gold" href="/cotizar">Cotizar mi diseño</a></div>}</section><Footer /></main>;
}
