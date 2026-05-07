// Sparks Station SNS auto-posting — Reels + Threads thread support
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { readFileSync, writeFileSync, unlinkSync, existsSync, chmodSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { createHash, randomBytes } from "crypto";
import { spawnSync } from "child_process";
import _ffmpegStaticPath from "ffmpeg-static";

function getFFmpegPath(): string {
  const candidates = [
    join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg"),
    _ffmpegStaticPath ?? "",
  ].filter(Boolean);
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  throw new Error(`ffmpegバイナリが見つかりません。試したパス: ${candidates.join(", ")}`);
}
import { adminDb, verifyAdminToken } from "@/lib/firebase-admin";
import type { DocumentReference } from "firebase-admin/firestore";

function cleanEnv(name: string): string {
  return (process.env[name] ?? "")
    .replace(/^\uFEFF/, "")
    .trim()
    .replace(/^["']|["']$/g, "");
}

// ─────────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────────

interface Slide {
  imagePrompt: string;
  overlayText: string;
}

interface ReelPost {
  type: "reel";
  caption: string;
  hookText: string;
  slides: Slide[];
  threadPosts?: string[];
}

type QueuedPost = ReelPost;

interface LegacyCarouselPost {
  type: "carousel";
  caption: string;
  slides: Slide[];
}

// ─────────────────────────────────────────────
// テキスト正規化（フォント未対応文字の置換）
// ─────────────────────────────────────────────

// NotoSansJP-Bold.ttf はU+2460〜U+2473（丸数字①〜⑳）を持たない。
// 画像描画前に ASCII 相当の文字へ変換する。
function normalizeForImage(text: string): string {
  return text
    .replace(/①/g, "1.")
    .replace(/②/g, "2.")
    .replace(/③/g, "3.")
    .replace(/④/g, "4.")
    .replace(/⑤/g, "5.")
    .replace(/⑥/g, "6.")
    .replace(/⑦/g, "7.")
    .replace(/⑧/g, "8.")
    .replace(/⑨/g, "9.")
    .replace(/⑩/g, "10.")
    .replace(/⑪/g, "11.")
    .replace(/⑫/g, "12.")
    .replace(/⑬/g, "13.")
    .replace(/⑭/g, "14.")
    .replace(/⑮/g, "15.")
    .replace(/⑯/g, "16.")
    .replace(/⑰/g, "17.")
    .replace(/⑱/g, "18.")
    .replace(/⑲/g, "19.")
    .replace(/⑳/g, "20.")
    .replace(/→/g, ">")
    .replace(/←/g, "<")
    .replace(/↑/g, "^")
    .replace(/↓/g, "v");
}

let fontsLoaded = false;
let registeredFontFamily = "NotoSansJP";

function loadCanvas() {
  const req = eval("require") as NodeRequire;
  return req("@napi-rs/canvas") as typeof import("@napi-rs/canvas");
}

function ensureFonts() {
  if (fontsLoaded) return;
  const { GlobalFonts } = loadCanvas();
  const base = join(process.cwd(), "public/fonts");
  const count = GlobalFonts.loadFontsFromDir(base);
  const families = GlobalFonts.families.map((f) => f.family);
  if (count === 0) {
    throw new Error(`フォントロード失敗: count=0, base=${base}`);
  }
  const notoFamily = families.find((f) => f.toLowerCase().includes("noto"));
  if (!notoFamily) {
    throw new Error(`日本語フォント未検出: families=[${families.join(",")}]`);
  }
  registeredFontFamily = notoFamily;
  fontsLoaded = true;
}

// ─────────────────────────────────────────────
// SVGオーバーレイ生成
// ─────────────────────────────────────────────

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getEmbeddedFontCss(): string {
  const fontPath = join(process.cwd(), "public/fonts/NotoSansJP-Bold.ttf");
  const fontBase64 = readFileSync(fontPath).toString("base64");
  return `
    @font-face {
      font-family: 'SparksNotoSansJP';
      src: url(data:font/truetype;charset=utf-8;base64,${fontBase64}) format('truetype');
      font-weight: 700;
    }
  `;
}

function estimateFontSize(lines: string[], base: number, min: number, maxChars: number): number {
  const longest = Math.max(...lines.map((line) => Array.from(line).length), 1);
  if (longest <= maxChars) return base;
  return Math.max(min, Math.floor(base * (maxChars / longest)));
}

function makeOverlaySvg(
  width: number,
  height: number,
  text: string,
  options: {
    baseFontSize: number;
    minFontSize: number;
    maxChars: number;
    startY: number;
    brandY: number;
    brandFontSize: number;
    topGradientEnd: number;
    bottomGradientStart: number;
  }
): Buffer {
  ensureFonts();
  const { createCanvas } = loadCanvas();
  const lines = normalizeForImage(text).split("\n").filter(Boolean);
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const maxTextWidth = width === 1080 ? 980 : 900;
  let fontSize = options.baseFontSize;
  ctx.font = `bold ${fontSize}px "${registeredFontFamily}", sans-serif`;
  for (const line of lines) {
    while (ctx.measureText(line).width > maxTextWidth && fontSize > options.minFontSize) {
      fontSize -= 2;
      ctx.font = `bold ${fontSize}px "${registeredFontFamily}", sans-serif`;
    }
  }

  ctx.fillStyle = "white";
  ctx.strokeStyle = "rgba(0,0,0,0.82)";
  ctx.lineWidth = width === 1080 ? 10 : 8;
  ctx.lineJoin = "round";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = width === 1080 ? 18 : 14;
  ctx.shadowOffsetY = width === 1080 ? 6 : 4;

  const lineHeight = Math.round(fontSize * 1.22);
  lines.forEach((line, index) => {
    ctx.strokeText(line, width / 2, options.startY + index * lineHeight);
    ctx.fillText(line, width / 2, options.startY + index * lineHeight);
  });

  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 2;
  ctx.font = `bold ${options.brandFontSize}px Arial, sans-serif`;
  ctx.strokeStyle = "rgba(0,0,0,0.70)";
  ctx.lineWidth = 5;
  ctx.strokeText("SPARKS STATION", width / 2, options.brandY);
  ctx.fillText("SPARKS STATION", width / 2, options.brandY);

  return canvas.toBuffer("image/png");
}

// ─────────────────────────────────────────────
// テキスト + ブランド合成（正方形 1:1 用）
// ─────────────────────────────────────────────

async function compositeTextAndBranding(
  jpegBuffer: Buffer,
  hookText: string
): Promise<Buffer> {
  const SIZE = 1024;
  const lines = normalizeForImage(hookText).split("\n").filter(Boolean);
  const startY = lines.length === 1 ? 118 : 94;
  const textOverlay = makeOverlaySvg(SIZE, SIZE, hookText, {
    baseFontSize: 76,
    minFontSize: 40,
    maxChars: 12,
    startY,
    brandY: SIZE - 48,
    brandFontSize: 34,
    topGradientEnd: Math.round(SIZE * 0.42),
    bottomGradientStart: Math.round(SIZE * 0.76),
  });

  return sharp(jpegBuffer)
    .composite([
      { input: textOverlay, top: 0, left: 0 },
    ])
    .jpeg({ quality: 90 })
    .toBuffer();
}

// ─────────────────────────────────────────────
// テキスト + ブランド合成（縦型 9:16 リール用）
// ─────────────────────────────────────────────

async function compositeTextAndBrandingVertical(
  jpegBuffer: Buffer,
  overlayText: string
): Promise<Buffer> {
  const W = 1080;
  const H = 1920;
  const lines = normalizeForImage(overlayText).split("\n").filter(Boolean);
  // Instagram UIの安全ゾーン（ステータスバー+オーバーレイ ~250px）を避けるため H の20%以降に配置
  const startY = lines.length === 1 ? Math.round(H * 0.20) : Math.round(H * 0.18);
  const textOverlay = makeOverlaySvg(W, H, overlayText, {
    baseFontSize: 88,
    minFontSize: 44,
    maxChars: 12,
    startY,
    brandY: H - 64,
    brandFontSize: 42,
    topGradientEnd: Math.round(H * 0.36),
    bottomGradientStart: Math.round(H * 0.78),
  });

  return sharp(jpegBuffer)
    .resize(W, H, { fit: "cover" })
    .composite([
      { input: textOverlay, top: 0, left: 0 },
    ])
    .jpeg({ quality: 90 })
    .toBuffer();
}

// ─────────────────────────────────────────────
// API 定数
// ─────────────────────────────────────────────

const INSTAGRAM_API_BASE = "https://graph.instagram.com/v21.0";
const THREADS_API_BASE = "https://graph.threads.net/v1.0";

// ─────────────────────────────────────────────
// Firestoreデキュー
// ─────────────────────────────────────────────

function normalizeQueuedPost(data: Record<string, unknown>): QueuedPost {
  const instagram = (data.instagram ?? data) as Record<string, unknown>;
  const threads = (data.threads ?? data) as Record<string, unknown>;
  const type = instagram.type ?? data.type;

  if (type !== "reel") {
    throw new Error(`Sparks StationのInstagram投稿はreelのみ対応です: type=${String(type ?? "undefined")}`);
  }

  const threadPosts = threads.posts ?? data.threadPosts ?? data.threadsPosts ?? [];

  return {
    type: "reel",
    caption: instagram.caption as string,
    hookText: instagram.hookText as string,
    slides: instagram.slides as Slide[],
    threadPosts: threadPosts as string[],
  };
}

async function dequeueNextPost(): Promise<{ post: QueuedPost; docRef: DocumentReference } | null> {
  return adminDb.runTransaction(async (tx) => {
    const snapshot = await tx.get(
      adminDb
        .collection("postsQueue")
        .where("status", "==", "pending")
        .where("scheduledAt", "<=", new Date())
        .orderBy("scheduledAt", "asc")
        .orderBy("order", "asc")
        .limit(1)
    );
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    tx.update(doc.ref, { status: "processing", processingAt: new Date() });
    const data = doc.data();
    return { post: normalizeQueuedPost(data), docRef: doc.ref };
  });
}

// ─────────────────────────────────────────────
// Imagen 4でリール用画像生成
// ─────────────────────────────────────────────

async function generateImage(
  imagePrompt: string,
  aspectRatio: "1:1" | "9:16" = "1:1"
): Promise<Buffer> {
  const ai = new GoogleGenAI({ apiKey: cleanEnv("GEMINI_API_KEY") });

  const response = await ai.models.generateImages({
    model: "imagen-4.0-fast-generate-001",
    prompt: imagePrompt,
    config: { numberOfImages: 1, aspectRatio },
  });

  const imageData = response.generatedImages?.[0]?.image?.imageBytes;
  if (!imageData) throw new Error("画像生成に失敗しました");

  const pngBuffer = Buffer.from(imageData, "base64");
  return sharp(pngBuffer).jpeg({ quality: 90 }).toBuffer();
}

// ─────────────────────────────────────────────
// Cloudinaryアップロード（画像）
// ─────────────────────────────────────────────

async function uploadImageToCloudinary(jpegBuffer: Buffer): Promise<string> {
  const cloudName = cleanEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = cleanEnv("CLOUDINARY_API_KEY");
  const apiSecret = cleanEnv("CLOUDINARY_API_SECRET");
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHash("sha256")
    .update(`timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const form = new FormData();
  form.append(
    "file",
    `data:image/jpeg;base64,${jpegBuffer.toString("base64")}`
  );
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("signature", signature);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  const uploadJson = await uploadRes.json();
  if (!uploadJson.secure_url)
    throw new Error(`Cloudinaryアップロード失敗: ${JSON.stringify(uploadJson)}`);

  return uploadJson.secure_url as string;
}

// ─────────────────────────────────────────────
// コンテナ処理完了待機（共通）
// ─────────────────────────────────────────────

async function waitForContainer(
  containerId: string,
  token: string,
  maxAttempts: number,
  label: string
): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const statusRes = await fetch(
      `${INSTAGRAM_API_BASE}/${containerId}?fields=status_code&access_token=${token}`
    );
    const { status_code } = await statusRes.json();
    if (status_code === "FINISHED") return;
    if (status_code === "ERROR")
      throw new Error(`${label}処理エラー: status_code=ERROR`);
  }
  throw new Error(`${label}処理タイムアウト（${maxAttempts * 3}秒）`);
}

// ─────────────────────────────────────────────
// ① 静止画フロー（既存）
// ─────────────────────────────────────────────

async function generateAndUploadImage(
  imagePrompt: string,
  hookText: string
): Promise<string> {
  const jpegBuffer = await generateImage(imagePrompt, "1:1");
  const composited = await compositeTextAndBranding(jpegBuffer, hookText);
  return uploadImageToCloudinary(composited);
}

async function postToInstagram(
  imageUrl: string,
  caption: string
): Promise<string> {
  const accountId = cleanEnv("INSTAGRAM_BUSINESS_ACCOUNT_ID");
  const token = cleanEnv("INSTAGRAM_ACCESS_TOKEN");

  const containerRes = await fetch(`${INSTAGRAM_API_BASE}/${accountId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl, caption, access_token: token }),
  });
  const container = await containerRes.json();
  if (!container.id)
    throw new Error(`コンテナ作成失敗: ${JSON.stringify(container)}`);

  await waitForContainer(container.id, token, 10, "画像コンテナ");

  const publishRes = await fetch(
    `${INSTAGRAM_API_BASE}/${accountId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: container.id, access_token: token }),
    }
  );
  const published = await publishRes.json();
  if (!published.id)
    throw new Error(`公開失敗: ${JSON.stringify(published)}`);

  return published.id as string;
}

// ─────────────────────────────────────────────
// ② カルーセルフロー
// ─────────────────────────────────────────────

async function postCarousel(post: LegacyCarouselPost): Promise<string> {
  const accountId = cleanEnv("INSTAGRAM_BUSINESS_ACCOUNT_ID");
  const token = cleanEnv("INSTAGRAM_ACCESS_TOKEN");

  if (post.slides.length < 2 || post.slides.length > 10) {
    throw new Error(
      `カルーセルのスライド数が不正です: ${post.slides.length}（2〜10枚必要）`
    );
  }

  // 各スライドを並列生成 → アップロード
  const imageUrls: string[] = await Promise.all(
    post.slides.map(async (slide) => {
      const jpegBuffer = await generateImage(slide.imagePrompt, "1:1");
      const composited = await compositeTextAndBranding(
        jpegBuffer,
        slide.overlayText
      );
      return uploadImageToCloudinary(composited);
    })
  );

  // 子メディアコンテナを順次作成
  const childIds: string[] = [];
  for (const imageUrl of imageUrls) {
    const res = await fetch(`${INSTAGRAM_API_BASE}/${accountId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageUrl,
        is_carousel_item: true,
        access_token: token,
      }),
    });
    const json = await res.json();
    if (!json.id)
      throw new Error(`カルーセル子メディア作成失敗: ${JSON.stringify(json)}`);
    childIds.push(json.id as string);
  }

  // カルーセルコンテナ作成
  const containerRes = await fetch(
    `${INSTAGRAM_API_BASE}/${accountId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        media_type: "CAROUSEL",
        children: childIds.join(","),
        caption: post.caption,
        access_token: token,
      }),
    }
  );
  const container = await containerRes.json();
  if (!container.id)
    throw new Error(
      `カルーセルコンテナ作成失敗: ${JSON.stringify(container)}`
    );

  await waitForContainer(container.id, token, 20, "カルーセルコンテナ");

  const publishRes = await fetch(
    `${INSTAGRAM_API_BASE}/${accountId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: container.id, access_token: token }),
    }
  );
  const published = await publishRes.json();
  if (!published.id)
    throw new Error(`カルーセル公開失敗: ${JSON.stringify(published)}`);

  return published.id as string;
}

