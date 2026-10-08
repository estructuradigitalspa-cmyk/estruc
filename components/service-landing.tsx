import { ArrowRight, CheckCircle2, CircleDollarSign, Clock3, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { TrackedWhatsAppLink } from "@/components/tracked-whatsapp-link";

export type ServiceLandingProps = {
  eyebrow: string;
  title: string;
  description: string;
  outcomes: string[];
  deliverables: string[];
  process: { title: string; description: string }[];
  idealFor: string[];
  faqs: { question: string; answer: string }[];
  cta: string;
  serviceName: string;
};

export function ServiceLanding(props: ServiceLandingProps) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: props.serviceName,
        description: props.description,
        provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        areaServed: { "@type": "Country", name: "Chile" },
      },
      {
        "@type": "FAQPage",
        mainEntity: props.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return <>
    <section className="service-hero section">
      <div className="container service-hero-grid">
        <div>
          <p className="eyebrow">{props.eyebrow}</p>
          <h1>{props.title}</h1>
          <p className="lead">{props.description}</p>
          <div className="button-row">
            <TrackedWhatsAppLink className="button button-primary" serviceName={props.serviceName}>Cotizar por WhatsApp<ArrowRight size={18}/></TrackedWhatsAppLink>
            <a className="button button-secondary" href={`tel:${siteConfig.phoneHref}`}>Llamar ahora</a>
          </div>
        </div>
        <aside className="offer-card" aria-label="Resumen del servicio">
          <p>Una implementación clara</p>
          <div><Clock3/><span><strong>Alcance por etapas</strong>Definimos prioridades, plazos y responsables.</span></div>
          <div><CircleDollarSign/><span><strong>Cotización transparente</strong>Separamos lo esencial de las mejoras futuras.</span></div>
          <div><ShieldCheck/><span><strong>Base preparada para crecer</strong>Rendimiento, seguridad y medición desde el inicio.</span></div>
        </aside>
      </div>
    </section>

    <section className="section section-soft"><div className="container two-col service-outcomes">
      <div><p className="eyebrow">Resultado</p><h2>Una solución útil desde el primer lanzamiento.</h2></div>
      <ul className="check-list">{props.outcomes.map((item)=><li key={item}><CheckCircle2 size={20}/><span>{item}</span></li>)}</ul>
    </div></section>

    <section className="section"><div className="container">
      <div className="section-heading"><p className="eyebrow">Qué incluye</p><h2>Un alcance pensado para producir resultados.</h2></div>
      <div className="deliverable-grid">{props.deliverables.map((item,index)=><article key={item}><span>{String(index+1).padStart(2,"0")}</span><h3>{item}</h3></article>)}</div>
    </div></section>

    <section className="section section-dark"><div className="container">
      <div className="section-heading inverse"><p className="eyebrow">Proceso</p><h2>De la necesidad a una solución operativa.</h2></div>
      <div className="process-grid">{props.process.map((step,index)=><article key={step.title}><span>{String(index+1).padStart(2,"0")}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div>
    </div></section>

    <section className="section"><div className="container two-col">
      <div><p className="eyebrow">Para quién es</p><h2>Conviene cuando necesitas avanzar con un objetivo concreto.</h2></div>
      <ul className="check-list">{props.idealFor.map((item)=><li key={item}><CheckCircle2 size={20}/><span>{item}</span></li>)}</ul>
    </div></section>

    <section className="section section-soft"><div className="container faq-layout">
      <div><p className="eyebrow">Preguntas frecuentes</p><h2>Lo que conviene definir antes de comenzar.</h2></div>
      <div className="faq-list">{props.faqs.map((faq)=><details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>
    </div></section>

    <section className="section"><div className="container cta"><div><p className="eyebrow">Siguiente paso</p><h2>Cuéntanos qué necesitas y te proponemos un alcance inicial.</h2></div><TrackedWhatsAppLink className="button button-light" serviceName={props.serviceName}>Hablar con Sebastián<ArrowRight size={18}/></TrackedWhatsAppLink></div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
  </>;
}
