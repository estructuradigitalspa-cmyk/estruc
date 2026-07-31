import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";

describe("service agent relations",()=>{
 it("disambiguates the agent versions relationship for PostgREST",()=>{
  const source=readFileSync("lib/service-agent-runner.ts","utf8");
  expect(source).toContain("service_agent_versions!service_agent_versions_agent_id_fkey(*)");
  expect(source).not.toContain('select("*,service_agent_versions(*)")');
  for(const path of ["app/api/agents/route.ts","app/app/agentes/page.tsx","app/app/agentes/[id]/page.tsx"]){
   expect(readFileSync(path,"utf8")).toContain("service_agent_versions!service_agent_versions_agent_id_fkey");
  }
 });
});