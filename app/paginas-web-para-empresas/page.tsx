import type { Metadata } from "next";
import { ServiceLanding } from "@/components/service-landing";
import { commercialServices } from "@/content/commercial-services";
import { pageMetadata } from "@/lib/seo";
export const metadata:Metadata=pageMetadata({title:"Páginas web desde $49.990 en Chile",description:"Páginas web informativas desde $49.990 y tiendas online con carrito desde $89.990 para empresas y emprendedores en Chile.",path:"/paginas-web-para-empresas"});
export default function Page(){return <ServiceLanding {...commercialServices.websites}/>}
