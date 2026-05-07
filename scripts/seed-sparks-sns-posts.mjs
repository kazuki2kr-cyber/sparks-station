import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");

for (const line of envContent.split("\n")) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) {
    process.env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
  }
}

const { initializeApp, cert, getApps } = await import("firebase-admin/app");
const { getFirestore } = await import("firebase-admin/firestore");

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

function jstDate(isoLocal) {
  return new Date(`${isoLocal}+09:00`);
}

function readyNow() {
  return new Date(Date.now() - 5 * 60 * 1000);
}

const bannedImageTextPattern = /[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳→←↑↓⇒⇐⇑⇓➡⬅⬆⬇]/;

function assertSafeImageText(post) {
  const values = [
    ["instagram.hookText", post.instagram?.hookText],
    ...(post.instagram?.slides ?? []).map((slide, index) => [
      `instagram.slides[${index}].overlayText`,
      slide.overlayText,
    ]),
  ];

  for (const [path, value] of values) {
    if (typeof value === "string" && bannedImageTextPattern.test(value)) {
      throw new Error(`Unsupported image text character found at ${path}: ${value}`);
    }
  }
}

function reelPost({
  order,
  scheduledAt,
  contentTheme,
  caseName,
  articleUrl,
  sourceUrl,
  templateId,
  hookText,
  caption,
  slides,
  threadTemplateId,
  threadPosts,
}) {
  return {
    type: "reel",
    platforms: ["instagram", "threads"],
    contentTheme,
    caseName,
    articleUrl,
    sourceUrl,
    order,
    scheduledAt,
    instagram: {
      type: "reel",
      templateId,
      hookText,
      caption,
      slides,
      ctaType: "save",
      targetKpi: "saves",
    },
    threads: {
      templateId: threadTemplateId,
      posts: threadPosts,
      ctaType: "article_click",
      targetKpi: "link_clicks",
    },
    tracking: {
      utmCampaign: "sns_2026_w19",
      experimentId: `sparks_article_w19_${String(order).padStart(2, "0")}`,
    },
    result: {
      instagramPostId: null,
      threadsRootId: null,
      threadsPostIds: [],
      postedAt: null,
    },
    status: "pending",
    postedAt: null,
    createdAt: new Date(),
  };
}

