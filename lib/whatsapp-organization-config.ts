import { createAdminClient } from "@/lib/supabase/admin";
import { decryptMetaToken } from "@/lib/meta-token-decrypt";
import { getWhatsAppServerConfig } from "@/lib/whatsapp";

export async function getOrganizationWhatsAppConfig(organizationId: string) {
  const admin = createAdminClient();
  const { data: account } = await admin
    .from("integration_accounts")
    .select("phone_number_id,waba_id,encrypted_credentials")
    .eq("organization_id", organizationId)
    .eq("status", "connected")
    .not("phone_number_id", "is", null)
    .not("encrypted_credentials", "is", null)
    .order("connected_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (account?.phone_number_id && account.encrypted_credentials) {
    return {
      phoneNumberId: account.phone_number_id as string,
      wabaId: account.waba_id as string | null,
      accessToken: decryptMetaToken(account.encrypted_credentials as string),
      version: process.env.META_GRAPH_API_VERSION || "v26.0",
      source: "organization" as const,
    };
  }
  const fallback = getWhatsAppServerConfig();
  return { ...fallback, wabaId: process.env.META_WABA_ID || null, source: "test" as const };
}
