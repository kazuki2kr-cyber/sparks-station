
import { Metadata } from 'next';
import { Terminal, Lightbulb, Palette, Server, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Tools | Sparks Station',
    description: 'Sparks Stationが厳選した、個人開発を加速させる「神ツール」一覧。',
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
    buttonText?: string;
    trackingPixel?: string;
};

type ToolCategory = {
    title: string;
    icon: React.ReactNode;
    tools: ToolItem[];
};

const toolsData: ToolCategory[] = [
    {
        title: "Development Environment",
        icon: <Terminal className="w-6 h-6 text-amber-500" />,
        tools: [
            {
                name: "Cursor",
                description: "もはや「相棒」。VS Code派生のエディタに最強のAIが統合されています。コードベース全体を理解したチャット機能は、開発速度を劇的に向上させます。",
                tags: ["Editor", "AI", "Must Have"],
                link: "https://cursor.sh/",
                buttonText: "公式サイト",
            },
            {
                name: "Vercel",
                description: "フロントエンドのデプロイはこれ一択。GitHubにプッシュするだけで自動デプロイされる体験は、一度味わうと戻れません。Next.jsとの親和性も最高です。",
                tags: ["Hosting", "CI/CD", "Free Tier"],
                link: "https://vercel.com/",
                buttonText: "無料で始める",
            }
        ]
    },
    {
        title: "Productivity & Management",
        icon: <Lightbulb className="w-6 h-6 text-blue-500" />,
        tools: [
            {
                name: "Notion",
                description: "アイデア出し、タスク管理、仕様書作成、すべてがこれ一つで完結します。データベース機能を使えば、簡易的なCMSとして使うことも可能です。",
                tags: ["Note", "Project Management", "SaaS"],
                link: "https://www.notion.so/", // Replace with affiliate link
                isAffiliate: true,
                buttonText: "無料で試す",
            },
            {
                name: "Linear",
                description: "エンジニアのために作られた、美しく高速な課題管理ツール。キーボードショートカットだけで操作できるUIは、使うこと自体が快感になります。",
                tags: ["Issue Tracking", "Agile", "Beautiful"],
                link: "https://linear.app/",
            }
        ]
    },
    {
        title: "Design & Marketing",
        icon: <Palette className="w-6 h-6 text-pink-500" />,
        tools: [
            {
                name: "Canva",
                description: "記事のアイキャッチやSNS画像作成に。非デザイナーでも、「それっぽい」デザインが爆速で作れるテンプレートが山ほどあります。",
                tags: ["Design", "NoCode", "Marketing"],
                link: "https://www.canva.com/", // Replace with affiliate link
                isAffiliate: true,
                buttonText: "無料で使う",
            },
            {
                name: "Figma",
                description: "ブラウザで動くUIデザインツールのデファクトスタンダード。個人開発のUI設計は、コードを書く前にFigmaで固めると手戻りが減ります。",
                tags: ["UI/UX", "Design", "Collaboration"],
                link: "https://www.figma.com/",
            }
        ]
    },
    {
        title: "Infrastructure & Learning",
        icon: <Server className="w-6 h-6 text-green-500" />,
        tools: [
            {
                name: "Xserver / Xdomain",
                description: "WordPressブログを始めるなら安定・高速なXserverがおすすめ。キャンペーン期間中のドメイン無料特典なども魅力的です。",
                tags: ["Server", "WordPress", "Japan"],
                link: "https://px.a8.net/svt/ejp?a8mat=4AVHBZ+AUKDMA+CO4+15UCEA", // A8.net affiliate link
                isAffiliate: true,
                trackingPixel: "https://www10.a8.net/0.gif?a8mat=4AVHBZ+AUKDMA+CO4+15UCEA",
            },
            {
                name: "Udemy",
                description: "新しい技術スタックを学ぶなら。セール時なら1,500円〜2,000円程度で、数時間のハンズオン形式の動画講座が手に入ります。",
                tags: ["Learning", "Video", "Skill"],
                link: "https://www.udemy.com/", // Replace with A8 link
                isAffiliate: true,
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
                    Sparks Stationの運営で使用している、または自信を持っておすすめできる「開発効率を爆上げするツール」たち。
                    <br className="hidden md:block" />
                    これらは私たちの開発ライフを支える、頼れる相棒です。
                </p>
            </header>

            <div className="space-y-16">
                {toolsData.map((category, idx) => (
                    <section key={idx} className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-neutral-800 pb-2">
                            {category.icon}
                            <h2 className="text-xl md:text-2xl font-bold text-neutral-200">
                                {category.title}
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {category.tools.map((tool, toolIdx) => (
                                <div key={toolIdx} className="group bg-neutral-900 border border-neutral-800 rounded-xl p-6 transition-all hover:border-neutral-700 hover:shadow-lg flex flex-col">
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                                                {tool.name}
                                            </h3>
                                            <div className="flex gap-2">
                                                {tool.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] uppercase tracking-wider bg-neutral-800 text-neutral-400 px-2 py-1 rounded">
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
                                            className={`
                                                inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg w-full justify-center transition-colors
                                                ${tool.isAffiliate
                                                    ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                                                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                                                }
                                            `}
                                        >
                                            {tool.buttonText || "公式サイト"}
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                        {tool.isAffiliate && (
                                            <p className="text-[10px] text-neutral-600 text-center mt-2">
                                                ※上記リンクはアフィリエイトを含みます
                                            </p>
                                        )}
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
                ))}
            </div>
        </div>
    );
}
