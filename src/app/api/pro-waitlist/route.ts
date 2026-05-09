import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, verifyIdToken } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (auth instanceof NextResponse) return auth;
  if (!auth.email) {
    return NextResponse.json(
      { error: "Googleログイン済みメールアドレスが必要です。" },
      { status: 400 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const source =
    typeof body.source === "string" && body.source.trim()
      ? body.source.trim()
      : "products";

  const waitlistRef = adminDb.collection("proWaitlist").doc(auth.uid);
  const existing = await waitlistRef.get();
  await waitlistRef.set(
    {
      uid: auth.uid,
      email: auth.email,
      source,
      status: "active",
      updatedAt: FieldValue.serverTimestamp(),
      ...(existing.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
    },
    { merge: true },
  );

  return NextResponse.json({ ok: true, email: auth.email });
}
