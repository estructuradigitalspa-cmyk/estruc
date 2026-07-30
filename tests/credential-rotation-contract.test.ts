import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync("supabase/migrations/202607300005_credential_rotation.sql", "utf8");
const script = readFileSync("tools/rotate-meta-token-credentials.mjs", "utf8");

describe("contrato de rotación de credenciales", () => {
  it("mantiene la migración aditiva y respaldos protegidos", () => {
    expect(migration).toContain("create table if not exists public.credential_rotation_backups");
    expect(migration).toContain("backup_integration_credentials");
    expect(migration).toContain("replace_integration_credential");
    expect(migration).toContain("auth.role() <> 'service_role'");
    expect(migration).toContain("on delete restrict");
    expect(migration).not.toMatch(/drop table|truncate|delete from public\.integration_accounts/i);
  });

  it("usa dry-run por defecto, confirmación explícita y compare-and-swap", () => {
    expect(script).toContain('process.argv.includes("--apply")');
    expect(script).toContain("ROTATION_CONFIRMATION_MISSING");
    expect(script).toContain("expected_ciphertext");
    expect(script).toContain("concurrent_skip");
  });

  it("reintenta solo errores transitorios sin registrar plaintext", () => {
    expect(script).toContain("response.status===429||response.status>=500");
    expect(script).toContain("maxAttempts=3");
    expect(script).not.toMatch(/console\.log\([^\n]*(plaintext|serviceRole|replacement|encrypted_credentials)/);
  });
});