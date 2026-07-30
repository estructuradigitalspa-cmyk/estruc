import { createDecipheriv } from "node:crypto";
import { encryptedCredentialVersion, metaEncryptionKey } from "@/lib/meta-token-crypto";

export function decryptMetaToken(value: string) {
  const version = encryptedCredentialVersion(value);
  const key = metaEncryptionKey(version);
  const [, ivValue, tagValue, ciphertextValue] = value.split(".");
  if (!ivValue || !tagValue || !ciphertextValue) throw new Error("META_CREDENTIAL_INVALID");
  const iv = Buffer.from(ivValue, "base64url");
  const tag = Buffer.from(tagValue, "base64url");
  if (iv.length !== 12 || tag.length !== 16) throw new Error("META_CREDENTIAL_INVALID");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextValue, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
