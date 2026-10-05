import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { TrackedContactLink } from "@/components/tracked-contact-link";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";

export const metadata:Metadata=pageMetadata({title:"Contacto",description:"Conversa con Estructura Digital en Chile sobre desarrollo de software, automatización, CRM, inteligencia artificial e integraciones.",path:"/contacto"});

export default function Page(){return <><PageHero eyebrow="Contacto" title="Cuéntanos qué necesitas lanzar o mejorar." description="Describe tu objetivo, el contexto actual y el resultado que esperas. Te responderemos con próximos pasos claros."/><section className="section"><div className="container contact-grid"><div><h2>Hablemos</h2><p>Atendemos proyectos y consultas comerciales desde Chile.</p><div className="contact-list"><TrackedContactLink href={`mailto:${siteConfig.email}`} event="email_click"><Mail size={19}/>{siteConfig.email}</TrackedContactLink><TrackedContactLink href={`tel:${siteConfig.phoneHref}`} event="phone_click"><Phone size={19}/>{siteConfig.phone}</TrackedContactLink><span><MapPin size={19}/>{siteConfig.country}</span></div><p className="notice">No publicamos una dirección exacta mientras no esté confirmada. Los datos comerciales se mantendrán actualizados en esta página.</p></div><Suspense fallback={<div className="form-card">Cargando formulario…</div>}><ContactForm/></Suspense></div></section></>}
