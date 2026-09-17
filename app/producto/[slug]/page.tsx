"use client";
import { use, useEffect, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Header, Footer, WhatsAppButton } from "../../components";
import { getProduct, getCollection, products as seedProducts } from "../../data";

type Product = typeof seedProducts[number];
function parse<T>(value: unknown, fallback: T): T {
  if (Array.isArray(value)) return value as T;
  if (typeof value === "string") { try { return JSON.parse(value) as T; } catch { return fallback; } }
  return fallback;
}
function normalize(row: Record<string, unknown>): Product {
  const base = seedProducts.find((item) => item.slug === String(row.id || row.slug));
  const materials = parse<string[]>(row.materials, base?.materials || []);
  const images = parse<string[]>(row.images, base?.images || []);\n  const stats = parse<[string, string, string][]>(row.stats, base?.stats || []);
  return {
    ...(base || {
      slug: String(row.id || row.slug),
      type: "Mueble",
      status: "Fabricación bajo pedido",
      tagline: "",
      stats: [],
      description: "",
      materials: [],
      dimensions: "",
      images: []
    }),
    slug: String(row.id || row.slug),
    name: String(row.name || base?.name || "Producto Stahlé"),
    collection: String(row.collection || base?.collection || "savia"),
    room: String(row.room || base?.room || "oficina"),
    price: String(row.price || base?.price || "Precio por confirmar"),
    description: String(row.description || base?.description || ""),
    materials,
    dimensions: String(row.dimensions || base?.dimensions || ""),
    images
  } as Product;
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(() => getProduct(slug) || null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const local = JSON.parse(window.localStorage.getItem("stahle_admin_products") || "[]") as Record<string, unknown>[];
    const localMatch = local.find((item) => String(item.id || item.slug) === slug);
    if (localMatch) setProduct(normalize(localMatch));
    fetch("/api/admin/products", { cache: "no-store" }).then((response) => response.ok ? response.json() : []).then((rows: Record<string, unknown>[]) => {
      const match = rows.find((item) => String(item.id || item.slug) === slug);
      if (match) setProduct(normalize(match));
    }).catch(() => undefined);
  }, [slug]);

  if (!product) return <main className="product-detail-loading"><Header /><p>Cargando pieza…</p></main>;
  const collection = getCollection(product.collection);
  const firstMaterial = product.materials?.[0] || "A medida";
  const upholstery = product.materials?.find((item) => /tapiz|tela|asiento|vinil|terciopelo/i.test(item));
  const roomName: Record<string, string> = { sala: "sala", comedor: "comedor", dormitorio: "dormitorio", cocina: "cocina", bano: "baño", oficina: "oficina" };
  const stats = product.stats?.length ? product.stats : [["01", "Estructura", firstMaterial], ["02", upholstery ? "Tapizado" : "Material", upholstery || product.materials?.[1] || "Seleccionado"], ["03", "Uso", roomName[product.room] || product.room]];
  return <main><Header /><section className={"product-detail " + (product.slug === "mesa-umbral" ? "product-umbral" : "")}><div className="gallery"><div className="gallery-label"><span>STAHLÉ / {collection?.name?.toUpperCase() || product.collection.toUpperCase()}</span><span>{String(active + 1).padStart(2, "0")} / {String(product.images.length).padStart(2, "0")}</span></div><div className="main-image">{product.images[active] ? <img src={product.images[active]} alt={product.name + ", vista " + (active + 1)} /> : <div className="empty">Sin fotografías</div>}</div><div className="thumbs">{product.images.map((image, index) => <button className={active === index ? "active" : ""} onClick={() => setActive(index)} key={image + index}><img src={image} alt={"Vista " + (index + 1)} /></button>)}</div><p className="gallery-caption">Cada ángulo revela una relación distinta entre la estructura y la luz.</p></div><div className="product-info"><a className="back dark" href={`/colecciones/${product.collection}`}><ArrowLeft size={16} /> Colección {collection?.name || product.collection}</a><p className="kicker">{product.type} · {collection?.name || product.collection}</p><div className="product-heading"><h1>{product.name}</h1><span className="availability">{product.status}</span></div>{product.tagline && <p className="product-tagline">{product.tagline}</p>}<p className="lead">{product.description}</p><div className="product-stats">{stats.map(([number, title, detail]) => <div key={number}><span>{number}</span><b>{title}</b><small>{detail}</small></div>)}</div><div className="spec-card"><div className="spec"><span>Materiales</span><div>{product.materials.map((material) => <p key={material}><Check size={15} />{material}</p>)}</div></div><div className="spec"><span>Medidas</span><p>{product.dimensions}</p></div></div><div className="price">{product.price}</div><div className="product-cta"><WhatsAppButton product={product.name} /><small>La disponibilidad, precio final y costo de entrega se confirman por WhatsApp.</small></div></div></section><section className="product-closing"><p className="kicker">UNA PIEZA CON PRESENCIA</p><h2>Creada para quedarse<br /><em>en la memoria del espacio.</em></h2><p>{product.name} reúne geometría, material y proporción en una pieza que acompaña la vida cotidiana sin perder su carácter.</p></section><Footer /></main>;
}
