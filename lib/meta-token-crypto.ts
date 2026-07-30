import { createCipheriv, randomBytes } from "node:crypto";

export type MetaEncryptionVersion = "v1" | "v2";

function activeVersion(): MetaEncryptionVersion {
  const value = process.env.META_TOKEN_ENCRYPTION_ACTIVE_VERSION || "v1";
  if (value !== "v1" && value !== "v2") throw new Error("META_ENCRYPTION_VERSION_INVALID");
  return value;
}

export function metaEncryptionKey(version: MetaEncryptionVersion) {
  const encoded =
    process.env[`META_TOKEN_ENCRYPTION_KEY_${version.toUpperCase()}`] ||
    (version === "v1" ? process.env.META_TOKEN_ENCRYPTION_KEY : undefined);
  if (!encoded) throw new Error(`META_ENCRYPTION_KEY_${version.toUpperCase()}_MISSING`);
  const key = Buffer.from(encoded, "base64");
  if (key.length !== 32) throw new Error(`META_ENCRYPTION_KEY_${version.toUpperCase()}_INVALID`);
  return key;
}

export function encryptedCredentialVersion(value: string): MetaEncryptionVersion {
  const version = value.split(".", 1)[0];
  if (version !== "v1" && version !== "v2") throw new Error("META_CREDENTIAL_VERSION_INVALID");
  return version;
}

export function encryptMetaToken(token: string, version = activeVersion()) {
  const key = metaEncryptionKey(version);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${version}.${iv.toString("base64url")}.${tag.toString("base64url")}.${ciphertext.toString("base64url")}`;
}
