import { beforeEach, describe, expect, it } from "vitest";
import { createMetaOAuthState, verifyMetaOAuthState } from "@/lib/meta-oauth-state";

describe("Meta OAuth state", () => {
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
  it("rechaza firma alterada y nonce incorrecto", () => {
    const { state, payload } = createMetaOAuthState("org-1", "user-1");
    expect(verifyMetaOAuthState(`${state}x`, payload.nonce)).toBeNull();
    expect(verifyMetaOAuthState(state, "otro-nonce")).toBeNull();
  });
});
