export const siteConfig = {
  name: "Estructura Digital", legalName: "Estructura Digital SPA",
  description: "Software, automatización e integraciones para organizar, conectar y digitalizar operaciones empresariales.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://estructuradigital.cl",
  email: "contacto@estructuradigital.cl", phone: "+56 9 8225 7474", phoneHref: "+56982257474", country: "Chile",
  navigation: [
    { label: "Servicios", href: "/servicios" }, { label: "Soluciones", href: "/soluciones" },
    { label: "Plataforma", href: "/plataforma" }, { label: "Proveedor de tecnología", href: "/proveedor-tecnologia" },
    { label: "Nosotros", href: "/nosotros" },
  ],
} as const;
