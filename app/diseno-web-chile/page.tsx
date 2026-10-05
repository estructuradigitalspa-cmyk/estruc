import type { Metadata } from "next";
import { ServiceLanding } from "@/components/service-landing";
import { commercialServices } from "@/content/commercial-services";
import { pageMetadata } from "@/lib/seo";
export const metadata:Metadata=pageMetadata({title:"Diseño web profesional en Chile",description:"Agencia de diseño web en Chile para empresas que necesitan una presencia profesional, rápida y enfocada en conversión.",path:"/diseno-web-chile"});
export default function Page(){return <ServiceLanding {...commercialServices.design}/>}
