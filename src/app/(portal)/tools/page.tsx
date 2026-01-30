
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
    buttonText?: string;
};

type ToolCategory = {
    title: string;
    icon: React.ReactNode;
    tools: ToolItem[];
    color: string;
};

const toolsData: ToolCategory[] = [
    {
        title: "AI & Development",
        icon: <Terminal className="w-6 h-6 text-amber-500" />,
        color: "amber",
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
                link: "https://deepmind.google/technologies/gemini/",
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
        color: "blue",
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
                link: "https://px.a8.net/svt/ejp?a8mat=4AVHBZ+AUKDMA+CO4+15UCEA",
                isAffiliate: true,
                trackingPixel: "https://www10.a8.net/0.gif?a8mat=4AVHBZ+AUKDMA+CO4+15UCEA",
            }
        ]
    },
    {
        title: "Operations & Growth",
        icon: <LineChart className="w-6 h-6 text-green-500" />,
        color: "emerald",
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
    },
    {
        title: "Gadgets & Gear",
        icon: <Sparkles className="w-6 h-6 text-violet-500" />,
        color: "violet",
        tools: [
            {
                name: "iFLYTEK AINOTE Air 2",
                description: "高性能な電子ペーパータブレット。紙のような書き心地と、驚異的な精度の音声認識・文字起こし機能を搭載。会議の議事録やアイデア出しに最強のデバイスです。",
                tags: ["E-Paper", "Productivity", "Tablet"],
                link: "https://hb.afl.rakuten.co.jp/ichiba/508380a7.418b1327.508380a8.8e12792f/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fkadenshop%2Fs4103-can-5043-4%2F&link_type=text&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJ0ZXh0Iiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MCwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9",
                buttonText: "商品ページへ",
                isAffiliate: true,
            },
            {
                name: "Keychron K2 Max",
                description: "Macユーザーに最適なメカニカルキーボード。QMK/VIA対応でキー配置も自由自在。心地よい打鍵感とコンパクトな配列が、日々のコーディングを楽しくさせます。",
                tags: ["Keyboard", "Mechanical", "Mac"],
                link: "https://hb.afl.rakuten.co.jp/ichiba/508382ac.261481b2.508382ad.b288b4ca/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fkitcut%2F5369483317%2F&link_type=text&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJ0ZXh0Iiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MCwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9",
                buttonText: "商品ページへ",
                isAffiliate: true,
            },
            {
                name: "Keychron M6 Wireless Mouse",
                description: "人間工学に基づいた軽量ワイヤレスマウス。長時間の作業でも疲れにくく、無限スクロールホイールがドキュメント閲覧やコーディングに威力を発揮します。",
                tags: ["Mouse", "Ergonomic", "Wireless"],
                link: "https://hb.afl.rakuten.co.jp/ichiba/508382ac.261481b2.508382ad.b288b4ca/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fkitcut%2F54241058261%2F&link_type=text&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJ0ZXh0Iiwic2l6ZSI6IjI0MHgyNDAiLCJuYW0iOjEsIm5hbXAiOiJyaWdodCIsImNvbSI6MSwiY29tcCI6ImRvd24iLCJwcmljZSI6MCwiYm9yIjoxLCJjb2wiOjEsImJidG4iOjEsInByb2QiOjAsImFtcCI6ZmFsc2V9",
                buttonText: "商品ページへ",
                isAffiliate: true,
            }
        ]
    }
];

// Define color styles statically to ensure Tailwind JIT detects them
const colorStyles: Record<string, {
    container: string;
    title: string;
    tag: string;
}> = {
    amber: {
        container: "hover:border-amber-500/50 hover:shadow-amber-500/10",
        title: "group-hover:text-amber-400",
        tag: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    blue: {
        container: "hover:border-blue-500/50 hover:shadow-blue-500/10",
        title: "group-hover:text-blue-400",
        tag: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    emerald: {
        container: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
        title: "group-hover:text-emerald-400",
        tag: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    violet: {
        container: "hover:border-violet-500/50 hover:shadow-violet-500/10",
        title: "group-hover:text-violet-400",
        tag: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    },
};

export default function ToolsPage() {
    return (
        <div className="space-y-12">
            <header className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white">Curated Tools & Gear</h1>
                <p className="text-neutral-400 max-w-2xl">
                    Sparks Stationの運営で使用している「開発効率を上げるツール」や「愛用ガジェット」。
                    <br className="hidden md:block" />
                    これらは私たちの開発ライフを支える、頼れる相棒です。
                </p>
            </header>

            <div className="space-y-16">
                {toolsData.map((category, idx) => {
                    const styles = colorStyles[category.color] || colorStyles.amber;

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
                                        group bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col transition-all duration-300 hover:shadow-lg
                                        ${styles.container}
                                    `}
                                    >
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className={`text-lg font-bold text-white transition-colors ${styles.title}`}>
                                                    {tool.name}
                                                </h3>
                                                <div className="flex gap-2 flex-wrap">
                                                    {tool.tags.map(tag => (
                                                        <span
                                                            key={tag}
                                                            className={`
                                                            text-[10px] uppercase tracking-wider px-2 py-1 rounded border
                                                            ${styles.tag}
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
                                                {tool.buttonText || "公式サイト"}
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
