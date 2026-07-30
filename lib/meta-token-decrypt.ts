import { createDecipheriv } from "node:crypto";

export function decryptMetaToken(value: string) {
  const encodedKey = process.env.META_TOKEN_ENCRYPTION_KEY;
  if (!encodedKey) throw new Error("META_TOKEN_ENCRYPTION_KEY no configurada.");
  const key = Buffer.from(encodedKey, "base64");
  const [version, ivValue, tagValue, ciphertextValue] = value.split(".");
  if (version !== "v1" || !ivValue || !tagValue || !ciphertextValue || key.length !== 32) {
    throw new Error("Credencial Meta inválida.");
  }
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivValue, "base64url"));
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextValue, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
