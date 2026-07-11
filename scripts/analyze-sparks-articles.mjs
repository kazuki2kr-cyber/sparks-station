import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { basename, dirname, join } from "path";
import matter from "gray-matter";

const root = process.cwd();
const postsDir = join(root, "src/content/posts");
const dbPath = join(root, "data/monetization/saas-case-database.seed.json");
const defaultOutPath = join(root, "data/insights/sparks-article-insights.json");

function getArgValue(name, fallback = null) {
  const prefix = `${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf-8"));
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf-8");
}

function compact(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function includesAny(haystack, needles) {
  const lower = haystack.toLowerCase();
  return needles.some((needle) => lower.includes(needle.toLowerCase()));
}

function readPosts() {
  return readdirSync(postsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = basename(file, ".md");
      const fullPath = join(postsDir, file);
      const raw = readFileSync(fullPath, "utf-8").replace(/\r\n/g, "\n");
      const parsed = matter(raw);
      return {
        slug,
        file: `src/content/posts/${file}`,
        articleUrl: `/posts/${slug}`,
        title: compact(parsed.data.title),
        date: compact(parsed.data.date),
        tags: Array.isArray(parsed.data.tags) ? parsed.data.tags : [],
        isArchived: Boolean(parsed.data.isArchived),
        summary: compact(parsed.data.summary),
        mrr: parsed.data.mrr ?? null,
        exitPrice: parsed.data.exit_price ?? null,
        content: parsed.content,
      };
    })
    .filter((post) => !post.isArchived)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

function findDbRow(post, dbRows) {
  const slugNeedles = [
    `/posts/${post.slug}`,
    `src/content/posts/${post.slug}.md`,
    post.file,
  ];

  return dbRows.find((row) => {
    const sourceUrls = Array.isArray(row.sourceUrls) ? row.sourceUrls : [];
    return sourceUrls.some((source) => slugNeedles.includes(source));
  }) ?? null;
}

function detectPattern(post, row) {
  const titleAndTags = [post.title, post.tags.join(" "), row?.category, row?.gtmPattern, row?.pricingModel].join("\n");
  const haystack = [
    post.title,
    post.summary,
    post.tags.join(" "),
    post.content,
    row?.pricingModel,
    row?.acquisitionChannel,
    row?.gtmPattern,
    row?.successFactor,
    row?.riskOrFailure,
    row?.japanHypothesis,
  ].join("\n");

  if (post.tags.includes("FailureCase") || post.tags.includes("Failure") || includesAny(haystack, ["閉鎖", "活動停止", "規制", "支払い手", "保険償還", "CAC", "顧客獲得コスト"])) {
    return {
      id: "failure_or_payer_risk",
      label: "失敗診断 / 支払い手と導入コスト",
      buyerLogic: "技術より先に、誰が払うか、導入と継続で利益が残るかを見る。",
    };
  }
  if (includesAny(titleAndTags, ["買収", "売却", "Exit", "Acquisition", "acquire", "holding company", "ホールディング"])) {
    return {
      id: "buy_then_optimize",
      label: "買って直す / 小規模SaaS運用改善",
      buyerLogic: "ゼロから作らず、既存SaaSの価格・導線・オンボーディングを直して伸ばす。",
    };
  }
  if (includesAny(haystack, ["Lifetime Deal", "LTD", "買い切り", "先行販売", "pre-sell"])) {
    return {
      id: "pre_sold_or_ltd",
      label: "作る前に売る / LTD検証",
      buyerLogic: "事前支払いで需要を確認し、開発前後の資金と学習速度を確保する。",
    };
  }
  if (includesAny(haystack, ["価格", "値上げ", "pricing", "安価", "Typeform", "BYOK", "APIキー"])) {
    return {
      id: "pricing_and_packaging",
      label: "価格設計 / 課金理由の明確化",
      buyerLogic: "機能ではなく、支払い理由と料金形態を顧客の不満に合わせる。",
    };
  }
  if (includesAny(haystack, ["SEO", "GEO", "検索", "comparison", "代替キーワード", "テンプレート"])) {
    return {
      id: "search_or_template_wedge",
      label: "検索需要 / テンプレート導線",
      buyerLogic: "購買前の検索行動を押さえ、比較・テンプレート・代替需要から獲得する。",
    };
  }
  if (includesAny(haystack, ["Build in Public", "LinkedIn", "X", "Reddit", "Discord", "コミュニティ", "インフルエンサー"])) {
    return {
      id: "founder_distribution",
      label: "創業者発信 / コミュニティGTM",
      buyerLogic: "製品完成前から信頼と流通を作り、初期顧客に届ける。",
    };
  }
  return {
    id: "general_case_breakdown",
    label: "事例分解 / 日本転用",
    buyerLogic: "顧客、課金理由、初期導線、日本で試せる小さな実験に分解する。",
  };
}

function pickProductCta(post, row, pattern) {
  const haystack = [
    post.tags.join(" "),
    post.title,
    post.summary,
    row?.monetizationFit,
    row?.japanHypothesis,
    pattern.id,
  ].join(" ");

  if (includesAny(haystack, ["失敗", "FailureCase", "Failure", "規制", "DeepTech", "payer_risk"])) {
    return {
      id: "pro_validation",
      label: "Sparks Station Pro先行案内",
      reason: "作る前の検証、支払い手、導入コストの見極めに向いている。",
      href: "/products#pro",
    };
  }
  if (includesAny(haystack, ["GTM", "Monetization", "pricing", "LTD", "買い切り", "SaaS", "Micro-SaaS"])) {
    return {
      id: "saas_case_db",
      label: "SaaS Case DB",
      reason: "類似事例を横断して、価格・GTM・日本転用を比較しやすい。",
      href: "/products#saas-case-db",
    };
  }
  return {
    id: "products",
    label: "Products",
    reason: "記事の学びを、DBや先行案内から次の検証へつなげる。",
    href: "/products",
  };
}

function buildInsights(posts, dbRows) {
  return posts.map((post) => {
    const row = findDbRow(post, dbRows);
    const pattern = detectPattern(post, row);
    const cta = pickProductCta(post, row, pattern);
    return {
      slug: post.slug,
      title: post.title,
      date: post.date,
      tags: post.tags,
      articleUrl: post.articleUrl,
      file: post.file,
      hasDbRow: Boolean(row),
      dbRowId: row?.id ?? null,
      productName: row?.productName ?? inferProductName(post.title),
      category: row?.category ?? post.tags.join(" / "),
      payer: row?.targetCustomer ?? inferPayer(post),
      pain: row?.pain ?? inferPain(post),
      pricingModel: row?.pricingModel ?? null,
      revenue: row?.revenue ?? post.mrr ?? post.exitPrice ?? null,
      acquisitionChannel: row?.acquisitionChannel ?? null,
      gtmPattern: row?.gtmPattern ?? null,
      successOrFailureFactor: row?.successFactor ?? row?.riskOrFailure ?? null,
      japanHypothesis: row?.japanHypothesis ?? null,
      firstExperiment: row?.firstExperiment ?? null,
      recommendedTools: row?.recommendedTools ?? [],
      sellingPattern: pattern,
      productCta: cta,
    };
  });
}

function inferProductName(title) {
  const quoted = title.match(/[「『](.+?)[」』]/);
  return quoted?.[1] ?? title.split(/[。\.]/)[0].slice(0, 40);
}

function inferPayer(post) {
  if (post.tags.includes("MobileApp")) return "特定用途のアプリを探す個人ユーザー";
  if (post.tags.includes("DeepTech")) return "規制産業・研究開発領域の事業者または支払い手";
  if (post.tags.includes("AI")) return "AIで業務や制作を効率化したい個人・小規模チーム";
  return "SaaSや業務ツールに課金する小規模事業者・個人開発者";
}

function inferPain(post) {
  if (post.tags.includes("FailureCase") || post.tags.includes("Failure")) return "技術やプロダクトはあっても、支払い手・導入・継続の構造が弱い。";
  if (post.tags.includes("GTM")) return "良い製品を作っても、最初の顧客に届かない。";
  if (post.tags.includes("Monetization")) return "価格、課金理由、継続利用の設計が難しい。";
  return "作れるが、何を誰にどう売るかの解像度が足りない。";
}

function summarizePatterns(insights) {
  return insights.reduce((acc, item) => {
    const key = item.sellingPattern.id;
    acc[key] ??= {
      id: key,
      label: item.sellingPattern.label,
      count: 0,
      examples: [],
    };
    acc[key].count += 1;
    if (acc[key].examples.length < 5) {
      acc[key].examples.push({
        slug: item.slug,
        title: item.title,
        productName: item.productName,
      });
    }
    return acc;
  }, {});
}

const outPath = getArgValue("--out", defaultOutPath);

const dbRows = readJson(dbPath, []);
const posts = readPosts();
const insights = buildInsights(posts, dbRows);
const patternSummary = Object.values(summarizePatterns(insights)).sort((a, b) => b.count - a.count);
const report = {
  generatedAt: new Date().toISOString(),
  source: {
    postsDir: "src/content/posts",
    dbPath: "data/monetization/saas-case-database.seed.json",
  },
  totals: {
    posts: posts.length,
    dbRows: dbRows.length,
    postsWithDbRows: insights.filter((item) => item.hasDbRow).length,
    postsWithoutDbRows: insights.filter((item) => !item.hasDbRow).length,
  },
  patterns: patternSummary,
  insights,
};

writeJson(outPath, report);

console.log(`Article insights: posts=${report.totals.posts}, dbMatched=${report.totals.postsWithDbRows}/${report.totals.posts}`);
console.table(
  patternSummary.map((pattern) => ({
    pattern: pattern.label,
    count: pattern.count,
  }))
);
console.log(`Saved: ${outPath}`);
