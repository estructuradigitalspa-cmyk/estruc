import {describe,expect,it} from "vitest";
import fs from "node:fs";
const script=fs.readFileSync("tools/verify-production-env.mjs","utf8");
describe("production environment contract",()=>{
  it("pins canonical public identifiers",()=>{for(const value of ["https://estructuradigital.cl","https://ocmcyhimhndlxlicojrs.supabase.co","1048232064232330","2487731658317049","2608678896249332","v26.0"])expect(script).toContain(value)});
  it("requires separated secrets and fails closed",()=>{for(const name of ["META_LOGIN_APP_SECRET","META_BUSINESS_APP_SECRET","META_VERIFY_TOKEN","META_OAUTH_STATE_SECRET","SUPABASE_SERVICE_ROLE_KEY","RESEND_API_KEY","CRON_SECRET"])expect(script).toContain(name);expect(script).toContain("process.exitCode = 1")});
  it("reports legacy compatibility without printing values",()=>{for(const name of ["META_APP_ID","META_APP_SECRET","META_CONFIG_ID","META_TOKEN_ENCRYPTION_KEY"])expect(script).toContain(name);expect(script).not.toContain("console.log(process.env")});
});