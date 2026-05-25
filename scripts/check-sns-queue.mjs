import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envContent = readFileSync(join(__dirname, "../.env.local"), "utf-8");
for (const line of envContent.split("\n")) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) process.env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
}

const { initializeApp, cert, getApps } = await import("firebase-admin/app");
const { getFirestore } = await import("firebase-admin/firestore");
if (!getApps().length) {
  initializeApp({ credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  })});
}

const db = getFirestore();
const snap = await db.collection("postsQueue").orderBy("order").get();
console.log(`キュー内ドキュメント: ${snap.size}件\n`);
for (const doc of snap.docs) {
  const d = doc.data();
  const label = d.instagram?.hookText || d.hookText || d.instagram?.slides?.[0]?.overlayText || d.slides?.[0]?.overlayText || "-";
  const type = d.instagram?.type || d.type || "-";
  const platforms = Array.isArray(d.platforms) ? d.platforms.join(",") : "instagram";
  const scheduledAt = d.scheduledAt?.toDate?.()?.toISOString?.() || d.scheduledAt?.toISOString?.() || "-";
  console.log(`#${d.order} [${type}] status=${d.status} scheduledAt=${scheduledAt} platforms=${platforms}  "${label.replace(/\n/g, " ")}"`);
}
process.exit(0);
