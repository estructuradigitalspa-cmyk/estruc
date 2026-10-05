import type { Metadata } from "next";
import { ServiceLanding } from "@/components/service-landing";
import { commercialServices } from "@/content/commercial-services";
import { pageMetadata } from "@/lib/seo";
export const metadata:Metadata=pageMetadata({title:"CRM con WhatsApp integrado",description:"Integra WhatsApp con tu CRM para centralizar conversaciones, contactos, tareas y seguimiento comercial mediante canales autorizados.",path:"/crm-whatsapp"});
export default function Page(){return <ServiceLanding {...commercialServices.whatsapp}/>}
