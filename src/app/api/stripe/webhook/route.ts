import crypto from "crypto";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { SAAS_CASE_DB_PRODUCT_ID } from "@/lib/saas-case-db";

export const runtime = "nodejs";

function cleanEnv(name: string): string {
  return (process.env[name] ?? "")
    .replace(/^\uFEFF/, "")
    .trim()
    .replace(/^["']|["']$/g, "");
}

function verifyStripeSignature(payload: string, signatureHeader: string, secret: string): boolean {
  const parts = signatureHeader.split(",").reduce<Record<string, string[]>>((acc, part) => {
    const [key, value] = part.split("=");
    if (!key || !value) return acc;
    acc[key] = [...(acc[key] ?? []), value];
    return acc;
  }, {});
  const timestamp = parts.t?.[0];
  const signatures = parts.v1 ?? [];
  if (!timestamp || !signatures.length) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  return signatures.some((sig) => {
    const expectedBuffer = Buffer.from(expected);
    const actualBuffer = Buffer.from(sig);
    return (
      expectedBuffer.length === actualBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, actualBuffer)
    );
  });
}

export async function POST(req: Request) {
  const webhookSecret = cleanEnv("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET is not configured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature") ?? "";
  const payload = await req.text();
  if (!verifyStripeSignature(payload, signature, webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(payload) as {
    type: string;
    data: {
      object: {
        id: string;
        payment_status?: string;
        customer_email?: string | null;
        customer_details?: { email?: string | null } | null;
        metadata?: Record<string, string> | null;
      };
    };
  };

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const productId = session.metadata?.productId;
    if (productId === SAAS_CASE_DB_PRODUCT_ID && session.payment_status === "paid") {
      const email = session.customer_details?.email ?? session.customer_email ?? "";
      await adminDb
        .collection("productPurchases")
        .doc(`${SAAS_CASE_DB_PRODUCT_ID}_${session.id}`)
        .set(
          {
            productId,
            release: session.metadata?.release ?? "beta",
            authUid: session.metadata?.authUid ?? "",
            stripeSessionId: session.id,
            email: session.metadata?.email ?? email,
            status: "active",
            source: "stripe-webhook",
            updatedAt: FieldValue.serverTimestamp(),
            createdAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
    }
  }

  return NextResponse.json({ received: true });
}
