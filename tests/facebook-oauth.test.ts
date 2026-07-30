import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Facebook OAuth de producción", () => {
  it("mantiene callbacks separados por propósito", () => {
    expect(fs.existsSync("app/auth/callback/route.ts")).toBe(true);
    expect(fs.existsSync("app/api/auth/meta/callback/route.ts")).toBe(false);
    expect(fs.existsSync("app/api/meta/oauth/callback/route.ts")).toBe(true);
  });

  it("separa Supabase Auth de Embedded Signup", () => {
    const login = fs.readFileSync("components/app-shell/facebook-login-button.tsx", "utf8");
    const signup = fs.readFileSync("components/app-shell/meta-embedded-signup.tsx", "utf8");
    expect(login).toContain('provider: "facebook"');
    expect(login).toContain("/auth/callback?next=${encodeURIComponent(safeInternalPath(next))}");
    expect(signup).toContain("config_id");
    expect(signup).toContain('response_type:"code"');
    expect(signup).toContain("override_default_response_type:true");
  });
});
