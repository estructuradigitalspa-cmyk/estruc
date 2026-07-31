import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";

describe("service role database access",()=>{
 it("grants trusted server routes explicit schema privileges",()=>{
  const sql=readFileSync("supabase/migrations/202607310013_service_role_api_access.sql","utf8");
  expect(sql).toContain("grant all privileges on all tables in schema public to service_role");
  expect(sql).toContain("grant execute on all functions in schema public to service_role");
  expect(sql).not.toMatch(/to\s+(anon|authenticated)\b/i);
 });
});