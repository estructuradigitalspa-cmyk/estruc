import type { Metadata } from "next";
import { ServiceLanding } from "@/components/service-landing";
import { commercialServices } from "@/content/commercial-services";
import { pageMetadata } from "@/lib/seo";
export const metadata:Metadata=pageMetadata({title:"Desarrollo de software a medida",description:"Desarrollo de software a medida, sistemas web y herramientas internas para empresas en Chile.",path:"/software-a-medida"});
export default function Page(){return <ServiceLanding {...commercialServices.software}/>}
