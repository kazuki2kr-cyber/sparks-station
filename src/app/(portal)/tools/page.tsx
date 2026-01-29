
import { Metadata } from 'next';
import { Terminal, Sparkles, Server, LineChart, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Tools | Sparks Station',
    description: 'Sparks Stationが厳選した、個人開発を加速させる「開発ツール」一覧。',
    alternates: {
        canonical: '/tools',
    },
};

type ToolItem = {
    name: string;
    description: string;
    tags: string[];
    link: string; // Affiliate link
    isAffiliate?: boolean;
    trackingPixel?: string;
};

type ToolCategory = {
    title: string;
    icon: React.ReactNode;
    tools: ToolItem[];
    themeColor: string; // 'amber' | 'blue' | 'emerald' etc.
};

const toolsData: ToolCategory[] = [
    {
        title: "AI & Development",
        icon: <Terminal className="w-6 h-6 text-amber-500" />,
        themeColor: "text-amber-400 border-amber-500/50 bg-amber-500/10 hover:shadow-amber-500/10",
        tools: [
            {
                name: "Cursor",
                description: "もはや「相棒」。VS Code派生のエディタに最強のAIが統合されています。コードベース全体を理解したチャット機能は、開発速度を劇的に向上させます。",
                tags: ["Editor", "AI", "Must Have"],
                link: "https://cursor.sh/",
            },
            {
                name: "VS Code",
                description: "世界標準のコードエディタ。豊富な拡張機能エコシステムと軽量な動作。Cursorのベースにもなっていますが、純粋な開発環境として依然強力です。",
                tags: ["Editor", "Microsoft", "Standard"],
                link: "https://code.visualstudio.com/",
            },
            {
                name: "Antigravity",
                description: "Google DeepMindが開発中の次世代エージェントAI。高度な推論能力と自律的なコーディング能力を持ち、開発者の意図を汲み取って実装まで完遂します。",
                tags: ["AI Agent", "DeepMind", "Future"],
                link: "https://deepmind.google/technologies/gemini/", // Link to Gemini/DeepMind page as placeholder or specific if known
            },
            {
                name: "NotebookLM",
                description: "GoogleのRAG搭載AIノートブック。論文や仕様書をアップロードするだけで、その内容を熟知した専属AIアシスタントが爆誕します。リサーチの相棒に。",
                tags: ["AI", "Research", "Google"],
                link: "https://notebooklm.google/",
            },
            {
                name: "GitHub",
                description: "ソースコード管理のインフラ。Copilotとの連携、ActionsによるCI/CD、Issue管理など、個人開発においても中心的なプラットフォームです。",
                tags: ["git", "CI/CD", "Platform"],
                link: "https://github.com/",
            }
        ]
    },
    {
        title: "Infrastructure & Backend",
        icon: <Server className="w-6 h-6 text-blue-500" />,
        themeColor: "text-blue-400 border-blue-500/50 bg-blue-500/10 hover:shadow-blue-500/10",
        tools: [
            {
                name: "Vercel",
                description: "フロントエンドのデプロイはこれ一択。GitHubにプッシュするだけで自動デプロイされる体験と、Next.jsへの最適化は他に代えがたい価値があります。",
                tags: ["Hosting", "Serverless", "Next.js"],
                link: "https://vercel.com/",
            },
            {
                name: "Firebase",
                description: "Googleが提供するBaaS (Backend as a Service)。認証、データベース、ホスティングがこれ一つで完結。個人開発のバックエンド構築時間を大幅に短縮します。",
                tags: ["Backend", "Database", "Auth"],
                link: "https://firebase.google.com/",
            },
            {
                name: "Xserver / Xdomain",
                description: "安定・高速なプラットフォームとしてXserverは最有力の選択肢。WordPressブログも併せて管理でき、キャンペーンのドメイン特典も活用できるため、コストパフォーマンスに優れています。",
                tags: ["Server", "WordPress", "Japan"],
                link: "https://px.a8.net/svt/ejp?a8mat=4AVHBZ+AUKDMA+CO4+15UCEA", // A8.net affiliate link
                isAffiliate: true,
                trackingPixel: "https://www10.a8.net/0.gif?a8mat=4AVHBZ+AUKDMA+CO4+15UCEA",
            }
        ]
    },
    {
        title: "Operations & Growth",
        icon: <LineChart className="w-6 h-6 text-green-500" />,
        themeColor: "text-emerald-400 border-emerald-500/50 bg-emerald-500/10 hover:shadow-emerald-500/10",
        tools: [
            {
                name: "Google Search Console",
                description: "サイトの健康状態を可視化する必須ツール。SEO対策、検索キーワードの分析、インデックス登録状況の確認など、運営には欠かせません。",
                tags: ["SEO", "Analytics", "Google"],
                link: "https://search.google.com/search-console/about",
            },
            {
                name: "A8.net",
                description: "国内最大手のアフィリエイトASP。テック系サービスの広告も多く、審査も通りやすいため、まずはここから登録するのが「収益化」の第一歩です。",
                tags: ["Monetization", "ASP", "Must Have"],
                link: "https://px.a8.net/svt/ejp?a8mat=4AVHBZ+AG9Z3M+0K+11O3G2",
                isAffiliate: true,
                trackingPixel: "https://www18.a8.net/0.gif?a8mat=4AVHBZ+AG9Z3M+0K+11O3G2",
            }
        ]
    }
];

export default function ToolsPage() {
    return (
        <div className="space-y-12">
            <header className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white">Curated Tools</h1>
                <p className="text-neutral-400 max-w-2xl">
                    Sparks Stationの運営で使用している「開発効率を上げるツール」たち。
                    <br className="hidden md:block" />
                    これらは私たちの開発ライフを支える、頼れる相棒です。
                </p>
            </header>

            <div className="space-y-16">
                {toolsData.map((category, idx) => {
                    const colorTheme = ['amber', 'blue', 'emerald'][idx % 3];
                    return (
                        <section key={idx} className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-neutral-800 pb-2">
                                {category.icon}
                                <h2 className="text-xl md:text-2xl font-bold text-neutral-200">
                                    {category.title}
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {category.tools.map((tool, toolIdx) => (
                                    <div
                                        key={toolIdx}
                                        className={`
                                        group bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col transition-all duration-300
                                        hover:border-${colorTheme}-500/50 hover:shadow-lg hover:shadow-${colorTheme}-500/10
                                    `}
                                    >
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className={`text-lg font-bold text-white transition-colors group-hover:text-${colorTheme}-400`}>
                                                    {tool.name}
                                                </h3>
                                                <div className="flex gap-2">
                                                    {tool.tags.map(tag => (
                                                        <span
                                                            key={tag}
                                                            className={`
                                                            text-[10px] uppercase tracking-wider px-2 py-1 rounded border
                                                            bg-${colorTheme}-500/10 text-${colorTheme}-400 border-${colorTheme}-500/20
                                                        `}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                                                {tool.description}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-neutral-800">

                                            <a
                                                href={tool.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg w-full justify-center transition-colors bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                                            >
                                                公式サイト
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            {/* Tracking Pixel for A8.net etc */}
                                            {tool.trackingPixel && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={tool.trackingPixel}
                                                    width="1"
                                                    height="1"
                                                    alt=""
                                                    className="hidden"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>

            <div className="flex justify-end mt-12">
                <p className="text-xs text-neutral-600">
                    ※本ページはプロモーションが含まれています
                </p>
            </div>
        </div>
    );
}
