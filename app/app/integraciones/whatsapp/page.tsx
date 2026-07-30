import Link from "next/link";
import { metaBusinessAppId, metaBusinessConfigId } from "@/lib/meta-env";
import { MessageCircle } from "lucide-react";
import { WhatsAppTest } from "@/components/app-shell/whatsapp-test";
import { MetaEmbeddedSignup } from "@/components/app-shell/meta-embedded-signup";
import { WhatsAppConnectionSummary } from "@/components/app-shell/whatsapp-connection-summary";
import { WhatsAppLifecycleControls } from "@/components/app-shell/whatsapp-lifecycle-controls";
import { requireAppContext } from "@/lib/supabase/app-context";

export default async function Page() {
  const { membership } = await requireAppContext();
  return <main className="app-content">
    <div className="app-heading"><span className="app-icon"><MessageCircle/></span><div><p>Integraciones</p><h1>WhatsApp Business</h1><span>Conexión empresarial mediante el SDK oficial de Meta.</span></div></div>
    <MetaEmbeddedSignup appId={metaBusinessAppId()} configId={metaBusinessConfigId()} graphVersion={process.env.META_GRAPH_API_VERSION || "v26.0"}/>
    <WhatsAppConnectionSummary/>
    <WhatsAppLifecycleControls allowed={["owner","admin"].includes(membership.role)}/>
    <WhatsAppTest/>
    <section className="integration-detail"><h2>Seguridad y datos</h2><ul><li>Los códigos y tokens nunca se exponen en la URL ni regresan al navegador.</li><li>Los webhooks requieren firma cuando la integración está activa.</li><li>Solo se procesan eventos del campo <code>messages</code>.</li><li>Los logs no incluyen firmas, tokens ni payloads completos.</li></ul><div className="policy-links"><Link href="/privacidad">Política de privacidad</Link><Link href="/eliminacion-de-datos">Eliminación de datos</Link></div></section>
  </main>;
}
