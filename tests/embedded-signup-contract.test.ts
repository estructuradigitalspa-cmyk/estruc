import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Embedded Signup contract", () => {
  const start = fs.readFileSync("app/api/meta/oauth/start/route.ts", "utf8");
  const callback = fs.readFileSync("app/api/meta/embedded-signup/session/route.ts", "utf8");
  const migration = fs.readFileSync("supabase/migrations/202607300003_embedded_signup.sql", "utf8");

  it("usa callback canónico y permisos mínimos requeridos", () => {
    expect(start).toContain("https://estructuradigital.cl/api/meta/oauth/callback");
    expect(start).not.toContain('oauth.searchParams.set("scope"');
    expect(start).toContain("config_id");
  });
  it("protege OAuth con state firmado y cookie segura", () => {
    expect(start).toContain('httpOnly: true');
    expect(start).toContain('secure: true');
    expect(start).toContain('sameSite: "lax"');
    expect(callback).toContain("verifyMetaOAuthState");
    expect(callback).toContain("consume_oauth_nonce");
  });
  it("persiste activos por organización y suscribe la WABA", () => {
    for (const field of ["business_id", "waba_id", "phone_number_id", "connected_at"]) {
      expect(migration).toContain(field);
    }
    expect(callback).toContain("subscribeWaba");
    expect(callback).toContain("encrypted_credentials");
  });
});
