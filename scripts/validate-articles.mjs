import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, extname, isAbsolute, join, relative, resolve } from "node:path";
import matter from "gray-matter";

const root = resolve(import.meta.dirname, "..");
const postsDir = join(root, "src/content/posts");
const dbPath = join(root, "data/monetization/saas-case-database.seed.json");
const allowedTags = new Set([
  "AIUpdate", "CaseStudy",
  "AI", "SaaS", "MobileApp", "DeepTech", "Strategy", "GTM", "Product",
  "TechStack", "Monetization", "Bootstrapped", "Exit", "BuildInPublic", "Failure",
]);
const legacyTags = new Set(["SuccessCase", "FailureCase", "Concept"]);
const primaryTags = new Set(["AIUpdate", "CaseStudy"]);
const strictSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const errors = [];
const warnings = [];

function report(level, file, message) {
  (level === "error" ? errors : warnings).push(`${relative(root, file)}: ${message}`);
}

function parseArgs(argv) {
  const articles = [];
  let all = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--all") all = true;
    else if (arg === "--article" && argv[i + 1]) articles.push(argv[++i]);
    else if (arg.startsWith("--article=")) articles.push(arg.slice(10));
    else if (arg === "--help" || arg === "-h") {
      console.log("Usage: npm run articles:validate -- [--article=<slug-or-path> ... | --all]\n\n引数なしではGit上の新規・変更記事を厳格検証します。--articleも厳格、--allは既存記事を互換モードで監査します。");
      process.exit(0);
    } else throw new Error(`不明な引数です: ${arg}`);
  }
  if (all && articles.length) throw new Error("--all と --article は同時に指定できません。");
  return { all, articles };
}

function articlePath(value) {
  const withExtension = extname(value) ? value : `${value}.md`;
  const candidate = isAbsolute(withExtension) ? withExtension : withExtension.includes("/") || withExtension.includes("\\")
    ? resolve(root, withExtension)
    : join(postsDir, withExtension);
  const normalized = resolve(candidate);
  if (!normalized.startsWith(`${postsDir}\\`) && normalized !== postsDir) throw new Error(`記事ディレクトリ外です: ${value}`);
  if (!existsSync(normalized)) throw new Error(`記事が見つかりません: ${value}`);
  return normalized;
}

function changedArticles() {
  let output = "";
  try {
    output = execFileSync("git", ["status", "--porcelain=v1", "--untracked-files=all"], { cwd: root, encoding: "utf8" });
  } catch (error) {
    throw new Error(`Gitの変更記事を取得できません: ${error.message}`);
  }
  return output.split(/\r?\n/).filter(Boolean).map((line) => line.slice(3).trim().replace(/^"|"$/g, ""))
    .filter((path) => /^src[\\/]content[\\/]posts[\\/].+\.md$/i.test(path) && existsSync(resolve(root, path)))
    .map((path) => resolve(root, path));
}

function loadDb() {
  try {
    const value = JSON.parse(readFileSync(dbPath, "utf8"));
    if (!Array.isArray(value)) throw new Error("ルートは配列である必要があります");
    return value;
  } catch (error) {
    report("error", dbPath, `JSONを解析できません: ${error.message}`);
    return [];
  }
}

function validateDbDuplicates(rows) {
  const ids = new Map();
  rows.forEach((row, index) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      report("error", dbPath, `${index + 1}行目がオブジェクトではありません。`);
      return;
    }
    if (typeof row.id !== "string" || !row.id) report("error", dbPath, `${index + 1}行目にidがありません。`);
    else if (ids.has(row.id)) report("error", dbPath, `id「${row.id}」が重複しています（${ids.get(row.id) + 1}行目、${index + 1}行目）。`);
    else ids.set(row.id, index);
  });
}

function patternFor(primary) {
  if (primary === "AIUpdate") return "C";
  if (["CaseStudy", "SuccessCase", "FailureCase"].includes(primary)) return "A";
  if (primary === "Concept") return "B";
  return null;
}

const requiredSections = {
  A: ["サマリー", "Fact", "Insight", "Localize"],
  B: ["サマリー", "Concept", "Engineering", "Sparks"],
  C: ["サマリー", "Fact", "Impact", "Localize"],
};

function plainCharacterCount(body) {
  return Array.from(body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!?'?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[>*_`~|\-]/g, "")
    .replace(/\s/g, "")).length;
}