// ─────────────────────────────────────────────
// ③ リールフロー
// ─────────────────────────────────────────────

/**
 * 各スライド画像（JPEG Buffer）を ffmpeg でスライドショーMP4に変換する。
 * /tmp に一時ファイルを書き出し、ffmpeg 処理後に削除する。
 * 解像度: 1080x1920, コーデック: libx264, 無音, 各スライド4秒, クロスフェード0.5秒
 */
async function buildSlideShowVideo(frames: Buffer[], bgmUrl?: string): Promise<Buffer> {
  const ffmpegBin = getFFmpegPath();
  chmodSync(ffmpegBin, 0o755);

  const tmpDir = tmpdir();
  const sessionId = randomBytes(8).toString("hex");
  const framePaths: string[] = [];
  const outputPath = join(tmpDir, `reel_${sessionId}.mp4`);
  let bgmPath: string | null = null;

  try {
    // 一時ファイルに書き出し
    for (let i = 0; i < frames.length; i++) {
      const p = join(tmpDir, `reel_${sessionId}_frame${i}.jpg`);
      writeFileSync(p, frames[i]);
      framePaths.push(p);
    }

    // BGMダウンロード
    if (bgmUrl) {
      const bgmRes = await fetch(bgmUrl);
      if (!bgmRes.ok) throw new Error(`BGMダウンロード失敗: ${bgmRes.status}`);
      bgmPath = join(tmpDir, `reel_${sessionId}_bgm.mp3`);
      writeFileSync(bgmPath, Buffer.from(await bgmRes.arrayBuffer()));
    }

    // ffmpegのinput/filterを組み立てる
    // 各フレームを4秒ループ → xfade で0.5秒クロスフェード
    const DURATION = 4; // 秒/フレーム
    const FADE = 0.5; // クロスフェード秒
    const n = frames.length;

    const inputs: string[] = [];
    for (const p of framePaths) {
      inputs.push("-loop", "1", "-t", String(DURATION), "-i", p);
    }

    // xfade filterchainを構築
    // n=1のとき: そのままスケールのみ
    // n>=2のとき: [0][1]xfade=... → [v01]; [v01][2]xfade=... → [v012]; ...
    let filterComplex = "";
    let lastLabel = "[0:v]";

    if (n === 1) {
      filterComplex = `[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1[outv]`;
      lastLabel = "[outv]";
    } else {
      // まず各入力をスケール・パディング
      const scaleParts: string[] = [];
      for (let i = 0; i < n; i++) {
        scaleParts.push(
          `[${i}:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1[s${i}]`
        );
      }
      filterComplex = scaleParts.join(";") + ";";

      // xfade チェイン
      // offset = 各フレームの開始時刻 - フェード時間
      // フレームi が始まる時刻: i * (DURATION - FADE)
      let prev = "[s0]";
      const xfadeParts: string[] = [];
      for (let i = 1; i < n; i++) {
        const offset = i * (DURATION - FADE);
        const outLabel = i === n - 1 ? "[outv]" : `[xf${i}]`;
        xfadeParts.push(
          `${prev}[s${i}]xfade=transition=fade:duration=${FADE}:offset=${offset}${outLabel}`
        );
        prev = outLabel;
      }
      filterComplex += xfadeParts.join(";");
      lastLabel = "[outv]";
    }

    const ffmpegArgs = [
      ...inputs,
      ...(bgmPath ? ["-i", bgmPath] : []),
      "-filter_complex",
      filterComplex,
      "-map",
      lastLabel,
      ...(bgmPath ? ["-map", `${framePaths.length}:a`] : []),
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      ...(bgmPath ? ["-c:a", "aac", "-b:a", "128k", "-ar", "48000", "-ac", "2", "-shortest"] : ["-an"]),
      "-y",
      outputPath,
    ];

    const result = spawnSync(ffmpegBin, ffmpegArgs, {
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 64 * 1024 * 1024,
      timeout: 120000,
    });

    if (result.status !== 0) {
      const stderr = result.stderr?.toString() ?? "";
      throw new Error(`ffmpeg失敗 (exit ${result.status}): ${stderr.slice(-1000)}`);
    }

    return readFileSync(outputPath);
  } finally {
    for (const p of framePaths) {
      if (existsSync(p)) unlinkSync(p);
    }
    if (bgmPath && existsSync(bgmPath)) unlinkSync(bgmPath);
    if (existsSync(outputPath)) unlinkSync(outputPath);
  }
}

