import type { Metadata } from "next";
import { ServiceLanding } from "@/components/service-landing";
import { commercialServices } from "@/content/commercial-services";
import { pageMetadata } from "@/lib/seo";
export const metadata:Metadata=pageMetadata({title:"CRM para pymes y empresas",description:"Implementación de CRM para pymes: contactos, oportunidades, tareas, automatizaciones y reportes adaptados al proceso comercial.",path:"/crm-para-pymes"});
export default function Page(){return <ServiceLanding {...commercialServices.crm}/>}
