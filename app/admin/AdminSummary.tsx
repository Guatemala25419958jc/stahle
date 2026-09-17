"use client";

import { ArrowRight, BarChart3, Clock3, Image as ImageIcon, Package, Pencil, Plus, Trash2 } from "lucide-react";

type Product = { id:string; name:string; collection:string; room:string; images?:string[] };

export function AdminSummary({ products, onGallery, onAdd }: { products:Product[]; onGallery:()=>void; onAdd:()=>void }) {
  const photoCount = products.reduce((total, product) => total + (product.images?.length ?? 0), 0);
  return <div className="admin-summary-new">
    <div className="admin-summary-hero"><div><p className="admin-eyebrow">PANEL PRIVADO</p><h2>Tu galería,<br/><em>bajo control.</em></h2><p>Agrega, organiza y retira piezas de tu catálogo.</p></div><button className="admin-primary admin-summary-cta" onClick={onAdd}><Plus size={18}/>Administrar galería</button></div>
    <div className="admin-stats admin-gallery-stats"><article><Package/><span>Productos publicados</span><strong>{products.length}</strong><small>Piezas en tu catálogo</small></article><article><ImageIcon/><span>Fotografías</span><strong>{photoCount}</strong><small>Imágenes disponibles</small></article><article><Clock3/><span>Última actualización</span><strong>Hoy</strong><small>Catálogo activo</small></article></div>
    <div className="admin-summary-columns"><div className="admin-panel admin-recent-panel"><div className="admin-panel-head"><div><p className="admin-eyebrow">CATÁLOGO</p><h3>Productos recientes</h3></div><button className="admin-link" onClick={onGallery}>Ver todos <ArrowRight size={14}/></button></div>{products.length===0 ? <div className="admin-empty"><Package size={28}/><p>Aún no hay productos publicados.</p><small>Agrega tu primera pieza desde Administrar galería.</small></div> : <div className="admin-recent-grid">{products.slice(0,3).map(product=><article className="admin-recent-card" key={product.id}>{product.images?.[0] ? <img src={product.images[0]} alt={product.name}/> : <div className="admin-recent-placeholder"><Package size={24}/></div>}<div><strong>{product.name}</strong><small>{product.collection}</small><button className="admin-link" onClick={onGallery}><Pencil size={13}/>Editar</button></div></article>)}</div>}</div><aside className="admin-panel admin-activity"><p className="admin-eyebrow">ACTIVIDAD</p><h3>Actividad reciente</h3><div className="admin-activity-list"><div><ImageIcon/><span>Catálogo disponible<strong>{products.length} productos publicados</strong><small>Ahora</small></span></div><div><Pencil/><span>Gestión simplificada<strong>Administra tu galería desde un solo lugar</strong><small>Listo para usar</small></span></div><div><Trash2/><span>Control total<strong>Agrega, edita o elimina piezas</strong><small>Siempre actualizado</small></span></div></div></aside></div>
  </div>;
}
