import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export function pageMetadata({title,description,path}:{title:string;description:string;path:string}):Metadata {
  const url=new URL(path,siteConfig.url).toString();
  return {
    title,description,alternates:{canonical:path},
    openGraph:{type:"website",locale:"es_CL",url,siteName:siteConfig.name,title:`${title} | ${siteConfig.name}`,description,images:[{url:"/og.png",width:1536,height:1024,alt:`${title} — ${siteConfig.name}`}]},
    twitter:{card:"summary_large_image",title:`${title} | ${siteConfig.name}`,description,images:["/og.png"]},
  };
}
