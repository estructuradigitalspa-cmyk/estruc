import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers3, ShieldCheck } from "lucide-react";
import { MultiChannel } from "@/components/multi-channel";
import { SectionHeading } from "@/components/section-heading";
import { PricingGrid } from "@/components/pricing-grid";
import { workflow } from "@/content/site-content";

const offers=[
  ["Páginas web para empresas","Una presencia profesional preparada para SEO, campañas y generación de contactos.","/paginas-web-para-empresas"],
  ["Landing pages","Páginas enfocadas en convertir una oferta y medir cada contacto.","/landing-pages-chile"],
  ["Software a medida","Sistemas web y herramientas internas construidas alrededor de tu operación.","/software-a-medida"],
  ["Automatización de procesos","Flujos que reducen tareas manuales y conectan tus herramientas.","/automatizacion-de-procesos"],
  ["CRM para pymes","Contactos, oportunidades y seguimiento comercial en un solo lugar.","/crm-para-pymes"],
  ["CRM con WhatsApp","Conversaciones conectadas con clientes, tareas y responsables.","/crm-whatsapp"],
] as const;

export default function HomePage(){return <>
  <section className="hero section"><div className="container hero-grid">
    <div><p className="eyebrow">Páginas web · Software · Automatización</p><h1>Creamos tecnología para conseguir clientes y hacer crecer tu empresa.</h1><p className="lead">Diseñamos páginas web profesionales, software a medida y automatizaciones que convierten ideas y procesos en soluciones claras, medibles y listas para operar.</p><div className="button-row"><Link className="button button-primary" href="/paginas-web-para-empresas">Quiero una página web <ArrowRight size={18}/></Link><Link className="button button-secondary" href="/contacto">Cuéntanos tu proyecto</Link></div></div>
    <div className="structure-card" aria-label="Servicios conectados"><div className="structure-top"><span>Estructura Digital</span><span>Chile</span></div><div className="structure-core"><Layers3/><strong>Una solución clara</strong><span>Estrategia, diseño y desarrollo</span></div><div className="structure-nodes">{["Web","Software","CRM","Automatización"].map(i=><span key={i}>{i}</span>)}</div></div>
  </div></section>
  <section className="section section-soft"><div className="container"><SectionHeading eyebrow="Servicios" title="Empieza por la solución que tu empresa necesita hoy" description="Cada servicio tiene un alcance propio, una página preparada para posicionarse y un camino claro para cotizar."/><div className="commercial-grid">{offers.map(([title,description,href])=><article key={href}><h2>{title}</h2><p>{description}</p><Link className="text-link" href={href}>Ver servicio <ArrowRight size={17}/></Link></article>)}</div></div></section>
  <section className="section"><div className="container"><SectionHeading eyebrow="Precios claros" title="Comienza con una solución simple y amplíala cuando lo necesites" description="Planes con alcance definido para evitar costos inesperados y comenzar rápido."/><PricingGrid compact/><div className="pricing-more"><Link className="text-link" href="/precios">Ver condiciones, adicionales y hosting <ArrowRight size={17}/></Link></div></div></section>
  <section className="section section-soft"><div className="container"><SectionHeading eyebrow="Método" title="Cómo trabajamos" description="Un proceso trazable, desde el diagnóstico hasta la mejora continua."/><ol className="steps">{workflow.map((s,n)=><li key={s}><span>{String(n+1).padStart(2,"0")}</span><strong>{s}</strong></li>)}</ol></div></section>
  <section className="section section-dark"><div className="container"><SectionHeading eyebrow="Enfoque" title="Construimos para vender, operar y aprender con datos" description="No se trata solo de publicar una página o entregar software: conectamos propuesta, experiencia, medición y continuidad." inverse/><div className="solution-list">{["Mensaje y oferta claros","Diseño adaptable","Rendimiento técnico","SEO desde la estructura","Conversiones medibles","Integraciones autorizadas","Desarrollo por etapas","Soporte y evolución"].map(i=><div key={i}><CheckCircle2 size={18}/><span>{i}</span></div>)}</div></div></section>
  <MultiChannel/>
  <section className="section"><div className="container trust-grid"><div><p className="eyebrow">Confianza técnica</p><h2>Una base preparada para operar con control.</h2></div><div className="trust-items">{["Control de acceso","Trazabilidad","Protección de datos","Arquitectura modular","Documentación","Monitoreo y respaldo"].map(i=><div key={i}><ShieldCheck size={20}/><span>{i}</span></div>)}</div></div></section>
  <section className="section"><div className="container cta"><div><p className="eyebrow">Próximo paso</p><h2>Conversemos sobre lo que necesitas lanzar o mejorar.</h2></div><Link className="button button-light" href="/contacto">Solicitar propuesta <ArrowRight size={18}/></Link></div></section>
</>}
