import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export type MetaOAuthState = {
  organizationId: string;
  userId: string;
  nonce: string;
  issuedAt: number;
  expiresAt: number;
};

function secret() {
  const value = process.env.META_OAUTH_STATE_SECRET;
  if (!value || value.length < 32) throw new Error("META_OAUTH_STATE_SECRET no configurado.");
  return value;
}

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

export function createMetaOAuthState(organizationId: string, userId: string) {
  const now = Math.floor(Date.now() / 1000);
  const payload: MetaOAuthState = {
    organizationId,
    userId,
    nonce: randomBytes(24).toString("base64url"),
    issuedAt: now,
    expiresAt: now + 10 * 60,
  };
  const encoded = encode(JSON.stringify(payload));
  const signature = createHmac("sha256", secret()).update(encoded).digest("base64url");
  return { state: `${encoded}.${signature}`, payload };
}

export function verifyMetaOAuthState(value: string | null, nonce: string | undefined) {
  if (!value || !nonce) return null;
  const [encoded, received] = value.split(".");
  if (!encoded || !received) return null;
  const expected = createHmac("sha256", secret()).update(encoded).digest("base64url");
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as MetaOAuthState;
    const now = Math.floor(Date.now() / 1000);
    if (payload.nonce !== nonce || payload.expiresAt < now || payload.issuedAt > now + 30) return null;
    return payload;
  } catch {
    return null;
  }
}
