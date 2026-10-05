import type { Metadata } from "next";
import { ServiceLanding } from "@/components/service-landing";
import { commercialServices } from "@/content/commercial-services";
import { pageMetadata } from "@/lib/seo";
export const metadata:Metadata=pageMetadata({title:"Automatización de procesos empresariales",description:"Automatización de procesos para reducir tareas manuales, conectar sistemas y mejorar la trazabilidad de empresas en Chile.",path:"/automatizacion-de-procesos"});
export default function Page(){return <ServiceLanding {...commercialServices.automation}/>}