async function uploadVideoToCloudinary(videoBuffer: Buffer): Promise<string> {
  const cloudName = cleanEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = cleanEnv("CLOUDINARY_API_KEY");
  const apiSecret = cleanEnv("CLOUDINARY_API_SECRET");
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHash("sha256")
    .update(`timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const form = new FormData();
  form.append("file", `data:video/mp4;base64,${videoBuffer.toString("base64")}`);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("signature", signature);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
    { method: "POST", body: form }
  );
  const uploadJson = await uploadRes.json();
  if (!uploadJson.secure_url)
    throw new Error(`Cloudinary動画アップロード失敗: ${JSON.stringify(uploadJson)}`);

  return uploadJson.secure_url as string;
}

async function postReel(post: ReelPost): Promise<{ postId: string; firstFrameUrl: string }> {
  const accountId = cleanEnv("INSTAGRAM_BUSINESS_ACCOUNT_ID");
  const token = cleanEnv("INSTAGRAM_ACCESS_TOKEN");

  if (post.slides.length < 1 || post.slides.length > 6) {
    throw new Error(
      `リールのスライド数が不正です: ${post.slides.length}（1〜6枚必要）`
    );
  }

  // 各スライドを並列生成（9:16縦型）
  const frames: Buffer[] = await Promise.all(
    post.slides.map(async (slide, idx) => {
      const jpegBuffer = await generateImage(slide.imagePrompt, "9:16");
      // 1枚目のみ hookText を使用、残りは overlayText
      const text =
        idx === 0 && post.hookText ? post.hookText : slide.overlayText;
      return compositeTextAndBrandingVertical(jpegBuffer, text);
    })
  );

  // 1枚目フレームをCloudinaryに画像としてもアップロード（Threads流用用）
  const firstFrameUrl = await uploadImageToCloudinary(frames[0]);

  // ffmpegでスライドショーMP4生成
  const bgmUrl = cleanEnv("REEL_BGM_URL") || undefined;
  const videoBuffer = await buildSlideShowVideo(frames, bgmUrl);

  // Cloudinaryに動画アップロード → 公開URL取得
  const videoUrl = await uploadVideoToCloudinary(videoBuffer);

  // Reelsコンテナ作成（video_url を使う）
  const containerBody: Record<string, unknown> = {
    media_type: "REELS",
    video_url: videoUrl,
    caption: post.caption,
    share_to_feed: true,
    access_token: token,
  };

  const containerRes = await fetch(
    `${INSTAGRAM_API_BASE}/${accountId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(containerBody),
    }
  );
  const container = await containerRes.json();
  if (!container.id)
    throw new Error(`Reelsコンテナ作成失敗: ${JSON.stringify(container)}`);

  await waitForContainer(container.id, token, 40, "Reelsコンテナ");

  const publishRes = await fetch(
    `${INSTAGRAM_API_BASE}/${accountId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: container.id, access_token: token }),
    }
  );
  const published = await publishRes.json();
  if (!published.id)
    throw new Error(`Reels公開失敗: ${JSON.stringify(published)}`);

  return { postId: published.id as string, firstFrameUrl };
}

// ─────────────────────────────────────────────
// Threads スレッド投稿（Instagramとは別設計）
// ─────────────────────────────────────────────

async function publishThreadPost(
  text: string,
  options: { replyToId?: string } = {},
): Promise<string | null> {
  // Secret Manager 経由の値はBOM・CRLF・クォートが混入することがある
  const userId = cleanEnv("THREADS_USER_ID");
  const token = cleanEnv("THREADS_ACCESS_TOKEN") || cleanEnv("INSTAGRAM_ACCESS_TOKEN");
  if (!userId || !token) return null;

  const body: Record<string, string> = {
    media_type: "TEXT",
    text,
    access_token: token,
  };
  if (options.replyToId) body.reply_to_id = options.replyToId;

  const containerRes = await fetch(`${THREADS_API_BASE}/${userId}/threads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const container = await containerRes.json();
  if (!container.id) {
    console.error("Threads コンテナ作成失敗:", container);
    return null;
  }

  await new Promise((r) => setTimeout(r, 30000));

  const publishRes = await fetch(`${THREADS_API_BASE}/${userId}/threads_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creation_id: container.id, access_token: token }),
  });
  const published = await publishRes.json();
  if (!published.id) {
    console.error("Threads 公開失敗:", published);
    return null;
  }
  return published.id as string;
}

async function postThreadChain(post: QueuedPost): Promise<{ rootId: string; postIds: string[] } | null> {
  const threadPosts = (post.threadPosts ?? [])
    .map((text) => text.trim())
    .filter(Boolean);
  if (!threadPosts.length) return null;

  const postIds: string[] = [];
  let replyToId: string | undefined;

  for (const text of threadPosts) {
    const id = await publishThreadPost(text, { replyToId });
    if (!id) return postIds.length ? { rootId: postIds[0], postIds } : null;
    postIds.push(id);
    replyToId = id;
    await new Promise((r) => setTimeout(r, 5000));
  }

  return { rootId: postIds[0], postIds };
}

// ─────────────────────────────────────────────
// メインハンドラ
// ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let queueDocRef: DocumentReference | null = null;
  try {
    const body = await req.json().catch(() => ({}));
    const isManual = Boolean(
      (body.type === "reel" && body.caption && body.slides) ||
      (body.instagram?.type === "reel" && body.instagram?.caption && body.instagram?.slides)
    );

    if (isManual) {
      const auth = await verifyAdminToken(req);
      if (auth instanceof NextResponse) return auth;
    } else {
      const cronSecret = req.headers.get("x-cron-secret");
      const expectedSecret = cleanEnv("CRON_SECRET");
      if (cronSecret !== expectedSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Firestoreキューまたはリクエストボディからポストデータを取得
    let post: QueuedPost;
    if (isManual) {
      post = normalizeQueuedPost(body as Record<string, unknown>);
    } else {
      const dequeued = await dequeueNextPost();
      if (dequeued) {
        post = dequeued.post;
        queueDocRef = dequeued.docRef;
      } else {
        return NextResponse.json({
          success: true,
          skipped: true,
          reason: "No pending scheduled SNS post in Firestore queue",
        });
      }
    }

    const { postId } = await postReel(post);
    const threadResult = await postThreadChain(post).catch(() => null);
    const result = NextResponse.json({
      success: true,
      postId,
      threadsRootId: threadResult?.rootId ?? null,
      threadsPostIds: threadResult?.postIds ?? [],
      type: "reel",
      caption: post.caption,
      slideCount: post.slides.length,
    });

    if (queueDocRef) {
      await queueDocRef.update({
        status: "posted",
        postedAt: new Date(),
        result: {
          instagramPostId: postId,
          threadsRootId: threadResult?.rootId ?? null,
          threadsPostIds: threadResult?.postIds ?? [],
        },
      });
    }

    return result;
  } catch (error) {
    console.error("Instagram投稿エラー:", error);
    if (queueDocRef) {
      await queueDocRef.update({
        status: "failed",
        errorMessage: String(error),
        failedAt: new Date(),
      });
    }
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
