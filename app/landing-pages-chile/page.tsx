import type { Metadata } from "next";
import { ServiceLanding } from "@/components/service-landing";
import { commercialServices } from "@/content/commercial-services";
import { pageMetadata } from "@/lib/seo";
export const metadata:Metadata=pageMetadata({title:"Landing pages en Chile para campañas",description:"Diseño y desarrollo de landing pages rápidas, medibles y optimizadas para convertir campañas de Google Ads en oportunidades.",path:"/landing-pages-chile"});
export default function Page(){return <ServiceLanding {...commercialServices.landing}/>}
