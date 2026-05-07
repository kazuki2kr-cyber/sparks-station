export type RecommendedTool = {
    id: string;
    name: string;
    category: string;
    description: string;
    href: string;
    affiliateEnv?: string;
    keywords: string[];
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
