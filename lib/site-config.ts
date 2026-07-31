const appEnv = process.env.APP_ENV ?? process.env.NEXT_PUBLIC_APP_ENV ?? "development";

export const brand = {
  name: "Elytsa",
  legalEntity: "Estructura Digital SpA",
  relationship: "Elytsa es un producto de Estructura Digital SpA.",
  domain: "elytsa.com",
  contactEmail: "contacto@elytsa.com",
  country: "Chile",
} as const;

export const safetyConfig = {
  appEnv,
  isStaging: appEnv === "staging",
  allowExternalMessages: process.env.ALLOW_EXTERNAL_MESSAGES === "true",
  allowRealWhatsApp: process.env.ALLOW_REAL_WHATSAPP === "true",
  llmProvider: process.env.LLM_PROVIDER || "simulated",
} as const;

export const plans = [
  { id:"inicial", name:"Inicial", monthlyPrice:19990, currency:"CLP", taxIncluded:false, available:true, cta:"Probar Elytsa", limits:"1 empleado de IA · uso mensual razonable", features:["Configuración de servicios","Cotizaciones y agenda","Bandeja central"] },
  { id:"crecimiento", name:"Crecimiento", monthlyPrice:39990, currency:"CLP", taxIncluded:false, available:true, featured:true, cta:"Comenzar", limits:"Hasta 3 empleados · mayor capacidad mensual", features:["Seguimiento y métricas","Más usuarios","Soporte prioritario"] },
  { id:"empresa", name:"Empresa", monthlyPrice:69990, pricePrefix:"Desde", currency:"CLP", taxIncluded:false, available:true, cta:"Conversar con ventas", limits:"Capacidad definida según operación", features:["Reglas e integraciones avanzadas","Configuración asistida","Más empleados y usuarios"] },
] as const;

export const siteConfig = {
  name: brand.name, legalName: brand.legalEntity,
  title: "Elytsa | Empleados de IA para empresas de servicios",
  description: "Empleados de IA que atienden, cotizan, agendan y hacen seguimiento, con control humano para empresas de servicios.",
  url: process.env.NEXT_PUBLIC_SITE_URL || (appEnv === "staging" ? "https://elytsa-staging.vercel.app" : "https://elytsa.com"),
  email: brand.contactEmail, country: brand.country, phone: "+56 9 8225 7474", phoneHref: "+56982257474",
  navigation: [
    { label:"Producto", href:"/#producto" }, { label:"Cómo funciona", href:"/#como-funciona" },
    { label:"Precios", href:"/#precios" }, { label:"Preguntas frecuentes", href:"/#preguntas" },
  ],
} as const;

export function formatPlanPrice(plan: typeof plans[number]) {
  return new Intl.NumberFormat("es-CL", { style:"currency", currency:plan.currency, maximumFractionDigits:0 }).format(plan.monthlyPrice);
}

