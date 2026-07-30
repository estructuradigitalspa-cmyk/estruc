type GraphError = { error?: { message?: string; code?: number } };
type GraphList<T> = GraphError & { data?: T[] };

export type MetaBusiness = { id: string; name?: string };
export type MetaWaba = { id: string; name?: string };
export type MetaPhone = {
  id: string;
  display_phone_number?: string;
  verified_name?: string;
  quality_rating?: string;
};

async function graph<T>(path: string, token: string, init?: RequestInit) {
  const version = process.env.META_GRAPH_API_VERSION || "v26.0";
  const response = await fetch(`https://graph.facebook.com/${version}/${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  const body = (await response.json().catch(() => ({}))) as T & GraphError;
  if (!response.ok) {
    throw new Error(`Meta Graph ${body.error?.code ?? response.status}: ${body.error?.message ?? "request failed"}`);
  }
  return body;
}

export async function exchangeMetaCode(code: string) {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  if (!appId || !appSecret) throw new Error("Credenciales Meta incompletas.");
  const redirectUri = "https://estructuradigital.cl/api/meta/oauth/callback";
  const params = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    redirect_uri: redirectUri,
    code,
  });
  const response = await fetch(
    `https://graph.facebook.com/${process.env.META_GRAPH_API_VERSION || "v26.0"}/oauth/access_token?${params}`,
    { cache: "no-store" },
  );
  const body = (await response.json()) as { access_token?: string; token_type?: string; expires_in?: number } & GraphError;
  if (!response.ok || !body.access_token) throw new Error(body.error?.message || "Meta rechazó el código.");
  return body;
}

export async function discoverWhatsAppAssets(token: string) {
  const businesses = await graph<GraphList<MetaBusiness>>("me/businesses?fields=id,name&limit=100", token);
  const result: Array<{ business: MetaBusiness; waba: MetaWaba; phones: MetaPhone[] }> = [];
  for (const business of businesses.data ?? []) {
    const wabas = await graph<GraphList<MetaWaba>>(
      `${business.id}/owned_whatsapp_business_accounts?fields=id,name&limit=100`,
      token,
    );
    for (const waba of wabas.data ?? []) {
      const phones = await graph<GraphList<MetaPhone>>(
        `${waba.id}/phone_numbers?fields=id,display_phone_number,verified_name,quality_rating&limit=100`,
        token,
      );
      result.push({ business, waba, phones: phones.data ?? [] });
    }
  }
  return result;
}

export async function subscribeWaba(wabaId: string, token: string) {
  return graph<{ success?: boolean }>(`${wabaId}/subscribed_apps`, token, {
    method: "POST",
    body: JSON.stringify({ subscribed_fields: ["messages"] }),
  });
}
