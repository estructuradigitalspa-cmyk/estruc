import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots():MetadataRoute.Robots {
  return {
    rules:{userAgent:"*",allow:"/",disallow:["/api/","/app/","/TKW","/onboarding","/seleccionar-organizacion","/aceptar-invitacion","/iniciar-sesion","/registro","/recuperar-contrasena","/actualizar-contrasena"]},
    sitemap:`${siteConfig.url}/sitemap.xml`,
    host:siteConfig.url,
  };
}
