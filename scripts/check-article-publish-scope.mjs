import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import matter from "gray-matter";

const root = resolve(import.meta.dirname, "..");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(message, code = 1) {
  console.error(`ERROR: ${message}`);
  process.exit(code);
}

function git(args) {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  } catch (error) {
    const detail = error.stderr?.trim() || error.message;
    fail(`git ${args.join(" ")} の実行に失敗しました: ${detail}`, 2);
  }
}

function parseArgs(argv) {
  let slug;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--article" && argv[index + 1]) slug = argv[++index];
    else if (arg.startsWith("--article=")) slug = arg.slice("--article=".length);
    else if (arg === "--staged") continue;
    else if (arg === "--help" || arg === "-h") {
      console.log("Usage: npm run articles:publish-scope -- --article=<slug> [--staged]\n\nmainブランチとorigin/mainの関係を確認し、stage済みの公開対象だけを検査します。--stagedは明示用で、常にstage済みファイルのみが対象です。");
      process.exit(0);
    } else fail(`不明な引数です: ${arg}`, 2);
  }
  if (!slug) fail("--article=<slug> は必須です。", 2);
  if (!slugPattern.test(slug)) fail(`不正なslugです: ${slug}`, 2);
  return slug;
}

function stagedPaths() {
  let output;
  try {
    output = execFileSync("git", ["diff", "--cached", "--name-only", "-z", "--diff-filter=ACMRD"], {
      cwd: root,
      encoding: "utf8",
    });
  } catch (error) {
    fail(`stage済みファイルを取得できません: ${error.stderr?.trim() || error.message}`, 2);
  }
  return output.split("\0").filter(Boolean).map((path) => path.replaceAll("\\", "/"));
}

function forbiddenReason(path) {
  const lower = path.toLowerCase();
  const parts = lower.split("/");
  if (parts.some((part) => part === ".env" || part.startsWith(".env."))) return ".envファイル";
  if (/\.(?:pem|key|p12|pfx|jks|keystore)$/i.test(path)) return "秘密鍵・証明書";
  if (/(?:^|\/)(?:secret|secrets|credentials?)(?:\/|\.|$)/i.test(path)) return "秘密情報";
  if (lower.includes("sns") || lower.includes("postsqueue")) return "SNS関連";
  if (lower.includes("fantasyquizzeskingdom") || /(?:^|\/)fqk(?:\/|\.|-|$)/i.test(path)) return "Fantasy Quizzes Kingdom関連";
  return null;
}

const slug = parseArgs(process.argv.slice(2));
const branch = git(["branch", "--show-current"]);
if (branch !== "main") fail(`現在のbranchはmainではありません: ${branch || "detached HEAD"}`);

git(["rev-parse", "--verify", "origin/main"]);
const ancestry = spawnSync("git", ["merge-base", "--is-ancestor", "origin/main", "HEAD"], { cwd: root, encoding: "utf8" });
if (ancestry.status === 1) fail("HEADがorigin/mainを含んでいません。git fetch後にmainを最新化してください。");
if (ancestry.status !== 0) fail(`origin/mainとの祖先関係を確認できません: ${ancestry.stderr?.trim() || "unknown error"}`, 2);

const paths = stagedPaths();
if (paths.length === 0) fail("stage済みのcommit候補がありません。");

const article = `src/content/posts/${slug}.md`;
if (!paths.includes(article)) fail(`対象記事がstageされていません: ${article}`);
const articlePath = join(root, article);
if (!existsSync(articlePath)) fail(`対象記事が存在しません: ${article}`);
const primaryTag = matter(readFileSync(articlePath, "utf8")).data.tags?.[0];
if (!new Set(["AIUpdate", "CaseStudy"]).has(primaryTag)) fail(`対象記事のprimary tagが不正です: ${String(primaryTag)}`);

const allowed = new Set([article, "data/insights/sparks-article-insights.json"]);
if (primaryTag === "CaseStudy") {
  allowed.add(`docs/research/articles/${slug}.md`);
  allowed.add("data/monetization/saas-case-database.seed.json");
  for (const required of [`docs/research/articles/${slug}.md`, "data/monetization/saas-case-database.seed.json"]) {
    if (!paths.includes(required)) fail(`CaseStudyの必須ファイルがstageされていません: ${required}`);
  }
}
const violations = [];
for (const path of paths) {
  const forbidden = forbiddenReason(path);
  if (forbidden) violations.push(`${path}（禁止対象: ${forbidden}）`);
  else if (!allowed.has(path)) violations.push(`${path}（allowlist外）`);
}
if (violations.length) {
  console.error("ERROR: stage済みファイルに公開対象外の変更があります:");
  violations.forEach((violation) => console.error(`  - ${violation}`));
  process.exit(1);
}

console.log(`公開scope検証OK: main / origin/mainを包含 / ${paths.length}ファイル`);
paths.forEach((path) => console.log(`  - ${path}`));
