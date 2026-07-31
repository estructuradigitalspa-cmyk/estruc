import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";

describe("service agent runner relation",()=>{
 it("disambiguates the agent versions relationship for PostgREST",()=>{
  const source=readFileSync("lib/service-agent-runner.ts","utf8");
  expect(source).toContain("service_agent_versions!service_agent_versions_agent_id_fkey(*)");
  expect(source).not.toContain('select("*,service_agent_versions(*)")');
 });
});