import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {brand,plans,safetyConfig,siteConfig} from "@/lib/site-config";
const read=(path:string)=>readFileSync(path,"utf8");
describe("Elytsa commercial contract",()=>{
 it("centralizes product, legal and domain identity",()=>{expect(brand).toMatchObject({name:"Elytsa",legalEntity:"Estructura Digital SpA",domain:"elytsa.com",contactEmail:"contacto@elytsa.com"});expect(siteConfig.name).toBe(brand.name)});
 it("centralizes the three Chilean plans without unlimited claims",()=>{expect(plans.map(p=>p.monthlyPrice)).toEqual([19990,39990,69990]);expect(JSON.stringify(plans).toLowerCase()).not.toContain("ilimitado")});
 it("renders core landing claims and truthful simulation disclosure",()=>{const page=read("app/page.tsx");for(const value of ["Crear mi empleado de IA","Recepcionista IA","Ejecutivo Comercial IA","Agendador IA","SIMULADO","Preguntas frecuentes"])expect(page).toContain(value)});
 it("starts onboarding with employee selection",()=>{const page=read("app/onboarding/page.tsx");expect(page).toContain("¿Qué empleado de IA quieres incorporar primero?");expect(page).toContain("Configuración completa")});
 it("keeps external gates and simulated provider safe by default",()=>{expect(safetyConfig.allowExternalMessages).toBe(false);expect(safetyConfig.allowRealWhatsApp).toBe(false);expect(safetyConfig.llmProvider).toBe("simulated");const env=read(".env.staging.example");expect(env).toContain("ALLOW_EXTERNAL_MESSAGES=false");expect(env).toContain("ALLOW_REAL_WHATSAPP=false")});
 it("blocks staging indexing",()=>{const robots=read("app/robots.ts");expect(robots).toContain('disallow:"/"');expect(read("app/layout.tsx")).toContain("index:false,follow:false")});
 it("provides an inert analytics adapter with required events",()=>{const analytics=read("lib/analytics.ts");for(const event of ["landing_view","pricing_view","onboarding_started","employee_created","booking_created","handoff_created"])expect(analytics).toContain(event)});
});
