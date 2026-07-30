import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad, tratamiento y eliminación de datos de Estructura Digital SPA.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <><PageHero eyebrow="Información legal" title="Política de Privacidad" description="Cómo recopilamos, utilizamos, compartimos, protegemos y eliminamos datos personales."/>
    <section className="section"><div className="container legal-layout">
      <aside className="legal-aside">Vigente desde: 29 de julio de 2026<br/><br/>Responsable:<br/>{siteConfig.legalName}<br/>Chile<br/><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></aside>
      <article className="prose">
        <h2>1. Alcance y responsable</h2>
        <p>{siteConfig.legalName} (“Estructura Digital”, “nosotros”) opera este sitio y una plataforma empresarial de automatización, CRM e integraciones. Esta política explica el tratamiento de datos de visitantes, prospectos, clientes, usuarios autorizados y personas cuyos datos son procesados mediante las cuentas de nuestros clientes.</p>
        <p>Actuamos como responsable respecto de los datos de nuestro sitio, ventas, cuentas y soporte. Cuando un cliente usa la plataforma para tratar datos de sus propios contactos, normalmente actuamos como encargado por cuenta de ese cliente, quien determina la finalidad y la base legal.</p>

        <h2>2. Datos que recopilamos</h2>
        <ul>
          <li><strong>Identificación y contacto:</strong> nombre, correo, teléfono, empresa, cargo y contenido de consultas.</li>
          <li><strong>Cuenta y organización:</strong> credenciales gestionadas por el proveedor de autenticación, membresías, roles, preferencias, configuración y actividad.</li>
          <li><strong>Datos operativos:</strong> contactos, conversaciones, mensajes, tareas, oportunidades, automatizaciones y archivos que el cliente ingresa o conecta.</li>
          <li><strong>Datos técnicos:</strong> dirección IP, navegador, dispositivo, fecha, registros de acceso, errores, eventos de seguridad y webhooks.</li>
          <li><strong>Facturación y soporte:</strong> datos comerciales, comprobantes, comunicaciones y antecedentes necesarios para prestar asistencia.</li>
        </ul>

        <h2>3. Meta, WhatsApp, Facebook e Instagram</h2>
        <p>Cuando un administrador autoriza una integración, podemos recibir y tratar información proporcionada por Meta Platforms y sus productos, incluyendo identificadores de usuario, empresa, página, cuenta de WhatsApp Business o Instagram; nombre y correo cuando Facebook Login los entregue; permisos concedidos; tokens de acceso; números de teléfono; plantillas; mensajes y metadatos; estados de entrega; comentarios, eventos y registros técnicos permitidos por las APIs.</p>
        <p>La <strong>WhatsApp Business Platform</strong> se utiliza para enviar, recibir y administrar comunicaciones empresariales autorizadas. Facebook Login u OAuth pueden autenticar al usuario y vincular activos empresariales. Las integraciones con Messenger e Instagram permiten gestionar los eventos y conversaciones que el cliente habilite. Solo solicitamos permisos necesarios para funciones activadas y el administrador puede revocarlos desde Estructura Digital o la configuración de Meta.</p>
        <p>El uso de información recibida de las APIs de Meta se limita a prestar y proteger las funciones solicitadas por el cliente, conforme a las condiciones y políticas aplicables de Meta. No vendemos estos datos ni los usamos para publicidad propia basada en el contenido de mensajes.</p>

        <h2>4. OAuth, tokens y webhooks</h2>
        <p>OAuth permite conectar servicios sin compartir la contraseña con nosotros. Conservamos tokens y secretos de forma restringida durante la vigencia de la integración y los usamos únicamente para ejecutar acciones autorizadas. Los webhooks pueden entregar eventos en tiempo real; validamos su autenticidad cuando el proveedor lo permite, registramos lo necesario para procesarlos y aplicamos controles para evitar duplicados y accesos no autorizados.</p>

        <h2>5. Finalidades y bases de tratamiento</h2>
        <ul>
          <li>Crear y administrar cuentas, organizaciones, permisos e integraciones.</li>
          <li>Prestar automatización, CRM, mensajería, soporte y servicios contratados.</li>
          <li>Responder consultas, preparar propuestas y gestionar la relación comercial.</li>
          <li>Proteger la plataforma, prevenir abuso, investigar incidentes y mantener registros.</li>
          <li>Cumplir contratos, instrucciones documentadas y obligaciones legales.</li>
          <li>Mejorar funcionamiento y experiencia mediante información agregada o anonimizada.</li>
        </ul>
        <p>Según corresponda, tratamos datos para ejecutar un contrato, atender medidas precontractuales, cumplir una obligación legal, proteger intereses legítimos o con consentimiento. El cliente es responsable de contar con una base válida y de entregar los avisos necesarios a sus contactos.</p>

        <h2>6. Cookies y tecnologías similares</h2>
        <p>Usamos cookies o almacenamiento local estrictamente necesarios para sesión, seguridad, preferencias y funcionamiento. Si incorporamos analítica o publicidad no esencial, informaremos su finalidad y solicitaremos consentimiento cuando la normativa aplicable lo requiera. Puedes controlar cookies desde tu navegador, aunque bloquear las necesarias puede impedir el acceso a ciertas funciones.</p>

        <h2>7. Supabase y otros proveedores</h2>
        <p>Utilizamos Supabase para servicios de autenticación, base de datos e infraestructura. También podemos emplear proveedores de alojamiento, correo, monitoreo, seguridad, pagos y soporte, además de Meta cuando una integración está habilitada. Estos proveedores reciben solo los datos necesarios y operan bajo sus propias condiciones y compromisos de protección de datos. Algunos pueden procesar información fuera de Chile; aplicamos salvaguardas contractuales y técnicas razonables cuando corresponde.</p>

        <h2>8. Divulgación de información</h2>
        <p>Podemos compartir datos con proveedores que actúan bajo nuestras instrucciones, con el cliente titular de la organización, por una reorganización empresarial sujeta a confidencialidad o cuando sea necesario para cumplir la ley, una orden válida, proteger derechos o prevenir daño. <strong>No vendemos datos personales.</strong></p>

        <h2>9. Seguridad</h2>
        <p>Aplicamos medidas razonables y proporcionales al riesgo, incluyendo control de acceso por roles, cifrado en tránsito, separación entre organizaciones, gestión de secretos, registros, respaldo y revisión de eventos. Ningún sistema es absolutamente seguro; investigaremos y notificaremos incidentes conforme a las obligaciones aplicables.</p>

        <h2>10. Conservación y eliminación</h2>
        <p>Conservamos datos de cuenta y operación mientras la cuenta o el contrato estén activos y durante el tiempo necesario para soporte, seguridad, resolución de disputas y obligaciones legales. Los tokens se eliminan o invalidan al desconectar la integración, salvo retención técnica breve. Registros de seguridad y respaldos siguen ciclos limitados antes de borrarse o anonimizarse. Las solicitudes verificadas se tramitan normalmente dentro de 30 días corridos, salvo una obligación válida de conservación.</p>

        <h2>11. Derechos del usuario</h2>
        <p>Puedes solicitar acceso, información, rectificación, actualización, portabilidad cuando aplique, oposición, revocación del consentimiento o eliminación. Escribe a <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> desde el correo asociado e indica tu relación con la cuenta. Podemos pedir información razonable para verificar identidad y autoridad. Si los datos pertenecen a un cliente, remitiremos la solicitud a ese responsable o colaboraremos con él.</p>

        <h2>12. Menores, cambios y contacto</h2>
        <p>El servicio es empresarial y no está dirigido a menores de edad. Podemos actualizar esta política para reflejar cambios legales o del servicio; publicaremos la nueva fecha y comunicaremos cambios materiales cuando corresponda.</p>
        <p>Consultas y solicitudes de privacidad: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
      </article>
    </div></section>
  </>;
}
