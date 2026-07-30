import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Eliminación de Datos", description: "Instrucciones públicas para solicitar la eliminación de datos personales y de integraciones.", alternates: { canonical: "/data-deletion" } };

export default async function DataDeletionPage({searchParams}:{searchParams:Promise<{code?:string}>}) {
  const {code} = await searchParams;
  return <><PageHero eyebrow="Privacidad" title="Eliminación de Datos" description="Puedes solicitar la eliminación de datos asociados a tu cuenta, organización o integración de Meta."/>
    <section className="section"><div className="container legal-layout">
      <aside className="legal-aside">Canal de solicitud<br/><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>{code&&<><br/><br/>Código de confirmación:<br/><code>{code}</code></>}</aside>
      <article className="prose">
        {code&&<div className="alert"><strong>Solicitud recibida.</strong> Conserva el código <code>{code}</code> para consultar su estado.</div>}
        <h2>Cómo solicitar la eliminación</h2>
        <ol><li>Escribe desde el correo asociado a tu cuenta a <a href={`mailto:${siteConfig.email}?subject=Solicitud%20de%20eliminación%20de%20datos`}>{siteConfig.email}</a>.</li><li>Indica nombre, correo, empresa y tu relación con la organización.</li><li>Identifica la cuenta, integración de Meta, página, número de WhatsApp Business o activo correspondiente.</li><li>Solicita confirmación y conserva el código que te entreguemos.</li></ol>
        <p>También puedes desconectar Estructura Digital desde la configuración de Integraciones comerciales de Facebook o Meta. Revocar permisos impide accesos futuros, pero no siempre elimina datos previamente almacenados; por eso recomendamos completar la solicitud anterior.</p>
        <h2>Qué datos eliminamos</h2><p>Después de verificar identidad y autoridad, eliminaremos o anonimizaremos, según corresponda: perfil y datos de cuenta; membresías de organización; tokens y credenciales de integraciones; identificadores de Meta; contactos, conversaciones, mensajes, automatizaciones y configuraciones vinculadas; y otros datos personales que no debamos conservar.</p>
        <h2>Plazos</h2><p>Confirmaremos la recepción y procuraremos completar la eliminación dentro de <strong>30 días corridos</strong>. Si la solicitud es compleja o requiere antecedentes, informaremos la extensión y su motivo. La revocación de tokens se procesa al desconectar la integración o validar la solicitud.</p>
        <h2>Conservación limitada</h2><p>Podemos conservar registros mínimos por obligaciones legales, prevención de fraude, seguridad, defensa de derechos o resolución de disputas. Las copias de respaldo se eliminan conforme a ciclos técnicos limitados y quedan aisladas del uso ordinario hasta su eliminación.</p>
        <h2>Solicitudes enviadas por Meta</h2><p>Meta puede enviar una solicitud firmada a <code>/api/meta/data-deletion</code>. El sistema valida la firma, registra el evento y devuelve una URL de estado y un código de confirmación. El flujo está preparado para asociar posteriormente la solicitud con usuarios, organizaciones e integraciones; en esta etapa no ejecuta borrado automático para evitar eliminaciones no verificadas.</p>
        <h2>Contacto</h2><p>Para iniciar una solicitud o consultar su estado: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
      </article>
    </div></section>
  </>;
}
