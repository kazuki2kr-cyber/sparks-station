import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function getArgValue(name, fallback = null) {
  const prefix = `${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function loadLocalEnv() {
  const envPath = join(root, ".env.local");
  for (const line of readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) {
      process.env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
}

function normalizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`scheduledAtが日付として読めません: ${value}`);
  }
  return date;
}

function validateQueuePost(candidate) {
  if (candidate.approved !== true) {
    throw new Error(`${candidate.id ?? candidate.slug} は approved: true ではありません。`);
  }

  const post = candidate.queuePost ?? candidate.queueDraft;
  if (!post) {
    throw new Error(`${candidate.id ?? candidate.slug} に queuePost/queueDraft がありません。`);
  }

  const required = [
    ["caseName", post.caseName],
    ["articleUrl", post.articleUrl],
    ["sourceUrl", post.sourceUrl],
    ["instagram.hookText", post.instagram?.hookText],
    ["instagram.caption", post.instagram?.caption],
    ["instagram.slides", post.instagram?.slides],
  ];

  for (const [path, value] of required) {
    if (Array.isArray(value) && value.length === 0) {
      throw new Error(`${candidate.id ?? candidate.slug}: ${path} が空です。`);
    }
    if (!Array.isArray(value) && !value) {
      throw new Error(`${candidate.id ?? candidate.slug}: ${path} が未設定です。`);
    }
  }

  if (!post.instagram.slides.every((slide) => slide.imagePrompt && slide.overlayText)) {
    throw new Error(`${candidate.id ?? candidate.slug}: slidesには imagePrompt と overlayText が必要です。`);
  }

  const scheduledAt = normalizeDate(post.scheduledAt);
  if (!scheduledAt) {
    throw new Error(`${candidate.id ?? candidate.slug}: scheduledAt が未設定です。`);
  }

  const instagramPost = { ...post };
  delete instagramPost.threads;
  delete instagramPost.threadPosts;
  delete instagramPost.threadsPosts;

  return {
    ...instagramPost,
    platforms: ["instagram"],
    scheduledAt,
    status: post.status === "draft" ? "pending" : (post.status ?? "pending"),
    createdAt: new Date(),
    result: post.result ?? {
      instagramPostId: null,
      postedAt: null,
    },
  };
}

const filePath = getArgValue("--file", join(root, "tmp/sns-approved-candidates.json"));
const dryRun = hasFlag("--dry-run");
const collectionName = getArgValue("--collection", "postsQueue");

const raw = JSON.parse(readFileSync(filePath, "utf-8"));
const candidates = Array.isArray(raw) ? raw : raw.candidates ?? [];
const approved = candidates.filter((candidate) => candidate.approved === true);

if (!approved.length) {
  throw new Error(`approved: true の候補がありません: ${filePath}`);
}

const queuePosts = approved.map(validateQueuePost);

console.log(`Approved SNS candidates: ${queuePosts.length}`);
console.table(
  queuePosts.map((post) => ({
    caseName: post.caseName,
    scheduledAt: post.scheduledAt.toISOString(),
    slides: post.instagram.slides.length,
    platforms: post.platforms.join(","),
    status: post.status,
  }))
);

if (dryRun) {
  console.log("Dry run: Firestoreには投入していません。");
  process.exit(0);
}

loadLocalEnv();

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

for (const post of queuePosts) {
  const docRef = await db.collection(collectionName).add(post);
  console.log(`Seeded ${collectionName}/${docRef.id}: ${post.caseName}`);
}

console.log(`Done: ${queuePosts.length} approved SNS posts seeded.`);
