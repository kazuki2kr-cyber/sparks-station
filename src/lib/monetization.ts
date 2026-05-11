export type RecommendedTool = {
    id: string;
    name: string;
    category: string;
    description: string;
    href: string;
    affiliateEnv?: string;
    keywords: string[];
};

export type ArticleProductCta = {
    id: "saas-case-db" | "sparks-pro" | "products";
    eyebrow: string;
    title: string;
    description: string;
    href: string;
    primaryLabel: string;
    secondaryHref?: string;
    secondaryLabel?: string;
};

export const recommendedTools: RecommendedTool[] = [
    {
        id: "beehiiv",
        name: "beehiiv",
        category: "Newsletter",
        description: "メディアや個人開発の読者を、ニュースレターと有料導線へつなぐ。",
        href: "https://www.beehiiv.com/",
        affiliateEnv: "AFFILIATE_BEEHIIV_URL",
        keywords: ["newsletter", "media", "creator", "sns", "audience", "community", "monetize"],
    },
    {
        id: "webflow",
        name: "Webflow",
        category: "Landing Page",
        description: "SaaSの検証用LP、比較ページ、事例ページを早く公開する。",
        href: "https://webflow.com/",
        affiliateEnv: "AFFILIATE_WEBFLOW_URL",
        keywords: ["landing", "lp", "website", "marketing", "gtm", "webflow"],
    },
    {
        id: "framer",
        name: "Framer",
        category: "Landing Page",
        description: "AI時代の軽いLP、テンプレ販売、プロダクト紹介ページに向く。",
        href: "https://www.framer.com/",
        affiliateEnv: "AFFILIATE_FRAMER_URL",
        keywords: ["framer", "landing", "lp", "template", "website", "design"],
    },
    {
        id: "make",
        name: "Make",
        category: "Automation",
        description: "問い合わせ、CRM、SNS、AI処理をつなぐ業務自動化の土台にする。",
        href: "https://www.make.com/",
        affiliateEnv: "AFFILIATE_MAKE_URL",
        keywords: ["automation", "workflow", "operations", "crm", "api", "make", "no-code"],
    },
    {
        id: "lovable",
        name: "Lovable",
        category: "AI App Builder",
        description: "MVPや管理画面を短期間で形にし、仮説検証の速度を上げる。",
        href: "https://lovable.dev/",
        affiliateEnv: "AFFILIATE_LOVABLE_URL",
        keywords: ["lovable", "vibe", "mvp", "app", "prototype", "ai", "builder"],
    },
    {
        id: "cursor",
        name: "Cursor",
        category: "AI Coding",
        description: "既存コードを読みながら、個人開発やSaaS改善の実装速度を上げる。",
        href: "https://cursor.com/",
        affiliateEnv: "AFFILIATE_CURSOR_URL",
        keywords: ["cursor", "coding", "developer", "engineering", "ai", "code"],
    },
];

export function getToolUrl(tool: RecommendedTool) {
    const affiliateUrl = tool.affiliateEnv ? process.env[tool.affiliateEnv] : undefined;
    return affiliateUrl || tool.href;
}

export function selectRecommendedTools(tags: string[], content: string, limit = 3) {
    const haystack = `${tags.join(" ")} ${content}`.toLowerCase();

    return recommendedTools
        .map((tool) => ({
            tool,
            score: tool.keywords.reduce((total, keyword) => (
                total + (haystack.includes(keyword.toLowerCase()) ? 1 : 0)
            ), 0),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ tool }) => tool);
}

export function selectArticleProductCta(tags: string[], content: string): ArticleProductCta {
    const haystack = `${tags.join(" ")} ${content}`.toLowerCase();

    const isFailureOrDeepTech =
        tags.includes("FailureCase") ||
        tags.includes("DeepTech") ||
        ["規制", "閉鎖", "失敗", "支払い手", "導入コスト", "保険償還", "cac"].some((word) =>
            haystack.includes(word.toLowerCase())
        );

    if (isFailureOrDeepTech) {
        return {
            id: "sparks-pro",
            eyebrow: "Before building",
            title: "作る前に、支払い手と導入の壁を確認する",
            description:
                "技術が強くても続かない事例は、検証項目に落とすと価値が出ます。Pro先行案内では、作る前の市場・価格・GTM設計を扱います。",
            href: "/products#pro",
            primaryLabel: "Pro先行案内を見る",
            secondaryHref: "/products",
            secondaryLabel: "Productsを見る",
        };
    }

    const isCaseDbFit =
        tags.includes("SuccessCase") ||
        tags.includes("GTM") ||
        tags.includes("Monetization") ||
        tags.includes("Bootstrapped") ||
        ["mrr", "arr", "ltd", "価格", "課金", "買い切り", "gtm", "seo", "初期顧客", "売却"].some((word) =>
            haystack.includes(word.toLowerCase())
        );

    if (isCaseDbFit) {
        return {
            id: "saas-case-db",
            eyebrow: "Case database",
            title: "似た事例を横断して、売れる型を探す",
            description:
                "SaaS Case DBでは、海外SaaSの価格、GTM、初期顧客、日本での試し方を比較できます。次の仮説づくりに使うための実務用DBです。",
            href: "/products#saas-case-db",
            primaryLabel: "SaaS Case DBを見る",
            secondaryHref: "/products/saas-case-db/access",
            secondaryLabel: "購入済みの方はこちら",
        };
    }

    return {
        id: "products",
        eyebrow: "Next step",
        title: "記事の学びを、次の検証へつなげる",
        description:
            "Sparks Stationでは、記事、事例DB、Pro構想をつなげて、日本で試せる形に整理しています。",
        href: "/products",
        primaryLabel: "Productsを見る",
    };
}
