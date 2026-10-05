import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ShoppingBag, UsersRound } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { pageMetadata } from "@/lib/seo";

export const metadata:Metadata=pageMetadata({title:"Ejemplos de páginas web y sistemas",description:"Explora demostraciones conceptuales de una web de servicios, una tienda online y un CRM comercial desarrollables por Estructura Digital.",path:"/portafolio"});

const demos=[
  {title:"Servicios profesionales",type:"Web informativa",description:"Una página clara para presentar servicios, generar confianza y recibir consultas por formulario o WhatsApp.",href:"/demo/servicios-profesionales",icon:BriefcaseBusiness,tags:["5 secciones","Contacto","Responsive"]},
  {title:"Tienda local",type:"Tienda inicial",description:"Catálogo compacto con categorías, productos, carrito y un recorrido sencillo hasta la compra.",href:"/demo/tienda-local",icon:ShoppingBag,tags:["Catálogo","Carrito","10 productos"]},
  {title:"Seguimiento comercial",type:"Sistema y CRM",description:"Panel para ordenar contactos, oportunidades, responsables y próximas acciones del equipo.",href:"/demo/crm-ventas",icon:UsersRound,tags:["Contactos","Pipeline","Tareas"]},
] as const;

export default function Page(){return <><PageHero eyebrow="Demostraciones conceptuales" title="Ejemplos para imaginar tu proyecto antes de comenzar." description="Estos proyectos no corresponden a clientes reales. Son demostraciones creadas para mostrar estructura, diseño y funciones que podemos adaptar a cada negocio."/><section className="section"><div className="container portfolio-grid">{demos.map(({title,type,description,href,icon:Icon,tags})=><article className="portfolio-card" key={href}><div className="portfolio-preview"><Icon size={42}/><span>{type}</span></div><div className="portfolio-body"><p className="eyebrow">Demostración conceptual</p><h2>{title}</h2><p>{description}</p><div className="portfolio-tags">{tags.map(tag=><span key={tag}>{tag}</span>)}</div><Link className="text-link" href={href}>Explorar demostración <ArrowRight size={17}/></Link></div></article>)}</div></section><section className="section section-soft"><div className="container cta"><div><p className="eyebrow">Tu proyecto</p><h2>Podemos usar una base similar y adaptarla a tu negocio.</h2></div><Link className="button button-light" href="/precios">Ver planes y precios <ArrowRight size={18}/></Link></div></section></>}
