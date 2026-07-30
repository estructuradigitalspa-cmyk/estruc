import { createCipheriv, randomBytes } from "node:crypto";

export function encryptMetaToken(token: string) {
  const encodedKey = process.env.META_TOKEN_ENCRYPTION_KEY;
  if (!encodedKey) throw new Error("META_TOKEN_ENCRYPTION_KEY no configurada.");
  const key = Buffer.from(encodedKey, "base64");
  if (key.length !== 32) throw new Error("META_TOKEN_ENCRYPTION_KEY debe contener 32 bytes en Base64.");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1.${iv.toString("base64url")}.${tag.toString("base64url")}.${ciphertext.toString("base64url")}`;
}
