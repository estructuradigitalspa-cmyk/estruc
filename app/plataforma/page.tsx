import type { Metadata } from "next"; import { PageHero } from "@/components/page-hero";
import { pageMetadata } from "@/lib/seo";
export const metadata:Metadata=pageMetadata({title:"Plataforma para CRM, procesos y comunicaciones",description:"Plataforma modular proyectada para centralizar comunicaciones, clientes, procesos, tareas, métricas y automatizaciones.",path:"/plataforma"});
const modules=[
  ["Bandeja multicanal","Centralización proyectada de conversaciones autorizadas para conservar contexto y responsables."],
  ["CRM y contactos","Organización de contactos, historial, etapas comerciales y próximos pasos."],
  ["Automatizaciones","Reglas y eventos para ejecutar tareas repetitivas con trazabilidad y manejo de excepciones."],
  ["Inteligencia artificial","Apoyo proyectado para clasificación, análisis y respuestas bajo criterios de supervisión."],
  ["Tareas y calendarios","Asignación de responsables, fechas, recordatorios y seguimiento operativo."],
  ["Métricas","Consultas y paneles construidos desde las fuentes de datos disponibles."],
  ["Administración de usuarios","Gestión de miembros y acceso dentro de cada organización."],
  ["Integraciones","Conexión con canales y sistemas mediante mecanismos técnicos autorizados."],
  ["Permisos por rol","Separación de capacidades según las responsabilidades de cada usuario."],
] as const;
export default function Page(){return <><PageHero eyebrow="Plataforma Estructura" title="Un entorno para centralizar comunicaciones, procesos y clientes." description="Plataforma SaaS proyectada para conectar la atención, la gestión comercial y la operación empresarial desde una base modular."/><section className="section"><div className="container"><div className="alert"><strong>Estado del producto.</strong> Algunas funciones pueden encontrarse en desarrollo, piloto o sujetas a aprobación de plataformas externas. La disponibilidad se confirma según cada implementación.</div><div className="content-grid">{modules.map(([name,description],n)=><article className="detail-card" key={name}><span className="label">Módulo proyectado {String(n+1).padStart(2,"0")}</span><h2>{name}</h2><p>{description}</p></article>)}</div><div className="prose"><h2>Implementación modular</h2><p>La plataforma se plantea como una base gradual: cada organización habilita únicamente los componentes definidos para su proceso, sus usuarios y los accesos técnicos disponibles. La configuración, los permisos y las integraciones se validan antes de ampliar el alcance.</p><p>Consulta las <a href="/integraciones">integraciones previstas</a>, revisa las <a href="/soluciones">necesidades que puede abordar</a> o <a href="/contacto">solicita una evaluación de tu proceso</a>.</p></div><p className="notice">Meta, WhatsApp, Instagram y Facebook no respaldan oficialmente este producto. Son plataformas de terceros y cualquier integración depende de sus permisos, condiciones y procesos de revisión.</p></div></section></>}
