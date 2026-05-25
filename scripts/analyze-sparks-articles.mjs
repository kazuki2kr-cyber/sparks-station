import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { basename, dirname, join } from "path";
import matter from "gray-matter";

const root = process.cwd();
const postsDir = join(root, "src/content/posts");
const dbPath = join(root, "data/monetization/saas-case-database.seed.json");
const defaultOutPath = join(root, "data/insights/sparks-article-insights.json");
const defaultCandidatesPath = join(root, "tmp/sns-candidates-latest.json");
const defaultInsightsPath = join(root, "tmp/sns-insights-latest.json");

function getArgValue(name, fallback = null) {
  const prefix = `${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
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
        summary: compact(parsed.data.summary),
        mrr: parsed.data.mrr ?? null,
        exitPrice: parsed.data.exit_price ?? null,
        content: parsed.content,
      };
    })
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

  if (post.tags.includes("FailureCase") || includesAny(haystack, ["閉鎖", "活動停止", "規制", "支払い手", "保険償還", "CAC", "顧客獲得コスト"])) {
    return {
      id: "failure_or_payer_risk",
      label: "失敗診断 / 支払い手と導入コスト",
      buyerLogic: "技術より先に、誰が払うか、導入と継続で利益が残るかを見る。",
      snsAngle: "技術が強くても売れない理由、規制産業、CACと導入コスト",
    };
  }
  if (includesAny(titleAndTags, ["買収", "売却", "Exit", "Acquisition", "acquire", "holding company", "ホールディング"])) {
    return {
      id: "buy_then_optimize",
      label: "買って直す / 小規模SaaS運用改善",
      buyerLogic: "ゼロから作らず、既存SaaSの価格・導線・オンボーディングを直して伸ばす。",
      snsAngle: "新機能なしで売上を伸ばす、SaaS買収/DD、運用改善",
    };
  }
  if (includesAny(haystack, ["Lifetime Deal", "LTD", "買い切り", "先行販売", "pre-sell"])) {
    return {
      id: "pre_sold_or_ltd",
      label: "作る前に売る / LTD検証",
      buyerLogic: "事前支払いで需要を確認し、開発前後の資金と学習速度を確保する。",
      snsAngle: "作る前に売る順番、LTDの使い方、買い切りから月額への移行",
    };
  }
  if (includesAny(haystack, ["価格", "値上げ", "pricing", "安価", "Typeform", "BYOK", "APIキー"])) {
    return {
      id: "pricing_and_packaging",
      label: "価格設計 / 課金理由の明確化",
      buyerLogic: "機能ではなく、支払い理由と料金形態を顧客の不満に合わせる。",
      snsAngle: "価格の決め方、安売りの罠、買い切り/BYOK/従量課金の使い分け",
    };
  }
  if (includesAny(haystack, ["SEO", "GEO", "検索", "comparison", "代替キーワード", "テンプレート"])) {
    return {
      id: "search_or_template_wedge",
      label: "検索需要 / テンプレート導線",
      buyerLogic: "購買前の検索行動を押さえ、比較・テンプレート・代替需要から獲得する。",
      snsAngle: "SEOだけで買われる条件、比較記事、テンプレートを入口にする方法",
    };
  }
  if (includesAny(haystack, ["Build in Public", "LinkedIn", "X", "Reddit", "Discord", "コミュニティ", "インフルエンサー"])) {
    return {
      id: "founder_distribution",
      label: "創業者発信 / コミュニティGTM",
      buyerLogic: "製品完成前から信頼と流通を作り、初期顧客に届ける。",
      snsAngle: "発信を販売導線に変える方法、共同創業者やコミュニティの使い方",
    };
  }
  return {
    id: "general_case_breakdown",
    label: "事例分解 / 日本転用",
    buyerLogic: "顧客、課金理由、初期導線、日本で試せる小さな実験に分解する。",
    snsAngle: "成功事例の分解、日本で試すなら、作る前の問い",
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

  if (includesAny(haystack, ["失敗", "FailureCase", "規制", "DeepTech", "payer_risk"])) {
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
      snsSeeds: {
        instagramAngle: pattern.snsAngle,
        suggestedCta:
          cta.id === "saas_case_db"
            ? "詳しい事例比較はSaaS Case DBへ"
            : "作る前の検証メモとして保存",
      },
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
  if (post.tags.includes("FailureCase")) return "技術やプロダクトはあっても、支払い手・導入・継続の構造が弱い。";
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

function scoreInsightForSns(item, snsReport) {
  const recentPostedSlugs = new Set(
    (snsReport?.posts ?? [])
      .map((post) => String(post.articleUrl ?? "").split("/posts/")[1])
      .filter(Boolean)
  );

  let score = item.hasDbRow ? 3 : 1;
  if (item.tags.includes("GTM")) score += 2;
  if (item.tags.includes("Monetization")) score += 2;
  if (item.tags.includes("SuccessCase")) score += 1;
  if (item.tags.includes("FailureCase")) score += 1;
  if (item.revenue) score += 1;
  if (item.firstExperiment) score += 1;
  if (recentPostedSlugs.has(item.slug)) score -= 2;
  return score;
}

function buildSnsCandidates(insights, snsReport) {
  const patternsByRecentPerformance = new Map();
  for (const post of snsReport?.posts ?? []) {
    const pattern = post.contentTheme ?? "unknown";
    const saved = Number(post.instagram?.insights?.saved ?? 0);
    const shares = Number(post.instagram?.insights?.shares ?? 0);
    patternsByRecentPerformance.set(
      pattern,
      (patternsByRecentPerformance.get(pattern) ?? 0) + saved * 3 + shares * 2
    );
  }

  return insights
    .map((item) => ({
      score: scoreInsightForSns(item, snsReport),
      item,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(({ item, score }, index) => ({
      id: `candidate_${String(index + 1).padStart(2, "0")}_${item.slug}`,
      approved: false,
      status: "proposal",
      manualOnly: true,
      seedScript: "scripts/seed-approved-sns-candidates.mjs",
      score,
      slug: item.slug,
      caseName: item.productName,
      articleUrl: `https://sparks-station.com${item.articleUrl}`,
      sourceUrl: item.file,
      contentTheme: mapPatternToTheme(item.sellingPattern.id),
      reason: `${item.sellingPattern.label}として再利用しやすい。${item.productCta.reason}`,
      instagramAngle: item.snsSeeds.instagramAngle,
      suggestedCta: item.snsSeeds.suggestedCta,
      requiredBeforeSeeding: [
        "市川さんが「次の週のSNS投稿案を作成して」などSNS投稿案作成を明示指示する",
        "Instagramの投稿本文、hookText、slidesをレビュー済みにする",
        "`approved: true` に変更する",
        "scheduledAtを設定する",
      ],
      queueDraft: {
        type: "reel",
        platforms: ["instagram"],
        contentTheme: mapPatternToTheme(item.sellingPattern.id),
        caseName: item.productName,
        articleUrl: `https://sparks-station.com${item.articleUrl}`,
        sourceUrl: item.file,
        order: index + 1,
        scheduledAt: null,
        status: "draft",
        instagram: {
          type: "reel",
          templateId: `reel_${mapPatternToTheme(item.sellingPattern.id)}`,
          hookText: "",
          caption: "",
          slides: [],
          ctaType: item.productCta.id === "saas_case_db" ? "profile" : "save",
          targetKpi: item.productCta.id === "saas_case_db" ? "profile_visits" : "saves",
        },
      },
    }));
}

