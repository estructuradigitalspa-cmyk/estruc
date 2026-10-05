"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

const labels:Record<string,string>={"/precios":"Precios","/paginas-web-para-empresas":"Páginas web para empresas","/diseno-web-chile":"Diseño web en Chile","/landing-pages-chile":"Landing pages en Chile","/software-a-medida":"Software a medida","/automatizacion-de-procesos":"Automatización de procesos","/crm-para-pymes":"CRM para pymes","/crm-whatsapp":"CRM con WhatsApp","/servicios":"Servicios","/soluciones":"Soluciones","/plataforma":"Plataforma","/integraciones":"Integraciones","/proveedor-tecnologia":"Proveedor de tecnología","/nosotros":"Nosotros","/contacto":"Contacto","/privacidad":"Privacidad","/terminos":"Términos","/eliminacion-de-datos":"Eliminación de datos","/seguridad":"Seguridad"};

export function Breadcrumbs(){const path=usePathname(),label=labels[path];if(!label)return null;const schema={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Inicio",item:siteConfig.url},{"@type":"ListItem",position:2,name:label,item:`${siteConfig.url}${path}`}]};return <div className="breadcrumb-shell"><nav className="container breadcrumbs" aria-label="Migas de pan"><Link href="/">Inicio</Link><span aria-hidden="true">/</span><span aria-current="page">{label}</span></nav><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/></div>}
