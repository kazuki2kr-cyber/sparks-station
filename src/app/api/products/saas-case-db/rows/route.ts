import { NextRequest, NextResponse } from "next/server";
import { saasCaseDbRows } from "@/lib/saas-case-db";
import { verifyIdToken } from "@/lib/firebase-admin";
import { verifySaasCaseDbAccessForUser } from "@/lib/purchases";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await verifyIdToken(req);
  if (auth instanceof NextResponse) return auth;

  const allowed = await verifySaasCaseDbAccessForUser(auth.uid, auth.email);
  if (!allowed) {
    return NextResponse.json({ error: "購入済みアカウントではありません" }, { status: 403 });
  }

  return NextResponse.json({ rows: saasCaseDbRows });
}
