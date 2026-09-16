"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, ClipboardList, LogOut, Package, Plus, Search, Settings2, Users } from "lucide-react";

const ADMIN_EMAIL = "stahleegt@gmail.com";
const statuses = ["Pendiente", "En proceso", "Cotizada", "Cerrada"] as const;

type Quote = { id:number; customer:string; project:string; status:typeof statuses[number]; date:string };
const initialQuotes: Quote[] = [
  {id:1, customer:"Aún no hay solicitudes", project:"Las nuevas cotizaciones aparecerán aquí", status:"Pendiente", date:"—"}
];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [section, setSection] = useState("Resumen");
  const [query, setQuery] = useState("");
  const [quotes, setQuotes] = useState(initialQuotes);
  const [products, setProducts] = useState<Array<{id:string;name:string;collection:string;room:string}>>([]);
  const [productName, setProductName] = useState("");
  const [productCollection, setProductCollection] = useState("obsidian");
  const [productRoom, setProductRoom] = useState("sala");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customers, setCustomers] = useState<Array<{id:string;name:string;phone:string;email:string}>>([]);
  const [quoteCustomer, setQuoteCustomer] = useState("");
  const [quoteProject, setQuoteProject] = useState("");
  useEffect(() => { fetch("/api/admin/products").then(r => r.ok ? r.json() : []).then(setProducts).catch(() => setProducts([])); fetch("/api/admin/customers").then(r => r.ok ? r.json() : []).then(setCustomers).catch(() => setCustomers([])); }, []);
  const addCustomer = async (event: React.FormEvent) => { event.preventDefault(); const response = await fetch("/api/admin/customers", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({name:customerName, phone:customerPhone, email:customerEmail})}); if(response.ok){ const item=await response.json(); setCustomers([...customers,{id:item.id,name:customerName,phone:customerPhone,email:customerEmail}]); setCustomerName(""); setCustomerPhone(""); setCustomerEmail(""); } };
  const addQuote = async (event: React.FormEvent) => { event.preventDefault(); const response=await fetch("/api/admin/quotes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer_name:quoteCustomer,product_type:quoteProject})}); if(response.ok){setQuotes([{id:Date.now(),customer:quoteCustomer,project:quoteProject,status:"Pendiente",date:new Date().toLocaleDateString("es-GT")},...quotes]);setQuoteCustomer("");setQuoteProject("");} };
  const addProduct = async (event: React.FormEvent) => { event.preventDefault(); const response = await fetch("/api/admin/products", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({name:productName, collection:productCollection, room:productRoom})}); if(response.ok){ const item=await response.json(); setProducts([...products,{id:item.id,name:productName,collection:productCollection,room:productRoom}]); setProductName(""); } };

  const filteredQuotes = useMemo(() => quotes.filter((q) =>
    [q.customer, q.project, q.status].join(" ").toLowerCase().includes(query.toLowerCase())
  ), [quotes, query]);

  if (!authorized) {
    return <main className="admin-auth"><div className="admin-auth-card"><div className="admin-mark">S</div><p className="admin-eyebrow">STAHLÉ · PANEL PRIVADO</p><h1>Administración</h1><p>Acceso exclusivo para el equipo de Stahlé.</p><form onSubmit={async (event) => { event.preventDefault(); setAuthError(false); const response = await fetch("/api/admin/auth", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({password}) }); if (response.ok) setAuthorized(true); else setAuthError(true); }}><label>Contraseña de administrador<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña privada" required /></label>{authError && <small className="admin-error">Contraseña incorrecta.</small>}<button className="admin-primary" type="submit">Entrar al panel</button></form></div></main>;
  }

  const nav = [
    {label:"Resumen", icon:BarChart3},
    {label:"Productos", icon:Package},
    {label:"Clientes", icon:Users},
    {label:"Cotizaciones", icon:ClipboardList},
    {label:"Configuración", icon:Settings2}
  ];

  return <main className="admin-shell"><aside className="admin-sidebar"><div className="admin-brand"><span>S</span><div>STAHLÉ<small>ADMIN</small></div></div><nav>{nav.map(({label,icon:Icon}) => <button key={label} className={section===label ? "active" : ""} onClick={() => setSection(label)}><Icon size={17}/>{label}</button>)}</nav><button className="admin-logout" onClick={() => setAuthorized(false)}><LogOut size={16}/>Cerrar sesión</button></aside><section className="admin-main"><header className="admin-header"><div><p className="admin-eyebrow">PANEL PRIVADO</p><h1>{section}</h1></div><div className="admin-user"><span>Administrador</span><b>SE</b></div></header>{section==="Resumen" && <><div className="admin-welcome"><div><p className="admin-eyebrow">CONTROL DE STAHLÉ</p><h2>Todo lo importante,<br/><em>en un solo lugar.</em></h2><p>Administra tu catálogo, clientes y solicitudes de cotización.</p></div><button className="admin-primary" onClick={() => setSection("Productos")}><Plus size={16}/>Agregar producto</button></div><div className="admin-stats"><article><Package/><span>Productos</span><strong>0</strong><small>Por registrar</small></article><article><Users/><span>Clientes</span><strong>0</strong><small>Por registrar</small></article><article><ClipboardList/><span>Cotizaciones</span><strong>0</strong><small>Sin solicitudes</small></article><article><BarChart3/><span>En proceso</span><strong>0</strong><small>Este periodo</small></article></div><div className="admin-panel"><div className="admin-panel-head"><div><p className="admin-eyebrow">SEGUIMIENTO</p><h3>Solicitudes recientes</h3></div><button className="admin-link" onClick={() => setSection("Cotizaciones")}>Ver todas</button></div><div className="admin-empty"><ClipboardList size={28}/><p>Aún no hay solicitudes de cotización.</p><small>Cuando un cliente solicite un diseño, aparecerá aquí.</small></div></div></>}{section==="Productos" && <div className="admin-panel"><div className="admin-panel-head"><div><p className="admin-eyebrow">CATÁLOGO</p><h3>Productos</h3></div></div><form className="admin-product-form" onSubmit={addProduct}><input value={productName} onChange={e=>setProductName(e.target.value)} placeholder="Nombre del producto" required/><select value={productCollection} onChange={e=>setProductCollection(e.target.value)}><option value="obsidian">Obsidian</option><option value="savia">Savia</option><option value="aurea">Áurea</option><option value="vertice">Vértice</option></select><select value={productRoom} onChange={e=>setProductRoom(e.target.value)}><option value="sala">Sala</option><option value="comedor">Comedor</option><option value="dormitorio">Dormitorio</option><option value="cocina">Cocina</option><option value="bano">Baño</option><option value="oficina">Oficina</option></select><button className="admin-primary" type="submit"><Plus size={16}/>Guardar producto</button></form>{products.length===0 ? <div className="admin-empty"><Package size={28}/><p>Aún no hay productos administrables.</p></div> : <div className="admin-table">{products.map(p=><div className="admin-table-row" key={p.id}><span>{p.name}</span><span>{p.collection}</span><span>{p.room}</span><button className="admin-link" type="button">Editar</button></div>)}</div>}</div>}{section==="Clientes" && <div className="admin-panel"><div className="admin-panel-head"><div><p className="admin-eyebrow">RELACIONES</p><h3>Clientes</h3></div></div><form className="admin-product-form" onSubmit={addCustomer}><input value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder="Nombre completo" required/><input value={customerPhone} onChange={e=>setCustomerPhone(e.target.value)} placeholder="Teléfono"/><input type="email" value={customerEmail} onChange={e=>setCustomerEmail(e.target.value)} placeholder="Correo"/><button className="admin-primary" type="submit"><Plus size={16}/>Guardar cliente</button></form>{customers.length===0 ? <div className="admin-empty"><Users size={28}/><p>Aún no hay clientes registrados.</p></div> : <div className="admin-table">{customers.map(c=><div className="admin-table-row" key={c.id}><span>{c.name}</span><span>{c.phone}</span><span>{c.email}</span><span>Registrado</span></div>)}</div>}</div>}{section==="Cotizaciones" && <div className="admin-panel"><div className="admin-panel-head"><div><p className="admin-eyebrow">VENTAS</p><h3>Cotizaciones</h3></div><label className="admin-search"><Search size={16}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar solicitud"/></label></div><form className="admin-product-form" onSubmit={addQuote}><input value={quoteCustomer} onChange={e=>setQuoteCustomer(e.target.value)} placeholder="Cliente" required/><input value={quoteProject} onChange={e=>setQuoteProject(e.target.value)} placeholder="Proyecto o mueble" required/><button className="admin-primary" type="submit"><Plus size={16}/>Nueva cotización</button></form><div className="admin-table"><div className="admin-table-row admin-table-head"><span>Cliente</span><span>Proyecto</span><span>Estado</span><span>Fecha</span></div>{filteredQuotes.map(q=><div className="admin-table-row" key={q.id}><span>{q.customer}</span><span>{q.project}</span><span><i className="status-dot"/>{q.status}</span><span>{q.date}</span></div>)}</div></div>}{section==="Configuración" && <div className="admin-panel"><p className="admin-eyebrow">SEGURIDAD</p><h3>Acceso administrativo</h3><p className="admin-note">El acceso está reservado para <strong>{ADMIN_EMAIL}</strong>. La protección definitiva del enlace se completará con Cloudflare Access antes de publicar este panel.</p></div>}</section></main>;
}
