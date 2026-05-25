import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env.local");

for (const line of readFileSync(envPath, "utf-8").split(/\r?\n/)) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) {
    process.env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
  }
}

const { initializeApp, cert, getApps } = await import("firebase-admin/app");
const { getFirestore } = await import("firebase-admin/firestore");

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

const IG_API_VERSION = process.env.INSTAGRAM_GRAPH_API_VERSION || "v21.0";
const INSTAGRAM_API_BASE = process.env.INSTAGRAM_API_BASE || `https://graph.instagram.com/${IG_API_VERSION}`;

const instagramMetrics = [
  "views",
  "reach",
  "likes",
  "comments",
  "saved",
  "shares",
  "total_interactions",
  "ig_reels_avg_watch_time",
  "ig_reels_video_view_total_time",
];

function cleanEnv(name) {
  return (process.env[name] ?? "").replace(/^\uFEFF/, "").trim().replace(/^["']|["']$/g, "");
}

function getArgValue(name) {
  const prefix = `${name}=`;
  const value = process.argv.find((arg) => arg.startsWith(prefix));
  return value ? value.slice(prefix.length) : null;
}

function toIso(value) {
  return value?.toDate?.()?.toISOString?.() || value?.toISOString?.() || null;
}

function getMetricValue(item) {
  const value = item?.values?.[0]?.value;
  if (typeof value === "number") return value;
  if (typeof value === "string" && value !== "") return Number(value);
  return value ?? null;
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    const message = json.error?.message || json.error || `HTTP ${res.status}`;
    const code = json.error?.code ? ` code=${json.error.code}` : "";
    throw new Error(`${message}${code}`);
  }
  return json;
}

async function fetchInstagramMetadata(mediaId, token) {
  const fields = [
    "id",
    "caption",
    "media_type",
    "media_product_type",
    "permalink",
    "timestamp",
    "like_count",
    "comments_count",
  ].join(",");
  const url = `${INSTAGRAM_API_BASE}/${mediaId}?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(token)}`;
  try {
    return await fetchJson(url);
  } catch (error) {
    return { id: mediaId, error: String(error.message || error) };
  }
}

async function fetchInstagramInsights(mediaId, token) {
  const values = {};
  const errors = {};

  for (const metric of instagramMetrics) {
    const url = `${INSTAGRAM_API_BASE}/${mediaId}/insights?metric=${encodeURIComponent(metric)}&access_token=${encodeURIComponent(token)}`;
    try {
      const json = await fetchJson(url);
      const item = json.data?.find((entry) => entry.name === metric);
      values[metric] = getMetricValue(item);
    } catch (error) {
      errors[metric] = String(error.message || error);
    }
  }

  return { values, errors };
}

function engagementRate(values, denominatorKey) {
  const denominator = Number(values[denominatorKey] ?? 0);
  if (!denominator) return null;
  const interactions = Number(
    values.total_interactions ??
      (Number(values.likes ?? 0) + Number(values.comments ?? 0) + Number(values.saved ?? 0) + Number(values.shares ?? 0))
  );
  return Number(((interactions / denominator) * 100).toFixed(2));
}

function msToSeconds(value) {
  if (value === null || value === undefined || value === "") return null;
  return Number((Number(value) / 1000).toFixed(2));
}

function saveReport(report, outPath) {
  const dir = dirname(outPath);
  mkdirSync(dir, { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, "utf-8");
}

const limit = Number(getArgValue("--limit") || 20);
const outPath = getArgValue("--out");
const instagramToken = cleanEnv("INSTAGRAM_ACCESS_TOKEN");

if (!instagramToken) {
  throw new Error("INSTAGRAM_ACCESS_TOKEN が .env.local に見つかりません。");
}

const snap = await db
  .collection("postsQueue")
  .where("status", "==", "posted")
  .get();

const report = {
  generatedAt: new Date().toISOString(),
  source: "Firestore postsQueue",
  count: snap.size,
  instagramApiBase: INSTAGRAM_API_BASE,
  posts: [],
};

const postedDocs = snap.docs
  .sort((a, b) => {
    const aTime = a.data().postedAt?.toMillis?.() ?? 0;
    const bTime = b.data().postedAt?.toMillis?.() ?? 0;
    return bTime - aTime;
  })
  .slice(0, limit);

report.count = postedDocs.length;

for (const doc of postedDocs) {
  const data = doc.data();
  const result = data.result ?? {};
  const instagramPostId = result.instagramPostId || data.instagramPostId || null;

  const item = {
    docId: doc.id,
    order: data.order ?? null,
    status: data.status ?? null,
    caseName: data.caseName ?? null,
    contentTheme: data.contentTheme ?? null,
    hookText: data.instagram?.hookText ?? data.hookText ?? null,
    scheduledAt: toIso(data.scheduledAt),
    postedAt: toIso(data.postedAt),
    articleUrl: data.articleUrl ?? null,
    instagram: null,
  };

  if (instagramPostId) {
    const [metadata, insights] = await Promise.all([
      fetchInstagramMetadata(instagramPostId, instagramToken),
      fetchInstagramInsights(instagramPostId, instagramToken),
    ]);
    item.instagram = {
      id: instagramPostId,
      metadata,
      insights: insights.values,
      insightErrors: insights.errors,
      interactionRateByReach: engagementRate(insights.values, "reach"),
      interactionRateByPlays: engagementRate(insights.values, "plays"),
    };
  }

  report.posts.push(item);
}

const summary = report.posts.map((post) => ({
  order: post.order,
  caseName: post.caseName,
  theme: post.contentTheme,
  postedAt: post.postedAt,
  igId: post.instagram?.id ?? "-",
  plays: post.instagram?.insights?.plays ?? null,
  views: post.instagram?.insights?.views ?? null,
  reach: post.instagram?.insights?.reach ?? null,
  likes: post.instagram?.insights?.likes ?? post.instagram?.metadata?.like_count ?? null,
  comments: post.instagram?.insights?.comments ?? post.instagram?.metadata?.comments_count ?? null,
  saved: post.instagram?.insights?.saved ?? null,
  shares: post.instagram?.insights?.shares ?? null,
  totalInteractions: post.instagram?.insights?.total_interactions ?? null,
  interactionRateByReach: post.instagram?.interactionRateByReach ?? null,
  avgWatchSec: msToSeconds(post.instagram?.insights?.ig_reels_avg_watch_time),
  totalWatchSec: msToSeconds(post.instagram?.insights?.ig_reels_video_view_total_time),
}));

console.log(`SNS insights: posted=${report.count}`);
console.table(summary);

const errorSummary = report.posts
  .map((post) => ({
    caseName: post.caseName,
    instagramErrors: Object.keys(post.instagram?.insightErrors ?? {}),
  }))
  .filter((post) => post.instagramErrors.length);

if (errorSummary.length) {
  console.log("\n取得できなかったメトリクス:");
  console.dir(errorSummary, { depth: null });
}

if (outPath) {
  saveReport(report, outPath);
  console.log(`\nSaved: ${outPath}`);
}

process.exit(0);
