"use client";
import {use,useEffect,useState} from "react";
import {ArrowLeft,ArrowRight} from "lucide-react";
import {Header,Footer} from "../../components";
import {collections,products as seedProducts,getCollection} from "../../data";

type Product=typeof seedProducts[number];
function parse<T>(value:unknown,fallback:T):T{
  if(Array.isArray(value))return value as T;
  if(typeof value==="string"){try{return JSON.parse(value) as T}catch{return fallback}}
  return fallback;
}
function normalize(row:Record<string,unknown>):Product{
  const base=seedProducts.find(p=>p.slug===String(row.id||row.slug));
  return {...(base||{slug:String(row.id||row.slug),type:"Mueble",status:"Fabricación bajo pedido",stats:[],tagline:"",description:"",materials:[],dimensions:"",images:[]}),
    slug:String(row.id||row.slug),name:String(row.name||base?.name||"Producto Stahlé"),
    collection:String(row.collection||base?.collection||"savia"),room:String(row.room||base?.room||"oficina"),
    type:String(row.type||base?.type||"Mueble"),price:String(row.price||base?.price||"Precio por confirmar"),
    description:String(row.description||base?.description||""),materials:parse<string[]>(row.materials,base?.materials||[]),
    dimensions:String(row.dimensions||base?.dimensions||""),images:parse<string[]>(row.images,base?.images||[])
  } as Product;
}
function merge(items:Product[]){
  const map=new Map<string,Product>();
  for(const item of items){const key=item.slug||item.name.trim().toLowerCase();if(key)map.set(key,item)}
  return [...map.values()];
}
export default function Page({params}:{params:Promise<{slug:string}>}){
  const{slug}=use(params); const c=getCollection(slug); const [items,setItems]=useState<Product[]>(seedProducts.filter(p=>p.collection===slug));
  useEffect(()=>{
    const local=JSON.parse(window.localStorage.getItem("stahle_admin_products")||"[]") as Record<string,unknown>[];
    const localItems=local.map(normalize);
    if(localItems.length)setItems(merge([...seedProducts,...localItems]).filter(p=>p.collection===slug));
    fetch("/api/admin/products",{cache:"no-store"}).then(r=>r.ok?r.json():[]).then((rows:Record<string,unknown>[])=>{
      if(Array.isArray(rows))setItems(merge([...seedProducts,...localItems,...rows.map(normalize)]).filter(p=>p.collection===slug));
    }).catch(()=>undefined);
  },[slug]);
  if(!c)return null;
  return <main><Header/><section className="inner-hero" style={{backgroundImage:`linear-gradient(90deg,rgba(9,8,7,.9),rgba(9,8,7,.25)),url('${c.image}')`}}><a href="/#colecciones" className="back"><ArrowLeft size={16}/> Colecciones</a><div><p className="kicker">{c.eyebrow}</p><h1>Colección<br/><em>{c.name}</em></h1><p>{c.description}</p></div></section><section className="section catalog"><div className="section-head"><div><p className="kicker">LA COLECCIÓN</p><h2>Piezas <em>{c.name}</em></h2></div><p>{c.material}</p></div>{items.length?<div className="product-grid">{items.map(p=><a href={`/producto/${p.slug}`} className="product-card" key={p.slug}><img src={p.images[0]||"/hero-stahle.png"} alt={p.name}/><div><p>{p.type}</p><h3>{p.name}</h3><span>{p.price}</span><b>Ver pieza <ArrowRight size={15}/></b></div></a>)}</div>:<div className="empty"><p className="kicker">PRÓXIMAMENTE</p><h3>Estamos preparando las primeras piezas de {c.name}.</h3><p>Esta colección crecerá conforme nuevos diseños estén listos para fabricación.</p><a className="btn ghost" href="/cotizar">Cotizar una pieza en este estilo</a></div>}</section><Footer/></main>
}