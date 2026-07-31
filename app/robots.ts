import type { MetadataRoute } from "next"; import { safetyConfig,siteConfig } from "@/lib/site-config";
export default function robots():MetadataRoute.Robots{return safetyConfig.isStaging?{rules:{userAgent:"*",disallow:"/"}}:{rules:{userAgent:"*",allow:"/",disallow:["/api/","/app/","/onboarding"]},sitemap:`${siteConfig.url}/sitemap.xml`,host:siteConfig.url}}
