import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap():MetadataRoute.Sitemap {
  const paths=["","/precios","/portafolio","/paginas-web-para-empresas","/diseno-web-chile","/landing-pages-chile","/software-a-medida","/automatizacion-de-procesos","/crm-para-pymes","/crm-whatsapp","/servicios","/soluciones","/plataforma","/integraciones","/nosotros","/contacto","/privacidad","/terminos","/eliminacion-de-datos","/seguridad","/proveedor-tecnologia"];
  return paths.map(path=>({url:`${siteConfig.url}${path}`,changeFrequency:path===""?"weekly":"monthly",priority:path===""?1:.7}));
}
