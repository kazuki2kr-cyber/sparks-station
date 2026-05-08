import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import {
  createAccessToken,
  hashAccessToken,
  SAAS_CASE_DB_PRODUCT_ID,
} from "@/lib/saas-case-db";
import { stripeRequest, type StripeCheckoutSession } from "@/lib/stripe-rest";

export type PurchaseAccess = {
  token: string;
  email: string;
};

export async function createOrGetSaasCaseDbAccess(
  sessionId: string,
): Promise<PurchaseAccess> {
  const session = await stripeRequest<StripeCheckoutSession>(
    `/checkout/sessions/${encodeURIComponent(sessionId)}`,
  );

  if (session.payment_status !== "paid") {
    throw new Error("支払いが完了していません");
  }
  if (session.metadata?.productId !== SAAS_CASE_DB_PRODUCT_ID) {
    throw new Error("対象商品が一致しません");
  }

  const email =
    session.customer_details?.email ??
    session.customer_email ??
    "";
  if (!email) {
    throw new Error("購入者メールアドレスを確認できません");
  }

  const docRef = adminDb
    .collection("productPurchases")
    .doc(`${SAAS_CASE_DB_PRODUCT_ID}_${session.id}`);
  const existing = await docRef.get();

  const token = createAccessToken();
  await docRef.set(
    {
      productId: SAAS_CASE_DB_PRODUCT_ID,
      release: "beta",
      stripeSessionId: session.id,
      email,
      tokenHash: hashAccessToken(token),
      status: "active",
      source: "success-page",
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: existing.exists
        ? existing.data()?.createdAt ?? FieldValue.serverTimestamp()
        : FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return { token, email };
}

export async function verifySaasCaseDbAccess(token: string): Promise<boolean> {
  if (!token) return false;
  const snapshot = await adminDb
    .collection("productPurchases")
    .where("productId", "==", SAAS_CASE_DB_PRODUCT_ID)
    .where("tokenHash", "==", hashAccessToken(token))
    .where("status", "==", "active")
    .limit(1)
    .get();
  return !snapshot.empty;
}

export async function verifySaasCaseDbAccessForUser(
  uid: string,
  email?: string,
): Promise<boolean> {
  const byUid = await adminDb
    .collection("productPurchases")
    .where("productId", "==", SAAS_CASE_DB_PRODUCT_ID)
    .where("authUid", "==", uid)
    .where("status", "==", "active")
    .limit(1)
    .get();
  if (!byUid.empty) return true;

  if (!email) return false;
  const byEmail = await adminDb
    .collection("productPurchases")
    .where("productId", "==", SAAS_CASE_DB_PRODUCT_ID)
    .where("email", "==", email)
    .where("status", "==", "active")
    .limit(1)
    .get();
  return !byEmail.empty;
}
