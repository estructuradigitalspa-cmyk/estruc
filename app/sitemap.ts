import type { MetadataRoute } from "next"; import { safetyConfig,siteConfig } from "@/lib/site-config";
export default function sitemap():MetadataRoute.Sitemap{return safetyConfig.isStaging?[]:["","/privacidad","/terminos","/seguridad"].map(path=>({url:`${siteConfig.url}${path}`,lastModified:new Date(),changeFrequency:path===""?"weekly":"monthly",priority:path===""?1:.6}))}
