export const siteConfig = {
  name: "Estructura Digital", legalName: "Estructura Digital SPA",
  title: "Estructura Digital | Automatización, IA y CRM para Empresas",
  description: "Plataforma de automatización empresarial con inteligencia artificial, CRM e integraciones con WhatsApp, Messenger e Instagram.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://estructuradigital.cl",
  email: "contacto@estructuradigital.cl", phone: "+56 9 8225 7474", phoneHref: "+56982257474", country: "Chile",
  navigation: [
    { label: "Servicios", href: "/servicios" }, { label: "Soluciones", href: "/soluciones" },
    { label: "Plataforma", href: "/plataforma" }, { label: "Integraciones", href: "/integraciones" }, { label: "Proveedor de tecnología", href: "/proveedor-tecnologia" },
    { label: "Nosotros", href: "/nosotros" },
  ],
} as const;

