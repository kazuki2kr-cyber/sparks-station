import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SAAS_CASE_DB_PRODUCT_ID } from "@/lib/saas-case-db";
import { verifyIdToken } from "@/lib/firebase-admin";
import {
  cleanEnv,
  getBaseUrl,
  getSaasCaseDbBetaPriceId,
  stripeRequest,
  type StripeCheckoutSession,
} from "@/lib/stripe-rest";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    if (cleanEnv("SAAS_CASE_DB_CHECKOUT_ENABLED") !== "true") {
      return NextResponse.json(
        { error: "SaaS Case DBの購入受付は現在準備中です。" },
        { status: 503 },
      );
    }

    const auth = await verifyIdToken(req);
    if (auth instanceof NextResponse) return auth;
    if (!auth.email) {
      return NextResponse.json(
        { error: "Googleログイン済みメールアドレスが必要です" },
        { status: 400 },
      );
    }

    const baseUrl = getBaseUrl(req);
    const priceId = getSaasCaseDbBetaPriceId();

    const params = new URLSearchParams({
      mode: "payment",
      success_url: `${baseUrl}/products/saas-case-db/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/products`,
      allow_promotion_codes: "true",
      "line_items[0][quantity]": "1",
      "line_items[0][price]": priceId,
      "metadata[productId]": SAAS_CASE_DB_PRODUCT_ID,
      "metadata[release]": "beta",
      "metadata[authUid]": auth.uid,
      "metadata[email]": auth.email,
      customer_email: auth.email,
    });

    const session = await stripeRequest<StripeCheckoutSession>("/checkout/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!session.url) {
      throw new Error("Stripe Checkout URL was not returned");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 },
    );
  }
}
