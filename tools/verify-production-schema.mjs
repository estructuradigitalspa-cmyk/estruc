const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("PRODUCTION_SCHEMA_ENV_MISSING");
  process.exit(1);
}

const response = await fetch(`${url}/rest/v1/`, {
  headers: {
    apikey: serviceRoleKey,
    authorization: `Bearer ${serviceRoleKey}`,
  },
});

if (!response.ok) {
  console.error(`PRODUCTION_SCHEMA_HTTP_${response.status}`);
  process.exit(1);
}

const schema = await response.json();
const paths = schema.paths ?? {};
const columns = schema.definitions?.integration_accounts?.properties ?? {};
const checks = {
  oauth_nonces: Boolean(paths["/oauth_nonces"]),
  rate_limit_buckets: Boolean(paths["/rate_limit_buckets"]),
  organization_invitations: Boolean(paths["/organization_invitations"]),
  integration_accounts_safe: Boolean(paths["/integration_accounts_safe"]),
  consume_oauth_nonce: Boolean(paths["/rpc/consume_oauth_nonce"]),
  consume_rate_limit: Boolean(paths["/rpc/consume_rate_limit"]),
  claim_webhook_events: Boolean(paths["/rpc/claim_webhook_events"]),
  invite_member: Boolean(paths["/rpc/invite_member"]),
  accept_invitation: Boolean(paths["/rpc/accept_invitation"]),
  change_member_role: Boolean(paths["/rpc/change_member_role"]),
  remove_member: Boolean(paths["/rpc/remove_member"]),
  transfer_ownership: Boolean(paths["/rpc/transfer_ownership"]),
  created_by: Boolean(columns.created_by),
  encrypted_credentials: Boolean(columns.encrypted_credentials),
  last_validated_at: Boolean(columns.last_validated_at),
};

console.log(JSON.stringify(checks));

if (Object.values(checks).some((value) => !value)) {
  process.exitCode = 2;
}
