import {afterEach,beforeEach,describe,expect,it} from "vitest";
import {randomBytes} from "node:crypto";
import {encryptMetaToken,encryptedCredentialVersion} from "@/lib/meta-token-crypto";
import {decryptMetaToken} from "@/lib/meta-token-decrypt";

describe("versionado de credenciales Meta",()=>{
  beforeEach(()=>{
    process.env.META_TOKEN_ENCRYPTION_KEY_V1=randomBytes(32).toString("base64");
    process.env.META_TOKEN_ENCRYPTION_KEY_V2=randomBytes(32).toString("base64");
  });
  afterEach(()=>{
    for(const key of ["META_TOKEN_ENCRYPTION_KEY_V1","META_TOKEN_ENCRYPTION_KEY_V2","META_TOKEN_ENCRYPTION_ACTIVE_VERSION","META_TOKEN_ENCRYPTION_KEY"]) delete process.env[key];
  });
  it("cifra nuevas credenciales con la version activa",()=>{
    process.env.META_TOKEN_ENCRYPTION_ACTIVE_VERSION="v2";
    const value=encryptMetaToken("token-de-prueba");
    expect(encryptedCredentialVersion(value)).toBe("v2");
    expect(decryptMetaToken(value)).toBe("token-de-prueba");
  });
  it("descifra v1 durante la migracion a v2",()=>{
    const old=encryptMetaToken("token-anterior","v1");
    process.env.META_TOKEN_ENCRYPTION_ACTIVE_VERSION="v2";
    expect(decryptMetaToken(old)).toBe("token-anterior");
    expect(encryptMetaToken(decryptMetaToken(old))).toMatch(/^v2\./);
  });
  it("acepta la variable heredada solo para v1",()=>{
    process.env.META_TOKEN_ENCRYPTION_KEY=process.env.META_TOKEN_ENCRYPTION_KEY_V1;
    delete process.env.META_TOKEN_ENCRYPTION_KEY_V1;
    expect(decryptMetaToken(encryptMetaToken("legacy","v1"))).toBe("legacy");
  });
  it("falla cerrado ante version o clave invalida",()=>{
    expect(()=>decryptMetaToken("v3.a.b.c")).toThrow("META_CREDENTIAL_VERSION_INVALID");
    process.env.META_TOKEN_ENCRYPTION_KEY_V2="invalid";
    expect(()=>encryptMetaToken("x","v2")).toThrow("KEY_V2_INVALID");
  });
});
