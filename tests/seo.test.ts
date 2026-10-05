import {describe,expect,it} from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import {pageMetadata} from "@/lib/seo";

describe("SEO público",()=>{
  it("publica solo URLs canónicas en el sitemap",()=>{const entries=sitemap();expect(entries).toHaveLength(21);expect(new Set(entries.map(entry=>entry.url)).size).toBe(entries.length);expect(entries.every(entry=>!entry.lastModified)).toBe(true)});
  it("protege rutas privadas, demos y anuncia el sitemap",()=>{const result=robots();const rules=Array.isArray(result.rules)?result.rules[0]:result.rules;expect(rules?.disallow).toContain("/app/");expect(rules?.disallow).toContain("/api/");expect(rules?.disallow).toContain("/TKW");expect(result.sitemap).toContain("/sitemap.xml")});
  it("genera canonical y metadata social coherentes",()=>{const result=pageMetadata({title:"Prueba",description:"Descripción verificable",path:"/prueba"});expect(result.alternates).toEqual({canonical:"/prueba"});expect(result.openGraph).toMatchObject({title:"Prueba | Estructura Digital",url:"https://estructuradigital.cl/prueba"});expect(result.twitter).toMatchObject({title:"Prueba | Estructura Digital"})});
});
