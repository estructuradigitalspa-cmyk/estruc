import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMetaOAuthState, verifyMetaOAuthState } from "@/lib/meta-oauth-state";

describe("Meta OAuth state", () => {
  afterEach(()=>vi.useRealTimers());
  beforeEach(() => {
    process.env.META_OAUTH_STATE_SECRET = "test-secret-with-at-least-thirty-two-characters";
  });
  it("vincula organización, usuario y nonce", () => {
    const { state, payload } = createMetaOAuthState("org-1", "user-1");
    expect(verifyMetaOAuthState(state, payload.nonce)).toMatchObject({
      organizationId: "org-1",
      userId: "user-1",
    });
  });
  it("rechaza una sesión vencida",()=>{vi.useFakeTimers();vi.setSystemTime(new Date("2026-07-30T00:00:00Z"));const{state,payload}=createMetaOAuthState("org-1","user-1");vi.advanceTimersByTime(11*60*1000);expect(verifyMetaOAuthState(state,payload.nonce)).toBeNull()});
  it("rechaza firma alterada y nonce incorrecto", () => {
    const { state, payload } = createMetaOAuthState("org-1", "user-1");
    expect(verifyMetaOAuthState(`${state}x`, payload.nonce)).toBeNull();
    expect(verifyMetaOAuthState(state, "otro-nonce")).toBeNull();
  });
});