const posts = [
  reelPost({
    order: 1,
    scheduledAt: readyNow(),
    contentTheme: "exit",
    caseName: "Base44",
    articleUrl: "https://sparks-station.com/posts/base44-vibe-coding-80m-exit",
    sourceUrl: "src/content/posts/base44-vibe-coding-80m-exit.md",
    templateId: "reel_exit_breakdown",
    hookText: "6ヶ月で\n116億円Exit",
    caption: `Base44は、広告費ゼロ、資金調達ゼロで約116億円Exit。

強かったのは、AIで作ったことより「市場の波」と「売り方」が噛み合ったこと。

1. Vibeコーディング市場の波
2. Build in Publicで初期ユーザー獲得
3. 実務で使える深さ
4. 好評機能を消してCV改善

作れる時代ほど、売れる構造が差になる。

#AI開発 #SaaS #個人開発 #Exit #MicroSaaS #SparksStation`,
    slides: [
      {
        role: "hook",
        imagePrompt: "A solo AI app builder founder watching a small product turn into a major acquisition, cinematic startup exit scene, vertical 9:16, no text, no letters",
        overlayText: "6ヶ月で\n116億円Exit",
      },
      {
        role: "market",
        imagePrompt: "A powerful wave of AI app builders and no-code tools rising across a global software market, premium tech editorial style, vertical 9:16, no text, no letters",
        overlayText: "市場の波に\n乗った",
      },
      {
        role: "gtm",
        imagePrompt: "A founder sharing product updates publicly as glowing social posts attract early users, build in public startup metaphor, vertical 9:16, no text, no letters",
        overlayText: "広告費ゼロで\n初期集客",
      },
      {
        role: "product",
        imagePrompt: "A generated business app with database, authentication, and deployment represented as clean connected systems, vertical 9:16, no text, no letters",
        overlayText: "実務で使える\n深さがあった",
      },
      {
        role: "lesson",
        imagePrompt: "A product manager removing a shiny feature to reveal a simpler activation path, elegant SaaS product strategy visual, vertical 9:16, no text, no letters",
        overlayText: "削って\nCVを上げた",
      },
    ],
    threadTemplateId: "thread_article_case",
    threadPosts: [
      "Base44の約116億円Exitで面白いのは、AIで作ったこと自体ではなく、売れる構造がかなり明確だったことです。",
      "外部資金調達ゼロ、広告費ゼロ。ローンチ3週間でARR約1.45億円、6ヶ月で登録40万人以上。初期集客は創業者Maor Shlomo氏のLinkedIn発信が中心でした。",
      "Base44が強かったのは、デモアプリではなく実務で使えるアプリを生成できた点です。DB、認証、権限、デプロイまで含めていた。",
      "さらに面白いのは、好評だった機能を削除してアクティベーション率を3倍に改善したこと。ユーザーの声より、最初の体験を単純にする判断を優先した。",
      "AIで作れる時代ほど、差がつくのは機能数ではなく、タイミング、GTM、最初の体験設計。記事ではこの構造を詳しく整理しています。",
    ],
  }),
  reelPost({
    order: 2,
    scheduledAt: jstDate("2026-05-07T21:00:00"),
    contentTheme: "validation",
    caseName: "Subscribr",
    articleUrl: "https://sparks-station.com/posts/subscribr-youtube-ai-saas-bootstrap",
    sourceUrl: "src/content/posts/subscribr-youtube-ai-saas-bootstrap.md",
    templateId: "reel_validation_first",
    hookText: "作る前に\n売り切った",
    caption: `Subscribrは、YouTubeクリエイター向けAI SaaS。

100日で$10k MRR、18ヶ月で$62k MRRに到達。

でも一番の学びは、製品完成前にLifetime Dealを50個売ったこと。

「現金が入ったら検証成立」

インタビューでも、登録者数でもなく、支払いで需要を確かめた。

作る前に売る。ここが強い。

#AI開発 #SaaS #GTM #個人開発 #収益化 #SparksStation`,
    slides: [
      {
        role: "hook",
        imagePrompt: "A SaaS founder selling preorders before the product is fully built, glowing checkout confirmations and a simple prototype, vertical 9:16, no text, no letters",
        overlayText: "作る前に\n売り切った",
      },
      {
        role: "result",
        imagePrompt: "A creator economy SaaS dashboard growing steadily with revenue milestones, premium bootstrap startup mood, vertical 9:16, no text, no letters",
        overlayText: "100日で\n$10k MRR",
      },
      {
        role: "validation",
        imagePrompt: "Fifty glowing license cards being claimed by early customers from an email list, startup validation metaphor, vertical 9:16, no text, no letters",
        overlayText: "LTDを\n50個販売",
      },
      {
        role: "principle",
        imagePrompt: "Cash entering a bank account as the validation signal for a SaaS idea, clean business metaphor, vertical 9:16, no text, no letters",
        overlayText: "現金が入れば\n検証成立",
      },
      {
        role: "lesson",
        imagePrompt: "An indie founder choosing bootstrap freedom over venture capital pressure, calm strategic founder scene, vertical 9:16, no text, no letters",
        overlayText: "作る前に\n売る",
      },
    ],
    threadTemplateId: "thread_article_validation",
    threadPosts: [
      "Subscribrの記事で一番重要なのは、AI SaaSの機能ではなく、検証の定義です。",
      "創業者Gil Hildebrand氏は、製品完成前にメールリスト1,000人へLifetime Dealを案内し、50個を売り切って約$20kを先に回収しました。",
      "彼の原則は「銀行口座に現金が入った時だけ検証成立」。アンケートでも、いいねでも、事前登録でもなく、支払いで判断した。",
      "結果として、Subscribrは100日で$10k MRR、18ヶ月で$62k MRRまで伸びています。",
      "個人開発でも、AIで先に作り込む前に、1枚LPとStripeで先行販売を試す。この順番はかなり再現性があります。",
    ],
  }),
  reelPost({
    order: 3,
    scheduledAt: jstDate("2026-05-08T21:00:00"),
    contentTheme: "monetization",
    caseName: "SEO Utils and Ring Tonic",
    articleUrl: "https://sparks-station.com/posts/20260226",
    sourceUrl: "src/content/posts/20260226.md",
    templateId: "reel_pricing_model",
    hookText: "脱サブスクで\n月237万円",
    caption: `SEO UtilsとRing Tonicは、1人運営で月商約237万円。

ポイントは、サブスク疲れを逆手に取ったこと。

1. 買い切りで固定費の痛みを解決
2. APIキー持ち込みで運営コストを抑制
3. コミュニティで信頼を先に作る

高機能より、課金される形を選ぶ。

#個人開発 #MicroSaaS #SaaS #価格設計 #GTM #SparksStation`,
    slides: [
      {
        role: "hook",
        imagePrompt: "A solo developer running two profitable SaaS tools from a calm desk, revenue dashboard glowing, vertical 9:16, no text, no letters",
        overlayText: "脱サブスクで\n月237万円",
      },
      {
        role: "pricing",
        imagePrompt: "A one-time purchase software box standing out among many subscription invoices, modern SaaS pricing metaphor, vertical 9:16, no text, no letters",
        overlayText: "買い切りで\n固定費を下げる",
      },
      {
        role: "cost",
        imagePrompt: "Users bringing their own API keys to a simple software tool, infrastructure cost flowing away from the founder, vertical 9:16, no text, no letters",
        overlayText: "APIキー持ち込みで\n原価を抑える",
      },
      {
        role: "distribution",
        imagePrompt: "A niche SEO community exchanging tools and trust before a product launch, warm community-led growth visual, vertical 9:16, no text, no letters",
        overlayText: "信頼を先に\n作っていた",
      },
      {
        role: "lesson",
        imagePrompt: "A small focused tool solving one expensive pain inside a crowded SaaS stack, premium editorial tech style, vertical 9:16, no text, no letters",
        overlayText: "課金される形を\n選ぶ",
      },
    ],
    threadTemplateId: "thread_article_pricing",
    threadPosts: [
      "SEO UtilsとRing Tonicの記事は、価格設計の勉強になります。1人運営で月商約237万円。",
      "面白いのは、サブスク全盛の逆を行ったこと。SEO Utilsは買い切り型で、ユーザーの固定費削減ニーズを射抜きました。",
      "Ring TonicではAPIキー持ち込み型を採用。ユーザーがTwilio APIキーを設定するため、運営側の従量課金リスクをかなり抑えられる。",
      "さらに、先にSEOコミュニティで無料ツールを配布し、メールリストと信頼を作っていた。売る前に流通網を作っていたわけです。",
      "個人開発では、高機能よりも課金される形が大事です。買い切り、BYOK、設定代行。このあたりは日本でもかなり転用できます。",
    ],
  }),
  reelPost({
    order: 4,
    scheduledAt: jstDate("2026-05-09T21:00:00"),
    contentTheme: "acquisition",
    caseName: "Noosa Labs",
    articleUrl: "https://sparks-station.com/posts/20260313",
    sourceUrl: "src/content/posts/20260313.md",
    templateId: "reel_buy_then_grow",
    hookText: "ゼロイチを捨て\n月1800万円",
    caption: `Noosa Labsは、ゼロから作らず、利益が出ている小さなSaaSを買って育てる戦略。

全体で約$120k MRR。

やったことは派手ではない。

1. 価格を上げる
2. 割引をやめる
3. オンボーディングを直す
4. プラットフォームリスクを避ける

新機能より、事業を運用する力。

#MicroSaaS #SaaS買収 #個人開発 #収益化 #SparksStation`,
    slides: [
      {
        role: "hook",
        imagePrompt: "A software holding company collecting small profitable SaaS products like valuable assets, strategic portfolio visual, vertical 9:16, no text, no letters",
        overlayText: "ゼロイチを捨て\n月1800万円",
      },
      {
        role: "portfolio",
        imagePrompt: "Several small SaaS dashboards connected into one profitable portfolio, elegant operator business visual, vertical 9:16, no text, no letters",
        overlayText: "利益がある\nSaaSを買う",
      },
      {
        role: "pricing",
        imagePrompt: "A pricing page being simplified and raised for better revenue, premium SaaS operations metaphor, vertical 9:16, no text, no letters",
        overlayText: "価格を上げる",
      },
      {
        role: "risk",
        imagePrompt: "A SaaS product avoiding a giant platform kill switch, risk management business metaphor, vertical 9:16, no text, no letters",
        overlayText: "キルスイッチを\n避ける",
      },
      {
        role: "lesson",
        imagePrompt: "An operator improving onboarding and revenue systems instead of adding new features, calm SaaS operations scene, vertical 9:16, no text, no letters",
        overlayText: "新機能より\n運用力",
      },
    ],
    threadTemplateId: "thread_article_acquisition",
    threadPosts: [
      "Noosa Labsの記事は、個人開発者にとって少し発想を変える内容です。ゼロから作らず、利益が出ている小さなSaaSを買って育てる。",
      "全体で約$120k MRR。対象はARR$200kから$600k、利益率50%以上の小規模SaaS。",
      "成長施策は派手ではありません。価格の引き上げ、割引の撤廃、オンボーディング改善。新機能開発より、既存価値を売り切ることに集中しています。",
      "もう一つ重要なのは、プラットフォームリスクを避けること。WhatsApp依存プロダクトで停止通告を受けた経験から、一社に命綱を握られる事業を避けるようになった。",
      "日本でも、放置された小さなSaaSを引き継ぎ、価格と導線を直す戦略はあり得ます。作る力だけでなく、運用する力が価値になります。",
    ],
  }),
  reelPost({
    order: 5,
    scheduledAt: jstDate("2026-05-10T21:00:00"),
    contentTheme: "failure",
    caseName: "EveryONE Medicines",
    articleUrl: "https://sparks-station.com/posts/20260306",
    sourceUrl: "src/content/posts/20260306.md",
    templateId: "reel_failure_monetization",
    hookText: "技術が凄くても\n払う人がいない",
    caption: `EveryONE Medicinesは、1人の患者に1つの薬を届ける個別化医療に挑んだ。

でも、事業は停止。

壁は技術だけではなかった。

1. 患者ごとの手作業が重い
2. 保険償還モデルがない
3. 規制の進み方が遅い

技術がすごくても、誰が払うかが曖昧だと続かない。

#DeepTech #マネタイズ #スタートアップ #失敗事例 #SparksStation`,
    slides: [
      {
        role: "hook",
        imagePrompt: "A brilliant biotech platform facing a dark payment gap, personalized medicine startup failure metaphor, vertical 9:16, no text, no letters",
        overlayText: "技術が凄くても\n払う人がいない",
      },
      {
        role: "custom",
        imagePrompt: "A unique medicine being crafted individually for one patient, high-tech lab with handcrafted complexity, vertical 9:16, no text, no letters",
        overlayText: "1人に1つの\n薬を作る",
      },
      {
        role: "cost",
        imagePrompt: "A cost meter rising beside a personalized healthcare workflow, biotech monetization challenge visual, vertical 9:16, no text, no letters",
        overlayText: "限界費用が\n下がらない",
      },
      {
        role: "payer",
        imagePrompt: "An empty payer seat between a patient and an expensive treatment pipeline, healthcare business model metaphor, vertical 9:16, no text, no letters",
        overlayText: "支払い手が\n決まらない",
      },
      {
        role: "lesson",
        imagePrompt: "A startup runway clock moving faster than a slow regulatory clock, deeptech timing mismatch visual, vertical 9:16, no text, no letters",
        overlayText: "規制より先に\n資金が尽きる",
      },
    ],
    threadTemplateId: "thread_article_failure",
    threadPosts: [
      "EveryONE Medicinesは、技術的には本当にすごい挑戦でした。1人の患者に1つの薬を届ける個別化医療です。",
      "でも2026年3月に事業停止。理由は、技術の失敗というより、マネタイズと規制の構造が重すぎたこと。",
      "患者ごとに異なる薬を設計し、製造し、リスク管理する。これはSaaSのように限界費用が下がる構造ではなく、超高度な受託開発に近い。",
      "さらに、世界に一人のための薬に対して、保険会社や国がどう支払うのかという枠組みがなかった。",
      "技術がすごいほど見落としやすいですが、誰が、なぜ、いくら払うのか。この問いが空白だと、事業は続きません。",
    ],
  }),
  reelPost({
    order: 6,
    scheduledAt: jstDate("2026-05-11T21:00:00"),
    contentTheme: "regulation",
    caseName: "Kintsugi",
    articleUrl: "https://sparks-station.com/posts/20260227",
    sourceUrl: "src/content/posts/20260227.md",
    templateId: "reel_regulation_clock",
    hookText: "規制の時計は\n遅すぎる",
    caption: `Kintsugiは、声からうつ病を検知するAI医療スタートアップ。

約42億円を調達しながら、活動停止へ。

学びは「規制の時計」と「ベンチャーの時計」のズレ。

1. FDA待ちが長すぎた
2. 医療機器に固執した
3. 収益ラインを先に作れなかった

AI医療は、規制外の小さな課金から始めるべき。

#AI医療 #DeepTech #失敗事例 #GTM #SparksStation`,
    slides: [
      {
        role: "hook",
        imagePrompt: "Two clocks side by side, one fast startup clock and one slow regulation clock, AI healthcare startup tension, vertical 9:16, no text, no letters",
        overlayText: "規制の時計は\n遅すぎる",
      },
      {
        role: "funding",
        imagePrompt: "A funded AI healthcare startup burning runway while waiting for approval, dramatic but clean startup visual, vertical 9:16, no text, no letters",
        overlayText: "約42億円でも\n足りなかった",
      },
      {
        role: "waiting",
        imagePrompt: "A startup team waiting outside a regulatory gate with an AI product ready, healthcare approval metaphor, vertical 9:16, no text, no letters",
        overlayText: "FDA待ちが\n長すぎた",
      },
      {
        role: "pivot",
        imagePrompt: "A healthcare AI product splitting into wellness and clinical paths, safer monetization route highlighted, vertical 9:16, no text, no letters",
        overlayText: "先に日銭を\n作るべき",
      },
      {
        role: "lesson",
        imagePrompt: "A small compliant wellness product generating early revenue before entering regulated healthcare, pragmatic AI startup visual, vertical 9:16, no text, no letters",
        overlayText: "規制外から\n課金する",
      },
    ],
    threadTemplateId: "thread_article_regulation",
    threadPosts: [
      "Kintsugiの失敗は、AI医療に限らず、規制産業に入るスタートアップ全般に刺さります。",
      "声からうつ病を検知するAI。総資金調達額は約42億円。技術的な実績もありました。それでも活動停止に追い込まれた。",
      "最大の問題は、ベンチャーの時計と規制の時計が合わなかったこと。FDA承認を待つ数年の間に、ランウェイが削られていきました。",
      "初手から医療機器を目指すのではなく、企業ウェルネスや自己理解ツールなど、規制外で早期に収益化する道もあったはずです。",
      "AIで規制産業に入るなら、技術ロードマップと同じくらい、最初の課金ラインをどこに置くかが重要です。",
    ],
  }),
  reelPost({
    order: 7,
    scheduledAt: jstDate("2026-05-12T21:00:00"),
    contentTheme: "weekly_summary",
    caseName: "Sparks Station article week summary",
    articleUrl: "https://sparks-station.com",
    sourceUrl: "src/content/posts",
    templateId: "reel_article_week_summary",
    hookText: "今週の結論\n売る理由を先に",
    caption: `今週見た事例の共通点。

AIで作れるかより、売れる理由が先。

Base44は市場の波とGTM。
Subscribrは作る前の先行販売。
SEO Utilsは価格モデル。
Noosa Labsは買って育てる運用力。
EveryONEとKintsugiは支払い手と規制の壁。

作る前に、誰が払うかを見る。

#SparksStation #個人開発 #AI開発 #MicroSaaS #収益化`,
    slides: [
      {
        role: "hook",
        imagePrompt: "A weekly archive of SaaS case studies forming a clear monetization map, editorial tech media mood, vertical 9:16, no text, no letters",
        overlayText: "今週の結論\n売る理由を先に",
      },
      {
        role: "base44",
        imagePrompt: "A fast-growing AI app builder riding a market wave toward an acquisition, premium startup case study visual, vertical 9:16, no text, no letters",
        overlayText: "Base44\n市場とGTM",
      },
      {
        role: "subscribr",
        imagePrompt: "A creator SaaS preorder campaign proving demand before development, bootstrap validation visual, vertical 9:16, no text, no letters",
        overlayText: "Subscribr\n作る前に売る",
      },
      {
        role: "pricing",
        imagePrompt: "A one-time purchase software model and bring-your-own-key setup reducing SaaS costs, practical monetization visual, vertical 9:16, no text, no letters",
        overlayText: "SEO Utils\n価格モデル",
      },
      {
        role: "failure",
        imagePrompt: "A regulated AI startup facing payer and approval barriers, thoughtful failure case study visual, vertical 9:16, no text, no letters",
        overlayText: "失敗事例\n支払い手を見る",
      },
    ],
    threadTemplateId: "thread_article_week_summary",
    threadPosts: [
      "今週のSparks Station投稿は、すべて既存記事の事例ベースで組みました。",
      "Base44は、市場の波とBuild in Publicが噛み合ったExit事例。Subscribrは、作る前にLifetime Dealを売って検証した事例。",
      "SEO UtilsとRing Tonicは、買い切りとAPIキー持ち込みで収益化した個人開発事例。Noosa Labsは、作らずに買って育てるMicro-SaaS運用事例。",
      "EveryONE MedicinesとKintsugiは、技術が強くても支払い手や規制の時計を外すと事業が続かない失敗事例。",
      "共通する問いは、誰が払うか、なぜ今払うか、どこで最初に届くか。AIで作れる時代ほど、この問いを先に見たいです。",
    ],
  }),
];

for (const post of posts) {
  assertSafeImageText(post);
}

for (const post of posts) {
  await db.collection("postsQueue").doc().set(post);
  console.log(
    `#${post.order} [${post.caseName}] scheduled=${post.scheduledAt.toISOString()} ${post.instagram.hookText.replace(/\n/g, " ")} seeded`
  );
}

console.log(`Done: ${posts.length} article-based Sparks Station SNS posts seeded.`);
process.exit(0);
