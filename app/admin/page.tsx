"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, ClipboardList, LogOut, Package, Plus, Search, Settings2, Users, Trash2, Star } from "lucide-react";
import { products as publicProducts } from "../data";

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
  const [products, setProducts] = useState<Array<{id:string;name:string;collection:string;room:string;images?:string[];description?:string;materials?:string[];dimensions?:string;price?:string}>>([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productMaterials, setProductMaterials] = useState("");
  const [productDimensions, setProductDimensions] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCollection, setProductCollection] = useState("obsidian");
  const [productRoom, setProductRoom] = useState("sala");
  const [productImages, setProductImages] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customers, setCustomers] = useState<Array<{id:string;name:string;phone:string;email:string}>>([]);
  const [quoteCustomer, setQuoteCustomer] = useState("");
  const [quoteProject, setQuoteProject] = useState("");
  useEffect(() => { fetch("/api/admin/products").then(r => r.ok ? r.json() : []).then((items) => setProducts(items.length ? items : publicProducts.map((p) => ({id:p.slug,name:p.name,collection:p.collection,room:"sala",images:p.images})))).catch(() => setProducts([])); fetch("/api/admin/customers").then(r => r.ok ? r.json() : []).then(setCustomers).catch(() => setCustomers([])); }, []);
  const addCustomer = async (event: React.FormEvent) => { event.preventDefault(); const response = await fetch("/api/admin/customers", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({name:customerName, phone:customerPhone, email:customerEmail})}); if(response.ok){ const item=await response.json(); setCustomers([...customers,{id:item.id,name:customerName,phone:customerPhone,email:customerEmail}]); setCustomerName(""); setCustomerPhone(""); setCustomerEmail(""); } };
  const addQuote = async (event: React.FormEvent) => { event.preventDefault(); const response=await fetch("/api/admin/quotes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer_name:quoteCustomer,product_type:quoteProject})}); if(response.ok){setQuotes([{id:Date.now(),customer:quoteCustomer,project:quoteProject,status:"Pendiente",date:new Date().toLocaleDateString("es-GT")},...quotes]);setQuoteCustomer("");setQuoteProject("");} };
  const resetProductForm = () => { setEditingId(null); setProductName(""); setProductDescription(""); setProductMaterials(""); setProductDimensions(""); setProductPrice(""); setProductImages(""); setImageFiles([]); setCoverIndex(0); };
  const startEdit = (p: {id:string;name:string;collection:string;room:string;images?:string[];description?:string;materials?:string[];dimensions?:string;price?:string}) => { setEditingId(p.id); setProductName(p.name); setProductDescription(p.description ?? ""); setProductMaterials((p.materials ?? []).join(", ")); setProductDimensions(p.dimensions ?? ""); setProductPrice(p.price ?? ""); setProductCollection(p.collection); setProductRoom(p.room); setProductImages((p.images ?? []).join(", ")); setImageFiles([]); setCoverIndex(0); };
  const addProduct = async (event: React.FormEvent) => { event.preventDefault(); setSaveError(""); const uploaded:string[]=[]; for (const file of imageFiles) { const form=new FormData(); form.append("file",file); const upload=await fetch("/api/admin/images",{method:"POST",body:form}); if(upload.ok){ const item=await upload.json(); uploaded.push(item.url); } } const existing=productImages.split(",").map(x=>x.trim()).filter(Boolean); const all=[...uploaded,...existing]; if(all.length && coverIndex>0){ const cover=all.splice(coverIndex,1)[0]; all.unshift(cover); } const payload={id:editingId ?? undefined,name:productName,collection:productCollection,room:productRoom,description:productDescription,materials:productMaterials.split(",").map(x=>x.trim()).filter(Boolean),dimensions:productDimensions,price:productPrice || "Precio por confirmar",images:all}; const response = await fetch("/api/admin/products", {method:editingId ? "PUT" : "POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)}); if(response.ok){ if(editingId) setProducts(products.map(p=>p.id===editingId?{...p,...payload,id:editingId}:p)); else { const item=await response.json(); setProducts([...products,{id:item.id,name:productName,collection:productCollection,room:productRoom,images:all,description:productDescription,materials:payload.materials,dimensions:productDimensions,price:payload.price}]); } resetProductForm(); } else { const error=await response.json().catch(()=>({})); setSaveError(error.error ?? "No se pudo guardar. Verifica que el build más reciente esté activo."); } };
