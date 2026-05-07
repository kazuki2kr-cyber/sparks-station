import { getApps, initializeApp, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";

function cleanEnv(name: string): string {
  return (process.env[name] ?? "")
    .replace(/^\uFEFF/, "")
    .trim()
    .replace(/^["']|["']$/g, "");
}

function getAdminApp() {
  if (!getApps().length) {
    return initializeApp({
      credential: cert({
        projectId: cleanEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
        clientEmail: cleanEnv("FIREBASE_ADMIN_CLIENT_EMAIL"),
        privateKey: cleanEnv("FIREBASE_ADMIN_PRIVATE_KEY").replace(/\\n/g, "\n"),
      }),
    });
  }
  return getApp();
}

export const adminDb = new Proxy({} as FirebaseFirestore.Firestore, {
  get(_target, prop) {
    return Reflect.get(getFirestore(getAdminApp()), prop);
  },
});

/**
 * Authorization: Bearer <idToken> ヘッダーを検証し、UIDを返す。
 * 検証失敗時は NextResponse（401）を返す。
 */
export async function verifyIdToken(
  req: NextRequest
): Promise<{ uid: string } | NextResponse> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }
  try {
    const decoded = await getAuth(getAdminApp()).verifyIdToken(token);
    return { uid: decoded.uid };
  } catch {
    return NextResponse.json({ error: "認証トークンが無効です" }, { status: 401 });
  }
}

function isAllowlistedAdminUid(uid: string): boolean {
  const adminUids = cleanEnv("ADMIN_UIDS")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return adminUids.includes(uid);
}

export async function verifyAdminToken(
  req: NextRequest
): Promise<{ uid: string } | NextResponse> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const decoded = await getAuth(getAdminApp()).verifyIdToken(token);
    if (decoded.admin === true || isAllowlistedAdminUid(decoded.uid)) {
      return { uid: decoded.uid };
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

/**
 * Authorization ヘッダーがある場合のみ検証してUIDを返す。
 * ヘッダーなし（未ログイン）の場合は null を返す。
 * トークン不正の場合は NextResponse（401）を返す。
 */
export async function verifyIdTokenOptional(
  req: NextRequest
): Promise<{ uid: string } | null | NextResponse> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;
  try {
    const decoded = await getAuth(getAdminApp()).verifyIdToken(token);
    return { uid: decoded.uid };
  } catch {
    return NextResponse.json({ error: "認証トークンが無効です" }, { status: 401 });
  }
}
