import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { WhatsAppTest } from "@/components/app-shell/whatsapp-test";
import { MetaOAuthConnect } from "@/components/app-shell/meta-oauth-connect";
import { WhatsAppConnectionSummary } from "@/components/app-shell/whatsapp-connection-summary";

export default async function Page({ searchParams }: { searchParams: Promise<{ meta?: string }> }) {
  const params = await searchParams;
  return <main className="app-content">
    <div className="app-heading"><span className="app-icon"><MessageCircle/></span><div><p>Integraciones</p><h1>WhatsApp Business</h1><span>Conexión empresarial mediante el SDK oficial de Meta.</span></div></div>
    <MetaOAuthConnect configured={Boolean(process.env.META_APP_ID && process.env.META_CONFIG_ID && process.env.META_OAUTH_STATE_SECRET)} status={params.meta}/>
    <WhatsAppConnectionSummary/>
    <WhatsAppTest/>
    <section className="integration-detail"><h2>Seguridad y datos</h2><ul><li>Los códigos y tokens nunca se exponen en la URL ni regresan al navegador.</li><li>Los webhooks requieren firma cuando la integración está activa.</li><li>Solo se procesan eventos del campo <code>messages</code>.</li><li>Los logs no incluyen firmas, tokens ni payloads completos.</li></ul><div className="policy-links"><Link href="/privacidad">Política de privacidad</Link><Link href="/eliminacion-de-datos">Eliminación de datos</Link></div></section>
  </main>;
}
