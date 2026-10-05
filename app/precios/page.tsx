import type { Metadata } from "next";
import { PricingGrid } from "@/components/pricing-grid";
import { PageHero } from "@/components/page-hero";
import { pageMetadata } from "@/lib/seo";

export const metadata:Metadata=pageMetadata({title:"Precios de páginas web y tiendas online",description:"Páginas web informativas desde $49.990 y tiendas online con carrito desde $89.990 en Chile. Alcance y adicionales claramente definidos.",path:"/precios"});

const extras = [
  ["Sección adicional","$10.000"],
  ["Página interior adicional","$15.000"],
  ["Carga de 10 productos","$15.000"],
  ["Formulario avanzado","Desde $20.000"],
  ["Google Analytics y conversiones","$20.000"],
  ["Ficha de Google Business","$25.000"],
  ["Integración Mercado Pago","Desde $30.000"],
  ["Integración Webpay","Desde $50.000"],
  ["Integración o automatización","Desde $99.990"],
  ["Desarrollo personalizado","Desde $199.990"],
] as const;

export default function Page(){return <>
  <PageHero eyebrow="Planes y precios" title="Precios claros para comenzar sin pagar por funciones que no necesitas." description="Elige una base simple y agrega únicamente lo necesario. Antes de comenzar dejamos por escrito el contenido, los plazos y cualquier costo adicional."/>
  <section className="section"><div className="container"><PricingGrid/></div></section>
  <section className="section section-soft"><div className="container two-col pricing-conditions"><div><p className="eyebrow">Qué debes considerar</p><h2>El precio se mantiene cuando el alcance también se mantiene.</h2><p>Los planes económicos funcionan con estructuras probadas, contenidos entregados por el cliente y una ronda de correcciones. Las funciones no incluidas se presupuestan antes de implementarlas.</p></div><ul className="check-list"><li>50% para comenzar y 50% antes de publicar.</li><li>El plazo comienza al recibir textos, logo e imágenes.</li><li>Dominio, hosting, plataformas y comisiones se pagan por separado.</li><li>La Tienda Inicial no incluye programación personalizada.</li><li>Los cambios posteriores a la aprobación se cotizan aparte.</li></ul></div></section>
  <section className="section"><div className="container"><div className="section-heading"><p className="eyebrow">Adicionales</p><h2>Amplía el proyecto cuando realmente lo necesites.</h2><p>Estos valores permiten estimar el presupuesto. La cotización final confirma compatibilidad, cantidad y alcance.</p></div><div className="extras-table">{extras.map(([name,price])=><div key={name}><span>{name}</span><strong>{price}</strong></div>)}</div></div></section>
  <section className="section section-dark"><div className="container two-col"><div><p className="eyebrow">Costos recurrentes</p><h2>Hosting y soporte sin contratos difíciles de entender.</h2></div><div className="support-plans"><p><strong>Hosting básico</strong><span>$39.990 al año</span></p><p><strong>Hosting + mantenimiento</strong><span>$7.990 al mes</span></p><p><strong>Plan comercio</strong><span>$12.990 al mes</span></p><small>El dominio y los servicios de terceros pueden contratarse directamente a nombre del cliente.</small></div></div></section>
  <section className="section section-soft"><div className="container faq-layout"><div><p className="eyebrow">Preguntas frecuentes</p><h2>Antes de contratar.</h2></div><div className="faq-list"><details><summary>¿La web de $49.990 es autoadministrable?</summary><p>No. Es una página informativa plana y optimizada. Si necesitas editar contenidos mediante un panel, se cotiza como adicional o proyecto personalizado.</p></details><details><summary>¿La tienda de $89.990 acepta pagos con tarjeta?</summary><p>El plan base incluye transferencia. Mercado Pago, Webpay u otras pasarelas se agregan según compatibilidad y tienen un costo de configuración adicional.</p></details><details><summary>¿Incluyen dominio y hosting?</summary><p>No están incluidos en el precio de creación. Puedes contratarlos directamente o utilizar nuestros planes de hosting y mantenimiento.</p></details><details><summary>¿Qué tengo que entregar?</summary><p>Logo, colores si los tienes, textos, imágenes y datos de contacto. Para una tienda también necesitamos una planilla con productos, precios, descripciones y fotografías.</p></details></div></div></section>
</>}
