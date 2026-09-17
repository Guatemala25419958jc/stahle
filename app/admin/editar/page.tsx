"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, ImagePlus, Pencil, Save, Star, Trash2, X } from "lucide-react";
import { products as catalog } from "../../data";

type Product = {
  id: string;
  name: string;
  description?: string;
  collection: string;
  room: string;
  materials?: string[] | string;
  dimensions?: string;
  price?: string;
  images?: string[] | string;
};

type GalleryImage = { url: string; pending?: File };

function listValue(value: Product["images"]): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];
  try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed.filter(Boolean) : []; } catch { return value.split(",").map((x) => x.trim()).filter(Boolean); }
}

function materialValue(value: Product["materials"]): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value !== "string") return "";
  try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed.join(", ") : value; } catch { return value; }
}

export default function EditarProducto() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [cover, setCover] = useState(0);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "";
    const nuevo = params.get("nuevo") === "1";
    if (nuevo) {
      setIsNew(true);
      setProduct({ id: "new", name: "", description: "", collection: "obsidian", room: "sala", materials: "", dimensions: "", price: "" });
      return;
    }
    fetch("/api/admin/products")
      .then((r) => r.ok ? r.json() : [])
      .then((items: Product[]) => {
        const found = items.find((item) => String(item.id) === id) || catalog.find((item) => item.slug === id);
        if (found) {
          const raw = found as Product & { slug?: string }; const normalized = { ...raw, id: String(raw.id || raw.slug) };
          setProduct(normalized);
          setImages(listValue(normalized.images).map((url) => ({ url })));
        }
      })
      .catch(() => setError("No se pudo cargar el producto."));
  }, []);

  const mainImage = images[cover]?.url || images[0]?.url;
  const canSave = useMemo(() => Boolean(product?.name?.trim() && product?.collection && product?.room), [product]);

  const update = (key: keyof Product, value: string) => setProduct((current) => current ? { ...current, [key]: value } : current);

  const addFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    if (replaceIndex !== null) {
      const file = files[0];
      setImages((current) => current.map((image, index) => index === replaceIndex ? { url: URL.createObjectURL(file), pending: file } : image));
      setReplaceIndex(null);
    } else {
      setImages((current) => [...current, ...files.map((file) => ({ url: URL.createObjectURL(file), pending: file }))]);
    }
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((current) => current.filter((_, i) => i !== index));
    setCover((current) => index < current ? current - 1 : Math.min(current, Math.max(0, images.length - 2)));
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!product || !canSave) return;
    setSaving(true); setError(""); setMessage("");
    try {
      const uploaded: GalleryImage[] = [];
      for (const image of images) {
        if (!image.pending) { uploaded.push(image); continue; }
        const form = new FormData(); form.append("file", image.pending);
        const response = await fetch("/api/admin/images", { method: "POST", body: form });
        if (!response.ok) throw new Error("No se pudo subir una de las fotografías.");
        const result = await response.json() as { url: string };
        uploaded.push({ url: result.url });
      }
      const ordered = uploaded.map((image) => image.url);
      const selectedCover = ordered[cover];
      if (selectedCover) { ordered.splice(cover, 1); ordered.unshift(selectedCover); }
      const productPayload = isNew ? (({ id: _id, ...rest }) => rest)(product) : product;
      const response = await fetch("/api/admin/products", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...productPayload, images: ordered, materials: materialValue(product.materials).split(",").map((x) => x.trim()).filter(Boolean) }),
      });
      if (!response.ok) throw new Error("No se pudieron guardar los cambios.");
      setImages(ordered.map((url) => ({ url }))); setCover(0); setMessage("Cambios guardados correctamente.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "No se pudo guardar."); }
    finally { setSaving(false); }
  };

  const removeProduct = async () => {
    if (!product || !window.confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    const response = await fetch("/api/admin/products?id=" + encodeURIComponent(product.id), { method: "DELETE" });
    if (response.ok) window.location.href = "/admin";
    else setError("No se pudo eliminar el producto.");
  };

  if (!product) return <main className="admin-edit-page admin-edit-loading"><a href="/admin"><ArrowLeft size={16} /> Volver a la galería</a><p>{error || "Cargando producto…"}</p></main>;

  return <main className="admin-edit-page">
    <aside className="admin-edit-sidebar">
      <a className="admin-edit-logo" href="/admin"><img src="/stahle-isologo-transparent.png" alt="Stahlé" /></a>
      <nav><a href="/admin"><ArrowLeft size={16} /> Resumen</a><a className="active" href="/admin"><ImagePlus size={16} /> Administrar galería</a></nav>
      <span className="admin-edit-sidebar-note">PANEL PRIVADO</span>
    </aside>
    <section className="admin-edit-content">
      <div className="admin-edit-breadcrumb"><a href="/admin">Administrar galería</a><span>/</span><span>Editar producto</span></div>
      <header className="admin-edit-titlebar"><div><p className="admin-eyebrow">{isNew ? "NUEVO PRODUCTO" : "EDITOR DE PRODUCTO"}</p><h1>{isNew ? "Agregar producto" : product.name}</h1></div><a className="admin-outline-button" href="/admin"><ArrowLeft size={16} /> Volver a la galería</a></header>
      <form onSubmit={save} className="admin-edit-layout">
        <section className="admin-edit-gallery">
          <div className="admin-edit-main-image">{mainImage ? <img src={mainImage} alt={product.name} /> : <ImagePlus size={42} />}</div>
          <div className="admin-edit-thumbs">
            {images.map((image, index) => <div className={index === cover ? "admin-edit-thumb active" : "admin-edit-thumb"} key={image.url + index}>
              <button type="button" onClick={() => setCover(index)} aria-label={index === cover ? "Portada seleccionada" : "Seleccionar como portada"}><img src={image.url} alt={"Fotografía " + (index + 1)} />{index === cover && <span className="admin-cover-badge"><Star size={12} /> Portada</span>}</button>
              <div className="admin-thumb-actions"><button type="button" onClick={() => { setReplaceIndex(index); fileInput.current?.click(); }} title="Cambiar fotografía"><Pencil size={14} /></button><button type="button" onClick={() => removeImage(index)} title="Quitar fotografía"><X size={14} /></button></div>
            </div>)}
            <button type="button" className="admin-add-photo-tile" onClick={() => fileInput.current?.click()}><ImagePlus size={25} /><span>Agregar<br />fotografías</span></button>
          </div>
          <input ref={fileInput} hidden type="file" accept="image/*" multiple onChange={addFiles} />
          <p className="admin-gallery-help">Selecciona una miniatura para cambiar la portada. Puedes quitar o agregar fotografías cuando quieras.</p>
        </section>
        <section className="admin-edit-fields">
          <label>Nombre del producto<input value={product.name} onChange={(e) => update("name", e.target.value)} /></label>
          <label>Descripción<textarea rows={5} value={product.description || ""} onChange={(e) => update("description", e.target.value)} /></label>
          <div className="admin-edit-row"><label>Colección<select value={product.collection} onChange={(e) => update("collection", e.target.value)}><option value="obsidian">Obsidian</option><option value="savia">Savia</option><option value="aurea">Áurea</option><option value="vertice">Vértice</option></select></label><label>Ambiente<select value={product.room} onChange={(e) => update("room", e.target.value)}><option value="sala">Sala</option><option value="comedor">Comedor</option><option value="dormitorio">Dormitorio</option><option value="cocina">Cocina</option><option value="bano">Baño</option><option value="oficina">Oficina</option></select></label></div>
          <label>Materiales<input value={materialValue(product.materials)} onChange={(e) => update("materials", e.target.value)} /></label>
          <label>Medidas<input value={product.dimensions || ""} onChange={(e) => update("dimensions", e.target.value)} /></label>
          <label>Precio<div className="admin-price-input"><span>$</span><input value={product.price || ""} onChange={(e) => update("price", e.target.value)} /></div></label>
          {error && <p className="admin-error">{error}</p>}{message && <p className="admin-success">{message}</p>}
          <button className="admin-primary admin-save-button" disabled={saving || !canSave} type="submit"><Save size={17} />{saving ? "Guardando…" : "Guardar cambios"}</button>
          {!isNew && <div className="admin-danger-zone"><button className="admin-danger-button" type="button" onClick={removeProduct}><Trash2 size={16} /> Eliminar producto</button><small>Esta acción no se puede deshacer.</small></div>}
        </section>
      </form>
    </section>
  </main>;
}
