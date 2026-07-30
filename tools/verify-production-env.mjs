const expected = {
  NEXT_PUBLIC_SITE_URL: "https://estructuradigital.cl",
  META_PRIVACY_POLICY_URL: "https://estructuradigital.cl/privacidad",
  META_TERMS_URL: "https://estructuradigital.cl/terminos",
  META_DATA_DELETION_URL: "https://estructuradigital.cl/eliminacion-de-datos",
  NEXT_PUBLIC_SUPABASE_URL: "https://ocmcyhimhndlxlicojrs.supabase.co",
  META_LOGIN_APP_ID: "1048232064232330",
  META_BUSINESS_APP_ID: "2487731658317049",
  META_BUSINESS_CONFIG_ID: "2608678896249332",
  META_GRAPH_API_VERSION: "v26.0",
  ENABLE_GLOBAL_WHATSAPP_FALLBACK: "false",
};
const requiredSecrets = ["NEXT_PUBLIC_SUPABASE_ANON_KEY","SUPABASE_SERVICE_ROLE_KEY","META_LOGIN_APP_SECRET","META_BUSINESS_APP_SECRET","META_VERIFY_TOKEN","META_OAUTH_STATE_SECRET","META_TOKEN_ENCRYPTION_KEY_V1","CRON_SECRET","RESEND_API_KEY"];
const requiredOperational = ["CONTACT_FROM_EMAIL","CONTACT_TO_EMAIL","CONTACT_REPLY_TO_EMAIL","META_TOKEN_ENCRYPTION_ACTIVE_VERSION","RATE_LIMIT_CONTACT","RATE_LIMIT_WHATSAPP_USER","RATE_LIMIT_WHATSAPP_ORG","RATE_LIMIT_META_ATTEMPTS","RATE_LIMIT_DATA_DELETION","WEBHOOK_WORKER_BATCH_SIZE"];
const legacy = ["META_APP_ID","META_APP_SECRET","META_CONFIG_ID","META_TOKEN_ENCRYPTION_KEY"];
const failures = [];
const warnings = [];
for (const [name, value] of Object.entries(expected)) {
  if (!process.env[name]) failures.push(`${name}: missing`);
  else if (process.env[name] !== value) failures.push(`${name}: unexpected value`);
}
for (const name of [...requiredSecrets, ...requiredOperational]) if (!process.env[name]) failures.push(`${name}: missing`);
if (process.env.META_TOKEN_ENCRYPTION_ACTIVE_VERSION && !['v1','v2'].includes(process.env.META_TOKEN_ENCRYPTION_ACTIVE_VERSION)) failures.push("META_TOKEN_ENCRYPTION_ACTIVE_VERSION: unsupported");
for (const name of legacy) if (process.env[name]) warnings.push(`${name}: legacy compatibility still enabled`);
console.log(JSON.stringify({status:failures.length?"blocked":"ready",checked:Object.keys(expected).length+requiredSecrets.length+requiredOperational.length,failures,warnings},null,2));
if (failures.length) process.exitCode = 1;