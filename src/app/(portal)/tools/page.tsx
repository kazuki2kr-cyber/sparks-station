import { Metadata } from "next";
import {
  BadgeCheck,
  ExternalLink,
  GraduationCap,
  LineChart,
  Server,
  Sparkles,
  Terminal,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI活用・SaaS検証のツール",
  description:
    "Sparks StationがAI活用、個人開発、SaaS検証、記事制作、運用で使うツールとギアの一覧。",
  alternates: {
    canonical: "/tools",
  },
};

type ToolItem = {
  name: string;
  description: string;
  tags: string[];
  link: string;
  isAffiliate?: boolean;
  trackingPixel?: string;
  buttonText?: string;
};

type ToolCategory = {
  title: string;
  description: string;
  icon: React.ReactNode;
  tools: ToolItem[];
};

const toolsData: ToolCategory[] = [
  {
    title: "AI & Development",
    description: "AI時代の個人開発で、実装速度と調査密度を上げるための基本セット。",
    icon: <Terminal className="h-5 w-5" />,
    tools: [
      {
        name: "Cursor",
        description:
          "AIコードエディタの中心候補。既存コードを読みながら修正案を出せるため、個人開発の実装速度を大きく上げられます。",
        tags: ["Editor", "AI", "Dev"],
        link: "https://cursor.sh/",
      },
      {
        name: "VS Code",
        description:
          "標準的なコードエディタ。拡張機能が豊富で、Cursorと併用しても開発環境の基礎として使いやすいです。",
        tags: ["Editor", "Microsoft"],
        link: "https://code.visualstudio.com/",
      },
      {
        name: "NotebookLM",
        description:
          "資料、記事、PDFを読み込ませて調査ノート化するためのAIノート。Sparks Stationの記事リサーチにも相性が良いです。",
        tags: ["Research", "Google", "AI"],
        link: "https://notebooklm.google/",
      },
      {
        name: "GitHub",
        description:
          "コード管理、Issue、Pull Request、Actionsまで一通り揃う開発基盤。小さなSaaSでも早めに履歴を残す価値があります。",
        tags: ["Git", "CI/CD", "Platform"],
        link: "https://github.com/",
      },
    ],
  },
  {
    title: "Infrastructure & Backend",
    description: "認証、DB、ホスティング、公開までを小さなチームで回すための基盤。",
    icon: <Server className="h-5 w-5" />,
    tools: [
      {
        name: "Firebase",
        description:
          "認証、Firestore、App Hostingをまとめて扱えるBaaS。Sparks Stationでもログイン、購入権限、公開基盤に使っています。",
        tags: ["Backend", "Auth", "DB"],
        link: "https://firebase.google.com/",
      },
      {
        name: "Vercel",
        description:
          "Next.jsの公開先として強力な選択肢。プレビューURL、ログ、環境変数管理が軽く、フロント寄りのSaaS検証に向きます。",
        tags: ["Hosting", "Next.js"],
        link: "https://vercel.com/",
      },
      {
        name: "Xserver / Xdomain",
        description:
          "日本向けの安定したレンタルサーバーとドメイン管理。WordPressや日本語LPを別運用したい場合に使いやすい選択肢です。",
        tags: ["Server", "Domain", "Japan"],
        link: "https://px.a8.net/svt/ejp?a8mat=4AVHBZ+AUKDMA+CO4+15UCEA",
        isAffiliate: true,
        trackingPixel: "https://www10.a8.net/0.gif?a8mat=4AVHBZ+AUKDMA+CO4+15UCEA",
      },
    ],
  },
  {
    title: "Operations & Growth",
    description: "公開後に見られる、読まれる、収益化される状態へ近づける運用ツール。",
    icon: <LineChart className="h-5 w-5" />,
    tools: [
      {
        name: "Google Search Console",
        description:
          "検索流入、インデックス状況、検索クエリを確認するための必須ツール。記事メディアの改善には欠かせません。",
        tags: ["SEO", "Analytics"],
        link: "https://search.google.com/search-console/about",
      },
      {
        name: "A8.net",
        description:
          "国内最大級のASP。日本向けツールやスクール、サーバー商材を扱う場合、最初に確認したい提携候補です。",
        tags: ["ASP", "Monetization"],
        link: "https://px.a8.net/svt/ejp?a8mat=4AVHBZ+AG9Z3M+0K+11O3G2",
        isAffiliate: true,
        trackingPixel: "https://www18.a8.net/0.gif?a8mat=4AVHBZ+AG9Z3M+0K+11O3G2",
      },
    ],
  },
  {
    title: "Gadgets & Gear",
    description: "長時間の調査、執筆、実装を支える作業環境の候補。",
    icon: <Sparkles className="h-5 w-5" />,
    tools: [
      {
        name: "iFLYTEK AINOTE Air 2",
        description:
          "手書きメモと音声文字起こしをまとめられる電子ペーパー端末。会議メモや記事の下書きに向いています。",
        tags: ["E-Paper", "Notes"],
        link: "https://amzn.to/4tlKIaQ",
        buttonText: "Amazonで見る",
        isAffiliate: true,
      },
      {
        name: "Keychron K2 Max",
        description:
          "Macでも使いやすいメカニカルキーボード。打鍵感、接続方式、カスタマイズ性のバランスが良い定番候補です。",
        tags: ["Keyboard", "Mac"],
        link: "https://amzn.to/4atUoIO",
        buttonText: "Amazonで見る",
        isAffiliate: true,
      },
      {
        name: "Keychron M6 Wireless Mouse",
        description:
          "軽量で長時間作業に向くワイヤレスマウス。無限スクロール系の操作が資料閲覧やコードレビューで効きます。",
        tags: ["Mouse", "Wireless"],
        link: "https://amzn.to/4r0BO0O",
        buttonText: "Amazonで見る",
        isAffiliate: true,
      },
      {
        name: "PHILIPS 27E1N5600AE/11",
        description:
          "27インチWQHDの作業用モニター。USB-C給電対応で、ノートPC中心の開発環境をすっきり組めます。",
        tags: ["Monitor", "WQHD"],
        link: "https://amzn.to/4qhjzD5",
        buttonText: "Amazonで見る",
        isAffiliate: true,
      },
    ],
  },
  {
    title: "Skill Up & Career",
    description: "作る力、売る力、働き方の選択肢を増やすための学習候補。",
    icon: <GraduationCap className="h-5 w-5" />,
    tools: [
      {
        name: "デイトラ",
        description:
          "Webスキルを実務寄りに学ぶオンラインスクール。未経験からWeb制作や開発案件へ進む入口として検討しやすいです。",
        tags: ["School", "Web Skills"],
        link: "https://px.a8.net/svt/ejp?a8mat=4AVHC0+4VMW8I+5IZ2+5YRHE",
        isAffiliate: true,
        trackingPixel: "https://www19.a8.net/0.gif?a8mat=4AVHC0+4VMW8I+5IZ2+5YRHE",
      },
    ],
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-10">
      <header className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Tools
          </p>
          <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
            AIの変化と事例を、実際に試すための道具箱。
          </h1>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-neutral-400">
          Sparks Stationで扱うのは、単なる便利ツール集ではありません。AIの新機能や海外SaaS事例を自分の検証に落とすために、開発、公開、集客、収益化で使える候補を整理しています。
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        {toolsData.map((category) => (
          <a
            key={category.title}
            href={`#${category.title.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`}
            className="rounded-lg border border-white/10 bg-neutral-900 p-4 transition-colors hover:border-emerald-400/40"
          >
            <div className="flex items-center gap-3 text-emerald-300">
              {category.icon}
              <span className="text-sm font-semibold">{category.title}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-neutral-400">{category.description}</p>
          </a>
        ))}
      </div>

      <div className="space-y-12">
        {toolsData.map((category) => (
          <section
            id={category.title.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}
            key={category.title}
            className="space-y-5 scroll-mt-24"
          >
            <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-3 text-emerald-300">
                  {category.icon}
                  <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                    {category.title}
                  </p>
                </div>
                <h2 className="mt-3 text-2xl font-bold text-white">{category.description}</h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {category.tools.map((tool) => (
                <article
                  key={tool.name}
                  className="flex flex-col justify-between rounded-lg border border-white/10 bg-neutral-900 p-5 transition-colors hover:border-emerald-400/30"
                >
                  <div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className="text-lg font-bold text-white">{tool.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {tool.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-white/10 bg-neutral-950 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-neutral-400">{tool.description}</p>
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    <a
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-200 transition-colors hover:bg-neutral-700 hover:text-white"
                    >
                      {tool.buttonText ?? "公式サイトを見る"}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    {tool.isAffiliate && (
                      <p className="mt-2 flex items-center gap-1 text-xs text-neutral-500">
                        <BadgeCheck className="h-3 w-3 text-emerald-300" />
                        一部リンクは提携リンクです。
                      </p>
                    )}
                    {tool.trackingPixel && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={tool.trackingPixel} width="1" height="1" alt="" className="hidden" />
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="border-t border-white/10 pt-5 text-xs leading-6 text-neutral-600">
        掲載ツールはSparks Stationの編集方針に沿って選んでいます。価格、機能、提携条件は変更される場合があります。
      </p>
    </div>
  );
}