function mapPatternToTheme(patternId) {
  const map = {
    pre_sold_or_ltd: "validation",
    pricing_and_packaging: "pricing",
    search_or_template_wedge: "seo",
    founder_distribution: "gtm",
    buy_then_optimize: "acquisition",
    failure_or_payer_risk: "failure",
    general_case_breakdown: "case_breakdown",
  };
  return map[patternId] ?? "case_breakdown";
}

const outPath = getArgValue("--out", defaultOutPath);
const candidatesPath = getArgValue("--candidates-out", defaultCandidatesPath);
const snsInsightsPath = getArgValue("--sns-insights", defaultInsightsPath);
const skipCandidates = hasFlag("--no-candidates");

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

let candidates = [];
if (!skipCandidates) {
  const snsReport = readJson(snsInsightsPath, null);
  candidates = buildSnsCandidates(insights, snsReport);
  writeJson(candidatesPath, {
    generatedAt: new Date().toISOString(),
    manualOnly: true,
    note: "このファイルはSNS投稿候補です。市川さんからSNS投稿案作成の明示指示があるまで投稿本文作成やFirestore投入は開始しません。Firestore投入には approved: true と手動スクリプト実行が必要です。",
    sourceInsightPath: outPath.replace(`${root}\\`, "").replace(`${root}/`, ""),
    snsInsightsPath: existsSync(snsInsightsPath) ? snsInsightsPath.replace(`${root}\\`, "").replace(`${root}/`, "") : null,
    candidates,
  });
}

console.log(`Article insights: posts=${report.totals.posts}, dbMatched=${report.totals.postsWithDbRows}/${report.totals.posts}`);
console.table(
  patternSummary.map((pattern) => ({
    pattern: pattern.label,
    count: pattern.count,
  }))
);
console.log(`Saved: ${outPath}`);
if (!skipCandidates) {
  console.log(`SNS candidates saved: ${candidatesPath}`);
}
