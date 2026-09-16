"use client";

import { useMemo, useState } from "react";
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

  return <main className="admin-shell"><aside className="admin-sidebar"><div className="admin-brand"><span>S</span><div>STAHLÉ<small>ADMIN</small></div></div><nav>{nav.map(({label,icon:Icon}) => <button key={label} className={section===label ? "active" : ""} onClick={() => setSection(label)}><Icon size={17}/>{label}</button>)}</nav><button className="admin-logout" onClick={() => setAuthorized(false)}><LogOut size={16}/>Cerrar sesión</button></aside><section className="admin-main"><header className="admin-header"><div><p className="admin-eyebrow">PANEL PRIVADO</p><h1>{section}</h1></div><div className="admin-user"><span>Administrador</span><b>SE</b></div></header>{section==="Resumen" && <><div className="admin-welcome"><div><p className="admin-eyebrow">CONTROL DE STAHLÉ</p><h2>Todo lo importante,<br/><em>en un solo lugar.</em></h2><p>Administra tu catálogo, clientes y solicitudes de cotización.</p></div><button className="admin-primary" onClick={() => setSection("Productos")}><Plus size={16}/>Agregar producto</button></div><div className="admin-stats"><article><Package/><span>Productos</span><strong>0</strong><small>Por registrar</small></article><article><Users/><span>Clientes</span><strong>0</strong><small>Por registrar</small></article><article><ClipboardList/><span>Cotizaciones</span><strong>0</strong><small>Sin solicitudes</small></article><article><BarChart3/><span>En proceso</span><strong>0</strong><small>Este periodo</small></article></div><div className="admin-panel"><div className="admin-panel-head"><div><p className="admin-eyebrow">SEGUIMIENTO</p><h3>Solicitudes recientes</h3></div><button className="admin-link" onClick={() => setSection("Cotizaciones")}>Ver todas</button></div><div className="admin-empty"><ClipboardList size={28}/><p>Aún no hay solicitudes de cotización.</p><small>Cuando un cliente solicite un diseño, aparecerá aquí.</small></div></div></>}{section==="Productos" && <div className="admin-panel"><div className="admin-panel-head"><div><p className="admin-eyebrow">CATÁLOGO</p><h3>Productos</h3></div><button className="admin-primary"><Plus size={16}/>Nuevo producto</button></div><div className="admin-empty"><Package size={28}/><p>Aún no hay productos administrables.</p><small>El formulario permitirá registrar colección, ambiente, materiales, medidas, precio e imágenes.</small></div></div>}{section==="Clientes" && <div className="admin-panel"><div className="admin-panel-head"><div><p className="admin-eyebrow">RELACIONES</p><h3>Clientes</h3></div><button className="admin-primary"><Plus size={16}/>Nuevo cliente</button></div><div className="admin-empty"><Users size={28}/><p>Aún no hay clientes registrados.</p></div></div>}{section==="Cotizaciones" && <div className="admin-panel"><div className="admin-panel-head"><div><p className="admin-eyebrow">VENTAS</p><h3>Cotizaciones</h3></div><label className="admin-search"><Search size={16}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar solicitud"/></label></div><div className="admin-table"><div className="admin-table-row admin-table-head"><span>Cliente</span><span>Proyecto</span><span>Estado</span><span>Fecha</span></div>{filteredQuotes.map(q=><div className="admin-table-row" key={q.id}><span>{q.customer}</span><span>{q.project}</span><span><i className="status-dot"/>{q.status}</span><span>{q.date}</span></div>)}</div></div>}{section==="Configuración" && <div className="admin-panel"><p className="admin-eyebrow">SEGURIDAD</p><h3>Acceso administrativo</h3><p className="admin-note">El acceso está reservado para <strong>{ADMIN_EMAIL}</strong>. La protección definitiva del enlace se completará con Cloudflare Access antes de publicar este panel.</p></div>}</section></main>;
}
