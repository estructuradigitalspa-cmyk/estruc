import { createCipheriv, createDecipheriv, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";

const apply = process.argv.includes("--apply");
const limitArg = process.argv.find((value) => value.startsWith("--limit="));
const limit = Math.max(1, Math.min(Number(limitArg?.split("=")[1] || 50), 100));
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const active = process.env.META_TOKEN_ENCRYPTION_ACTIVE_VERSION || "v1";
if (!url || !serviceRole) throw new Error("SUPABASE_ADMIN_ENV_MISSING");
if (!['v1','v2'].includes(active)) throw new Error("ACTIVE_VERSION_INVALID");

function key(version) {
  const encoded = process.env[`META_TOKEN_ENCRYPTION_KEY_${version.toUpperCase()}`] || (version === 'v1' ? process.env.META_TOKEN_ENCRYPTION_KEY : undefined);
  const value = encoded ? Buffer.from(encoded, 'base64') : Buffer.alloc(0);
  if (value.length !== 32) throw new Error(`KEY_${version.toUpperCase()}_INVALID`);
  return value;
}
function decrypt(value) {
  const [version,iv,tag,ciphertext] = value.split('.');
  if (!['v1','v2'].includes(version) || !iv || !tag || !ciphertext) throw new Error('CIPHERTEXT_INVALID');
  const decipher=createDecipheriv('aes-256-gcm',key(version),Buffer.from(iv,'base64url'));
  decipher.setAuthTag(Buffer.from(tag,'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(ciphertext,'base64url')),decipher.final()]);
}
function encrypt(plaintext) {
  const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key(active),iv);
  const ciphertext=Buffer.concat([cipher.update(plaintext),cipher.final()]);
  return `${active}.${iv.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}.${ciphertext.toString('base64url')}`;
}
async function api(path, init={}) {
  const response=await fetch(`${url}/rest/v1/${path}`,{...init,headers:{apikey:serviceRole,authorization:`Bearer ${serviceRole}`,'content-type':'application/json',prefer:'return=representation',...init.headers}});
  if(!response.ok) throw new Error(`SUPABASE_${response.status}`);
  return response.status===204?null:response.json();
}
const rows=await api(`integration_accounts?select=id,encrypted_credentials&encrypted_credentials=not.is.null&limit=${limit}`);
const pending=rows.filter((row)=>!String(row.encrypted_credentials).startsWith(`${active}.`));
console.log(JSON.stringify({mode:apply?'apply':'dry_run',active_version:active,scanned:rows.length,pending:pending.length,limit}));
if(!apply) process.exit(0);
if(process.env.META_ROTATION_CONFIRM!==`rotate-to-${active}`) throw new Error('ROTATION_CONFIRMATION_MISSING');
const rotationId=randomUUID();
await api('rpc/backup_integration_credentials',{method:'POST',body:JSON.stringify({rotation:rotationId,account_ids:pending.map((row)=>row.id)})});
let updated=0,skipped=0;
for(const row of pending){
  const plaintext=decrypt(row.encrypted_credentials);
  const replacement=encrypt(plaintext);
  const verified=decrypt(replacement);
  if(plaintext.length!==verified.length||!timingSafeEqual(plaintext,verified)) throw new Error(`INTEGRITY_${row.id}`);
  plaintext.fill(0);verified.fill(0);
  const result=await api('rpc/replace_integration_credential',{method:'POST',body:JSON.stringify({account_id:row.id,expected_ciphertext:row.encrypted_credentials,replacement_ciphertext:replacement})});
  if(result===true){updated++;console.log(JSON.stringify({id:row.id,result:'updated'}));}else{skipped++;console.log(JSON.stringify({id:row.id,result:'concurrent_skip'}));}
}
console.log(JSON.stringify({rotation_id:rotationId,updated,skipped}));
