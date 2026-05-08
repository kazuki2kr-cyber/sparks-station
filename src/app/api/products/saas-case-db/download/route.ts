import { NextRequest, NextResponse } from "next/server";
import { makeSaasCaseDbCsv, saasCaseDbRows } from "@/lib/saas-case-db";
import { verifyIdToken } from "@/lib/firebase-admin";
import {
  verifySaasCaseDbAccess,
  verifySaasCaseDbAccessForUser,
} from "@/lib/purchases";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const format = url.searchParams.get("format") ?? "csv";

  let allowed = false;
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    const auth = await verifyIdToken(req);
    if (auth instanceof NextResponse) return auth;
    allowed = await verifySaasCaseDbAccessForUser(auth.uid, auth.email);
  } else {
    allowed = await verifySaasCaseDbAccess(token);
  }

  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (format === "json") {
    return new NextResponse(JSON.stringify(saasCaseDbRows, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="sparks-saas-case-db-beta.json"',
      },
    });
  }

  return new NextResponse(`\uFEFF${makeSaasCaseDbCsv()}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="sparks-saas-case-db-beta.csv"',
    },
  });
}
