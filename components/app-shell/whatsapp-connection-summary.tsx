import { requireAppContext } from "@/lib/supabase/app-context";

export async function WhatsAppConnectionSummary() {
  const { supabase, organization } = await requireAppContext();
  const { data: accounts } = await supabase
    .from("integration_accounts")
    .select("business_id,waba_id,phone_number_id,display_name,status,connected_at,metadata")
    .eq("organization_id", organization.id)
    .eq("status", "connected")
    .order("connected_at", { ascending: false });
  if (!accounts?.length) return null;
  return (
    <section className="integration-detail">
      <h2>Activos conectados</h2>
      <div className="app-table-wrap">
        <table className="app-table">
          <thead><tr><th>Nombre</th><th>Business ID</th><th>WABA ID</th><th>Phone Number ID</th><th>Estado</th></tr></thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={`${account.waba_id}:${account.phone_number_id}`}>
                <td>{account.display_name}</td>
                <td><code>{account.business_id}</code></td>
                <td><code>{account.waba_id}</code></td>
                <td><code>{account.phone_number_id}</code></td>
                <td>{account.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
