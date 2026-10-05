export const siteConfig = {
  name: "Estructura Digital", legalName: "Estructura Digital SPA",
  title: "Estructura Digital | Páginas web y software para empresas",
  description: "Creamos páginas web, software a medida, automatizaciones y CRM para empresas en Chile.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://estructuradigital.cl",
  email: "contacto@estructuradigital.cl", phone: "+56 9 8845 5230", phoneHref: "+56988455230", country: "Chile",
  whatsappUrl: "https://wa.me/56988455230?text=Hola%20Sebasti%C3%A1n%2C%20vi%20la%20web%20de%20Estructura%20Digital%20y%20quiero%20cotizar.",
  navigation: [
    { label: "Páginas web", href: "/paginas-web-para-empresas" }, { label: "Software", href: "/software-a-medida" },
    { label: "Automatización", href: "/automatizacion-de-procesos" }, { label: "Precios", href: "/precios" }, { label: "Portafolio", href: "/portafolio" },
    { label: "Nosotros", href: "/nosotros" },
  ],
} as const;