function validateLinks(file, body, level) {
  const regex = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
  for (const match of body.matchAll(regex)) {
    const target = match[1].replace(/^<|>$/g, "").split(/[?#]/)[0];
    if (!target || /^(?:https?:|mailto:|tel:|#)/i.test(target)) continue;
    if (target.startsWith("/posts/")) {
      const slug = target.slice(7).replace(/\/$/, "");
      if (!existsSync(join(postsDir, `${slug}.md`))) report(level, file, `存在しない記事リンクです: ${target}`);
    } else {
      const destination = target.startsWith("/") ? join(root, "public", target) : resolve(file, "..", target);
      if (!existsSync(destination)) report(level, file, `存在しないローカルリンク/画像です: ${target}`);
    }
  }
}

function validateArticle(file, rows, strict) {
  const slug = basename(file, ".md");
  let parsed;
  try {
    parsed = matter(readFileSync(file, "utf8"));
  } catch (error) {
    report("error", file, `frontmatterを解析できません: ${error.message}`);
    return;
  }
  const { data, content } = parsed;
  const editorial = strict ? "error" : "warning";

  if (!strictSlug.test(slug)) report(editorial, file, `slug「${slug}」は英小文字・数字・ハイフンのみで構成してください。`);
  for (const field of ["title", "date", "tags", "summary"]) {
    if (data[field] === undefined || data[field] === null || data[field] === "") report("error", file, `必須frontmatter「${field}」がありません。`);
  }
  if (data.title !== undefined && (typeof data.title !== "string" || !data.title.trim())) report("error", file, "titleは空でない文字列にしてください。");
  if (data.date !== undefined) {
    const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date);
    if (!datePattern.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) report("error", file, "dateは実在するYYYY-MM-DD形式の日付にしてください。");
  }
  const tags = Array.isArray(data.tags) ? data.tags : [];
  if (!Array.isArray(data.tags)) report("error", file, "tagsは配列にしてください。");
  if (tags.length === 0) report("error", file, "tagsを1つ以上指定してください。");
  if (tags.length > 4) report(editorial, file, `タグは最大4個です（現在${tags.length}個）。`);
  tags.forEach((tag) => {
    if (typeof tag !== "string" || (!allowedTags.has(tag) && !(legacyTags.has(tag) && !strict))) {
      report(editorial, file, `許可されていないタグです: ${String(tag)}`);
    } else if (!strict && legacyTags.has(tag)) {
      report("warning", file, `旧タグ「${tag}」が残っています。新規記事ではAIUpdateまたはCaseStudyへ移行してください。`);
    }
  });
  if (tags[0] && !primaryTags.has(tags[0])) report(editorial, file, `tags[0]「${tags[0]}」はprimary tagではありません。`);

  if (data.summary !== undefined) {
    const summaryLength = typeof data.summary === "string" ? Array.from(data.summary.trim()).length : 0;
    if (typeof data.summary !== "string" || summaryLength === 0) report("error", file, "summaryは空でない文字列にしてください。");
    else if (summaryLength < 180 || summaryLength > 220) report(editorial, file, `summaryは180〜220字にしてください（現在${summaryLength}字）。`);
  }

  const bodyLength = plainCharacterCount(content);
  if (bodyLength < 4000) report(editorial, file, `本文は4,000字以上を目安にしてください（Markdown記号・空白を除き現在${bodyLength}字）。`);
  const pattern = patternFor(tags[0]);
  if (pattern) {
    const headings = [...content.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].toLowerCase());
    for (const section of requiredSections[pattern]) {
      if (!headings.some((heading) => heading.includes(section.toLowerCase()))) report(editorial, file, `Pattern ${pattern}の必須H2「${section}」がありません。`);
    }
  }

  validateLinks(file, content, editorial);
  if (typeof data.image === "string" && data.image.startsWith("/")) {
    const imagePath = join(root, "public", data.image.split(/[?#]/)[0]);
    if (!existsSync(imagePath)) report(editorial, file, `frontmatterの画像が存在しません: ${data.image}`);
  }

  const expectedSources = new Set([`/posts/${slug}`, `src/content/posts/${slug}.md`]);
  const matchingRows = rows.filter((row) => row?.id === slug || (Array.isArray(row?.sourceUrls) && row.sourceUrls.some((source) => expectedSources.has(source))));
  if (pattern === "A" && matchingRows.length === 0) report(editorial, file, "Pattern Aに対応するSaaS Case DB行がありません。idまたはsourceUrlsをslugと一致させてください。");
  if (pattern === "A" && matchingRows.length > 1) report("error", file, `Pattern Aに対応するSaaS Case DB行が${matchingRows.length}件あり、重複しています。`);
  if (pattern === "A" && strict && !existsSync(join(root, "docs/research/articles", `${slug}.md`))) {
    report("error", file, `Pattern Aの調査記録がありません: docs/research/articles/${slug}.md`);
  }
  if (pattern === "C" && matchingRows.length > 0) report(editorial, file, "Pattern CではSaaS Case DB行を作成しないでください。対応行を削除してください。");
}

let options;
try {
  options = parseArgs(process.argv.slice(2));
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(2);
}

const rows = loadDb();
validateDbDuplicates(rows);
let files;
try {
  files = options.all
    ? readdirSync(postsDir).filter((name) => name.endsWith(".md")).map((name) => join(postsDir, name))
    : options.articles.length ? options.articles.map(articlePath) : changedArticles();
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(2);
}
files = [...new Set(files)];
if (files.length === 0) {
  console.error("ERROR: 検証対象の記事がありません。--article=<slug> または --all を指定してください。");
  process.exit(2);
}
for (const file of files) validateArticle(file, rows, !options.all);

for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);
console.log(`記事検証: ${files.length}件 / エラー ${errors.length}件 / 警告 ${warnings.length}件`);
process.exit(errors.length ? 1 : 0);
