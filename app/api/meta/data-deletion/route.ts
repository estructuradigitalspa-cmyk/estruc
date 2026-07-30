import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { parseSignedRequest } from "@/lib/meta-security";

type DeletionPayload = { user_id?: string | number };

export async function POST(request: Request) {
  const secret = process.env.META_APP_SECRET;
  if (!secret) return NextResponse.json({ error: "Meta callback is not configured" }, { status: 503 });
  let signedRequest = "";
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const json = await request.json().catch(() => ({})) as { signed_request?: unknown };
    signedRequest = typeof json.signed_request === "string" ? json.signed_request : "";
  } else {
    const form = await request.formData().catch(() => null);
    signedRequest = String(form?.get("signed_request") || "");
  }
  const payload = parseSignedRequest(signedRequest, secret) as DeletionPayload | null;
  if (!payload?.user_id) return NextResponse.json({ error: "Invalid signed_request" }, { status: 401 });
  const confirmationCode = randomUUID();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://estructuradigital.cl";
  console.info("Meta data-deletion request received", { provider: "meta", externalUserId: String(payload.user_id), confirmationCode, status: "received", nextStep: "Resolve user, organization and integrations before verified deletion" });
  return NextResponse.json({ url: `${baseUrl}/data-deletion?code=${confirmationCode}`, confirmation_code: confirmationCode });
}

export function GET() {
  return NextResponse.json({ status: "ready", instructions: `${process.env.NEXT_PUBLIC_SITE_URL || "https://estructuradigital.cl"}/data-deletion` });
}
