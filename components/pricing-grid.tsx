import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const plans = [
  {
    name: "Web Informativa",
    price: "$49.990",
    description: "Para emprendedores y negocios que necesitan una presencia clara en internet.",
    features: ["Una página con hasta 5 secciones", "Diseño adaptable a celulares", "Botón de WhatsApp y formulario", "Enlaces a redes sociales", "SEO técnico básico", "Una ronda de correcciones"],
    service: "Web Informativa $49.990",
    label: "Solicitar web informativa",
    featured: false,
  },
  {
    name: "Tienda Inicial",
    price: "$89.990",
    description: "Para comenzar a vender con un catálogo pequeño y una operación sencilla.",
    features: ["Inicio, catálogo, carrito y checkout", "Hasta 10 productos cargados", "Categorías básicas", "Pago mediante transferencia", "Botón de WhatsApp", "Una ronda de correcciones"],
    service: "Tienda Inicial $89.990",
    label: "Solicitar tienda inicial",
    featured: true,
  },
  {
    name: "Proyecto Personalizado",
    price: "Desde $149.990",
    description: "Para páginas, tiendas o funciones que requieren un alcance propio.",
    features: ["Diseño y estructura según necesidad", "Más páginas o productos", "Pasarelas de pago", "Formularios avanzados", "Integraciones y automatizaciones", "Cotización por alcance"],
    service: "Proyecto web personalizado",
    label: "Cotizar proyecto",
    featured: false,
  },
] as const;

export function PricingGrid({compact=false}:{compact?:boolean}) {
  return <div className={`pricing-grid ${compact?"pricing-grid-compact":""}`}>{plans.map((plan)=><article className={plan.featured?"pricing-card featured":"pricing-card"} key={plan.name}>
    {plan.featured&&<span className="pricing-badge">Para vender online</span>}
    <p className="pricing-name">{plan.name}</p>
    <p className="pricing-price">{plan.price}<small> CLP</small></p>
    <p className="pricing-description">{plan.description}</p>
    <ul>{plan.features.map(feature=><li key={feature}><CheckCircle2 size={18}/><span>{feature}</span></li>)}</ul>
    <Link className="button button-primary" href={`/contacto?servicio=${encodeURIComponent(plan.service)}`}>{plan.label}</Link>
  </article>)}</div>;
}
