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
}) {
  return {
    type: "reel",
    platforms: ["instagram"],
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
    tracking: {
      utmCampaign: "sns_2026_w20",
      experimentId: `sparks_article_w20_${String(order).padStart(2, "0")}`,
    },
    result: {
      instagramPostId: null,
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

const postsToSeed = [
  reelPost({
    order: 8,
    scheduledAt: jstDate("2026-05-12T09:00:00"),
    contentTheme: "pricing",
    caseName: "Youform",
    articleUrl: "https://sparks-station.com/posts/youform-affordable-typeform-alternative",
    sourceUrl: "src/content/posts/youform-affordable-typeform-alternative.md",
    templateId: "reel_pricing_breakdown",
    hookText: "Typeform不満を拾い\n月280万円へ",
    caption: `Youformが拾ったのは、フォーム市場の大きな不満でした。

Typeformは強い。でも高い。

そこでYouformは、安さだけでなく「制限の少なさ」を売りにした。

1. 既存大手の価格不満を探す
2. 機能を全部真似しない
3. 支払い理由を1つに絞る
4. 乗り換えの摩擦を下げる

成熟市場でも、価格の痛みは入口になる。

#SaaS #MicroSaaS #価格設計 #個人開発 #GTM #SparksStation`,
    slides: [
      { role: "hook", imagePrompt: "A small affordable form builder standing beside an expensive enterprise form platform, clean SaaS pricing contrast, vertical 9:16, no text, no letters", overlayText: "Typeform不満を拾い\n月280万円へ" },
      { role: "pain", imagePrompt: "A startup team frustrated by rising subscription invoices for form software, modern workspace, vertical 9:16, no text, no letters", overlayText: "高すぎる\nという痛み" },
      { role: "focus", imagePrompt: "A simple form builder interface focused on essential fields and checkout, minimal product strategy visual, vertical 9:16, no text, no letters", overlayText: "全部は\n真似しない" },
      { role: "lesson", imagePrompt: "A clear path from user frustration to a paid SaaS product, business strategy map, vertical 9:16, no text, no letters", overlayText: "価格不満は\n入口になる" },
    ],
    threadTemplateId: "thread_pricing_case",
    threadPosts: [
      "Youformの事例で見るべきなのは、フォーム市場に今から入ったことではなく、Typeformへの価格不満を入口にしたことです。",
      "成熟市場でも、大手が高機能化して価格を上げると、軽く使いたい層が置き去りになります。そこに小さなSaaSの余地ができます。",
      "大事なのは、安さだけで勝とうとしないこと。Youformはフォーム作成の基本体験を絞り、制限の少なさを支払い理由にしました。",
      "日本で転用するなら、まず既存大手のレビューから「高い」「重い」「ここまで要らない」を拾う。そこから小さな代替案を作るのが現実的です。",
      "価格不満は、弱者の入口になります。詳しい分解は記事で整理しています。",
    ],
  }),
  reelPost({
    order: 9,
    scheduledAt: jstDate("2026-05-12T21:00:00"),
    contentTheme: "acquisition",
    caseName: "Cuppa",
    articleUrl: "https://sparks-station.com/posts/cuppa-ai-seo-saas-acquisition",
    sourceUrl: "src/content/posts/cuppa-ai-seo-saas-acquisition.md",
    templateId: "reel_buy_then_grow",
    hookText: "買収直後のAI SaaSを\n月900万円規模へ",
    caption: `Cuppaは、買収したAI SEO SaaSを月5.9万ドル規模まで伸ばした事例。

強かったのは、技術より販売の組み合わせです。

1. LTDで初期資金を作る
2. SEO知見で実用価値を上げる
3. インフルエンサー流通を使う
4. 買ってから伸ばす

作る力だけでなく、伸ばす力が価値になる。

#AI開発 #SaaS買収 #MicroSaaS #GTM #収益化 #SparksStation`,
    slides: [
      { role: "hook", imagePrompt: "A founder acquiring a small AI SEO SaaS and growing it into a larger revenue machine, premium startup acquisition visual, vertical 9:16, no text, no letters", overlayText: "買収直後のAI SaaSを\n月900万円規模へ" },
      { role: "ltd", imagePrompt: "Lifetime deal launch creating early cash for a SaaS acquisition, glowing checkout cards, vertical 9:16, no text, no letters", overlayText: "LTDで\n初期資金" },
      { role: "distribution", imagePrompt: "Influencers and SEO operators distributing an AI writing tool through trusted networks, vertical 9:16, no text, no letters", overlayText: "流通網を\n先に使う" },
      { role: "lesson", imagePrompt: "A software operator improving growth levers after buying a small SaaS, dashboard and strategy notes, vertical 9:16, no text, no letters", overlayText: "買ってから\n伸ばす" },
    ],
    threadTemplateId: "thread_article_acquisition",
    threadPosts: [
      "Cuppaの面白さは、AI SEO SaaSをゼロから作った話ではなく、買収後に伸ばした話であることです。",
      "買収直後のプロダクトに、LTD、SEO知見、インフルエンサー流通を組み合わせ、月5.9万ドル規模まで伸ばしています。",
      "ここで重要なのは、プロダクト単体の完成度だけではありません。誰が売るか、どこに流すか、どの価格で初期資金を作るかです。",
      "個人開発でも、作るだけが選択肢ではない。小さな既存プロダクトを買い、導線と価格と流通を直す戦い方があります。",
      "作る力より、伸ばす力。次のMicro-SaaSではここを見たいです。",
    ],
  }),
  reelPost({
    order: 10,
    scheduledAt: jstDate("2026-05-13T09:00:00"),
    contentTheme: "validation",
    caseName: "Subscribr",
    articleUrl: "https://sparks-station.com/posts/subscribr-youtube-ai-saas-bootstrap",
    sourceUrl: "src/content/posts/subscribr-youtube-ai-saas-bootstrap.md",
    templateId: "reel_validation_first",
    hookText: "作る前に\n300万円売る",
    caption: `Subscribrは、完成前にLifetime Dealを50個販売。

約300万円を先に回収してから作った。

検証で見るべきは、いいねでもアンケートでもない。

1. 誰が払うか
2. いくら払うか
3. 今払う理由があるか
4. 先に売れるか

現金が入ったら、検証は一気に強くなる。

#AI開発 #SaaS #個人開発 #MVP #GTM #SparksStation`,
    slides: [
      { role: "hook", imagePrompt: "An indie SaaS founder selling prepaid licenses before building the full product, checkout confirmations, vertical 9:16, no text, no letters", overlayText: "作る前に\n300万円売る" },
      { role: "customers", imagePrompt: "A focused email list of creators becoming early paying customers, creator economy SaaS mood, vertical 9:16, no text, no letters", overlayText: "メールリストに\n先行販売" },
      { role: "cash", imagePrompt: "Cash validation entering a bank account before product development, startup validation metaphor, vertical 9:16, no text, no letters", overlayText: "現金が入れば\n検証成立" },
      { role: "lesson", imagePrompt: "A simple landing page and payment button validating a SaaS idea before coding, vertical 9:16, no text, no letters", overlayText: "MVPより先に\n支払いを見る" },
    ],
    threadTemplateId: "thread_validation_checklist",
    threadPosts: [
      "作る前に検証したいなら、見るべき指標は事前登録数ではなく支払いです。",
      "Subscribrは製品完成前にLifetime Dealを50個売り、約2万ドルを回収しました。ここで需要の解像度が一気に上がった。",
      "検証で確認するのは、誰が払うか、いくら払うか、なぜ今払うか。この3つです。",
      "日本で小さく試すなら、LP、支払いリンク、限定枠だけで十分です。作り込みより、先に財布が開くかを見る。",
      "AIで開発が速くなった今ほど、先に売る価値は上がっています。",
    ],
  }),
  reelPost({
    order: 11,
    scheduledAt: jstDate("2026-05-13T21:00:00"),
    contentTheme: "pricing",
    caseName: "SEO Utils and Ring Tonic",
    articleUrl: "https://sparks-station.com/posts/20260226",
    sourceUrl: "src/content/posts/20260226.md",
    templateId: "reel_pricing_model",
    hookText: "サブスク疲れに\n買い切りで勝つ",
    caption: `SEO UtilsとRing Tonicの学びは、価格モデルです。

毎月払いたくない層に、買い切りで刺した。

しかもAPIキー持ち込みで、運営側の原価リスクも下げた。

1. 固定費の痛みを探す
2. 買い切りで不安を減らす
3. BYOKで原価を逃がす
4. 信頼を先に作る

高機能より、払いやすい形。

#MicroSaaS #価格設計 #個人開発 #収益化 #SaaS #SparksStation`,
    slides: [
      { role: "hook", imagePrompt: "A one-time purchase software offer cutting through a stack of recurring subscription invoices, vertical 9:16, no text, no letters", overlayText: "サブスク疲れに\n買い切りで勝つ" },
      { role: "cost", imagePrompt: "A founder lowering operating cost with bring your own API key architecture, SaaS infrastructure metaphor, vertical 9:16, no text, no letters", overlayText: "BYOKで\n原価を下げる" },
      { role: "trust", imagePrompt: "A niche SEO community trusting a solo developer before buying tools, warm community growth scene, vertical 9:16, no text, no letters", overlayText: "信頼を先に\n作る" },
      { role: "lesson", imagePrompt: "A simple pricing page designed around how customers prefer to pay, clean SaaS pricing visual, vertical 9:16, no text, no letters", overlayText: "払いやすい形を\n選ぶ" },
    ],
    threadTemplateId: "thread_pricing_model",
    threadPosts: [
      "SEO UtilsとRing TonicがThreadsで伸びた理由は、価格設計の学びがそのまま使えるからだと思います。",
      "サブスク疲れがある市場では、買い切りが強い訴求になります。毎月の固定費を増やしたくないユーザーに刺さる。",
      "さらにBYOK、つまりAPIキー持ち込みにすると、運営側の従量課金リスクを下げられます。小さな事業にはかなり効く設計です。",
      "個人開発で見るべきは、高機能化より支払い方法。月額、買い切り、従量、設定代行。どれなら痛みが少なく払えるかです。",
      "価格は最後に決めるものではなく、プロダクトの設計そのものです。",
    ],
  }),
  reelPost({
    order: 12,
    scheduledAt: jstDate("2026-05-14T09:00:00"),
    contentTheme: "gtm",
    caseName: "Base44",
    articleUrl: "https://sparks-station.com/posts/base44-vibe-coding-80m-exit",
    sourceUrl: "src/content/posts/base44-vibe-coding-80m-exit.md",
    templateId: "reel_exit_breakdown",
    hookText: "広告費ゼロで\n初期集客",
    caption: `Base44は、広告費ゼロで初期ユーザーを集めた。

鍵はBuild in Public。

作っている過程を見せ、ユーザーの反応を取り込み、波が来た瞬間に広げた。

1. 市場の波を読む
2. 作る過程を見せる
3. 初期ユーザーと対話する
4. 体験を削ってCVを上げる

AI時代のGTMは、作る前から始まる。

#AI開発 #GTM #BuildInPublic #個人開発 #SaaS #SparksStation`,
    slides: [
      { role: "hook", imagePrompt: "A founder attracting early users through public product updates without advertising, startup social growth scene, vertical 9:16, no text, no letters", overlayText: "広告費ゼロで\n初期集客" },
      { role: "wave", imagePrompt: "A solo founder riding a wave of AI app builders in a growing market, cinematic tech visual, vertical 9:16, no text, no letters", overlayText: "市場の波に\n乗る" },
      { role: "public", imagePrompt: "Public build updates turning into an early user community for an AI app builder, vertical 9:16, no text, no letters", overlayText: "作る過程を\n見せる" },
      { role: "lesson", imagePrompt: "A product activation path becoming simpler after removing extra features, SaaS conversion strategy visual, vertical 9:16, no text, no letters", overlayText: "削って\nCVを上げる" },
    ],
    threadTemplateId: "thread_gtm_case",
    threadPosts: [
      "Base44のExitで見落としたくないのは、広告費ゼロで初期集客できた構造です。",
      "創業者はBuild in Publicで開発過程を見せ、AIアプリ生成への関心が高まる波の中でユーザーを集めました。",
      "ここで強いのは、完成品を突然出すのではなく、作っている途中から市場と会話していたことです。",
      "さらに、好評機能を消してアクティベーション率を上げた判断も重要。ユーザーの声を聞きつつ、最初の体験は単純にした。",
      "AI時代のGTMは、ローンチ日ではなく、作り始めた日から始まります。",
    ],
  }),
  reelPost({
    order: 13,
    scheduledAt: jstDate("2026-05-14T21:00:00"),
    contentTheme: "lp",
    caseName: "Usermaven",
    articleUrl: "https://sparks-station.com/posts/20260130",
    sourceUrl: "src/content/posts/20260130.md",
    templateId: "reel_ltd_strategy",
    hookText: "3週間で\n1600万円売る",
    caption: `Usermavenは、AppSumoに頼らず自社LTDで大きく売った。

学びは、販売ページと条件設計です。

1. 手数料を避ける
2. 自社で顧客リストを持つ
3. 限定性を作る
4. 購入後の導線を用意する

LTDは安売りではない。
初期資金と顧客資産を作る手段です。

#SaaS #GTM #LTD #個人開発 #収益化 #SparksStation`,
    slides: [
      { role: "hook", imagePrompt: "A SaaS founder running a successful self-hosted lifetime deal campaign, revenue milestones, vertical 9:16, no text, no letters", overlayText: "3週間で\n1600万円売る" },
      { role: "fee", imagePrompt: "A founder avoiding marketplace fees by selling directly from a clean SaaS checkout page, vertical 9:16, no text, no letters", overlayText: "手数料を\n避ける" },
      { role: "list", imagePrompt: "A customer list growing from a direct SaaS launch campaign, warm CRM and email growth visual, vertical 9:16, no text, no letters", overlayText: "顧客リストを\n自社で持つ" },
      { role: "lesson", imagePrompt: "A limited lifetime deal offer becoming startup capital and user feedback, vertical 9:16, no text, no letters", overlayText: "LTDは\n初期資金" },
    ],
    threadTemplateId: "thread_ltd_strategy",
    threadPosts: [
      "Usermavenの事例は、LTDを安売りではなく、初期資金と顧客資産を作る手段として見ると面白いです。",
      "AppSumoのようなマーケットプレイスに頼らず、自社でLTDを販売し、3週間で約1,600万円を売り上げました。",
      "自社販売の利点は、手数料だけではありません。顧客リスト、購入後の関係、アップセルの導線を自分たちで持てることです。",
      "ただしLTDは万能ではない。対象を絞り、限定性を作り、購入後に継続利用される導線を用意しないと、ただの安売りになります。",
      "個人開発で先に資金を作るなら、自社LTDは一度検討する価値があります。",
    ],
  }),
  reelPost({
    order: 14,
    scheduledAt: jstDate("2026-05-15T09:00:00"),
    contentTheme: "market_selection",
    caseName: "Outrank",
    articleUrl: "https://sparks-station.com/posts/20260124",
    sourceUrl: "src/content/posts/20260124.md",
    templateId: "reel_gtm_partner",
    hookText: "月6万円の壁を\n越えた理由",
    caption: `Outrankは、月商6万円の壁から年商2億円規模へ伸びた。

鍵は、プロダクトだけではなかった。

エンジニアとインフルエンサーが組み、流通を最初から持ったこと。

1. 作る人と届ける人を分ける
2. 市場の信頼を借りる
3. 顧客の言葉で売る
4. 初期導線を太くする

良い製品でも、届かなければ売れない。

#SaaS #GTM #個人開発 #マーケティング #SparksStation`,
    slides: [
      { role: "hook", imagePrompt: "An engineer and influencer founder team breaking through a small revenue ceiling, SaaS growth partnership visual, vertical 9:16, no text, no letters", overlayText: "月6万円の壁を\n越えた理由" },
      { role: "partner", imagePrompt: "A builder and a marketer combining product and audience strength, clean startup partnership scene, vertical 9:16, no text, no letters", overlayText: "作る人と\n届ける人" },
      { role: "trust", imagePrompt: "A trusted niche audience discovering a SaaS product through a familiar creator, vertical 9:16, no text, no letters", overlayText: "市場の信頼を\n借りる" },
      { role: "lesson", imagePrompt: "A product distribution funnel widening before launch, SaaS GTM strategy visual, vertical 9:16, no text, no letters", overlayText: "届く導線を\n先に作る" },
    ],
    threadTemplateId: "thread_gtm_partner",
    threadPosts: [
      "Outrankの事例は、個人開発者が苦手にしがちなGTMの話です。",
      "月商6万円の壁を越え、年商2億円規模まで伸びた背景には、エンジニアとインフルエンサーの組み合わせがありました。",
      "良いプロダクトを作る人と、顧客の言葉で届けられる人は、必ずしも同じではありません。",
      "最初から市場の信頼を持つ人と組めると、ローンチ時点の導線が太くなります。広告費より強いのは、すでにある信頼です。",
      "作る力がある人ほど、誰と組むか、どこで届けるかを先に考える価値があります。",
    ],
  }),
  reelPost({
    order: 15,
    scheduledAt: jstDate("2026-05-15T21:00:00"),
    contentTheme: "failure",
    caseName: "Botkeeper",
    articleUrl: "https://sparks-station.com/posts/20260221",
    sourceUrl: "src/content/posts/20260221.md",
    templateId: "reel_failure_monetization",
    hookText: "完璧なAIほど\n売れないことがある",
    caption: `Botkeeperは、AI簿記で理想に近づいた瞬間に閉鎖した。

技術が進んでも、事業が続くとは限らない。

1. 顧客獲得コストが重い
2. 導入が複雑すぎる
3. 期待値が高くなりすぎる
4. 収益構造が追いつかない

AIで作れることと、利益が残ることは別問題。

#AI #SaaS #失敗事例 #収益化 #スタートアップ #SparksStation`,
    slides: [
      { role: "hook", imagePrompt: "A polished AI bookkeeping system reaching technical perfection while the business runway fades, thoughtful SaaS failure visual, vertical 9:16, no text, no letters", overlayText: "完璧なAIほど\n売れないことがある" },
      { role: "cost", imagePrompt: "Customer acquisition cost weighing down an AI SaaS business model, vertical 9:16, no text, no letters", overlayText: "獲得コストが\n重い" },
      { role: "implementation", imagePrompt: "A complex onboarding workflow for accounting automation overwhelming a customer team, vertical 9:16, no text, no letters", overlayText: "導入が\n重すぎる" },
      { role: "lesson", imagePrompt: "A split path between technical capability and profitable business model, vertical 9:16, no text, no letters", overlayText: "できることと\n儲かることは別" },
    ],
    threadTemplateId: "thread_failure_case",
    threadPosts: [
      "Botkeeperの失敗は、AIプロダクトでかなり重要な教訓です。技術的に良くなっても、事業として続くとは限りません。",
      "AI簿記は価値が分かりやすい領域に見えますが、顧客獲得、導入、期待値調整、収益性のすべてが重い。",
      "特にB2Bで業務深度が高いほど、プロダクトを売るだけでは終わりません。オンボーディングや運用支援が必要になり、原価が残ります。",
      "AIで自動化できる範囲が広がっても、販売と導入のコストが消えるわけではない。",
      "AI SaaSを見る時は、技術のすごさより、利益が残る導入モデルになっているかを見たいです。",
    ],
  }),
  reelPost({
    order: 16,
    scheduledAt: jstDate("2026-05-16T09:00:00"),
    contentTheme: "operations",
    caseName: "Noosa Labs",
    articleUrl: "https://sparks-station.com/posts/20260313",
    sourceUrl: "src/content/posts/20260313.md",
    templateId: "reel_buy_then_grow",
    hookText: "新機能なしで\n売上を伸ばす",
    caption: `Noosa Labsの成長施策は、派手な新機能ではありません。

やったことは、運用改善です。

1. 価格を上げる
2. 割引をやめる
3. オンボーディングを直す
4. リスクの高い市場を避ける

小さなSaaSは、作るより直すだけで伸びることがある。

#MicroSaaS #SaaS買収 #価格設計 #運用改善 #SparksStation`,
    slides: [
      { role: "hook", imagePrompt: "A SaaS operator growing revenue by tuning pricing and onboarding instead of adding features, clean operations dashboard, vertical 9:16, no text, no letters", overlayText: "新機能なしで\n売上を伸ばす" },
      { role: "pricing", imagePrompt: "A pricing page being raised confidently for a profitable niche SaaS, vertical 9:16, no text, no letters", overlayText: "価格を\n上げる" },
      { role: "onboarding", imagePrompt: "A customer onboarding path becoming simpler and smoother, SaaS operations improvement, vertical 9:16, no text, no letters", overlayText: "導入を\n直す" },
      { role: "lesson", imagePrompt: "A portfolio of small SaaS products improving through operational discipline, vertical 9:16, no text, no letters", overlayText: "作るより\n直す" },
    ],
    threadTemplateId: "thread_operations_case",
    threadPosts: [
      "Noosa Labsの事例が良いのは、成長施策が派手ではないことです。",
      "価格を上げる、割引をやめる、オンボーディングを直す。新機能を作る前に、既存の価値を売り切っています。",
      "小さなSaaSでは、プロダクトが弱いのではなく、価格と導線が弱いだけのケースがあります。",
      "買収して育てる戦略が成立するのは、この運用改善で伸びる余地があるからです。",
      "自分のプロダクトでも、新機能の前に価格、初回体験、解約理由を見直す価値があります。",
    ],
  }),
  reelPost({
    order: 17,
    scheduledAt: jstDate("2026-05-16T21:00:00"),
    contentTheme: "ai_agency",
    caseName: "Hybrid AI agency",
    articleUrl: "https://sparks-station.com/posts/20260305",
    sourceUrl: "src/content/posts/20260305.md",
    templateId: "reel_ai_agency",
    hookText: "AIで80%自動化し\n月210万円へ",
    caption: `AIを使ったハイブリッド・エージェンシーは、SaaS前の収益化として強い。

最初から完全プロダクトにしない。

1. 手作業で売る
2. 繰り返しをAIで減らす
3. 粗利が残る型を探す
4. SaaS化できる部分だけ残す

業務代行は、SaaSの前段階になる。

#AI活用 #個人開発 #SaaS #業務自動化 #収益化 #SparksStation`,
    slides: [
      { role: "hook", imagePrompt: "A solo consultant using AI automation to run a lean service business from a laptop, vertical 9:16, no text, no letters", overlayText: "AIで80%自動化し\n月210万円へ" },
      { role: "service", imagePrompt: "A service workflow being performed manually first before automation, pragmatic startup operations visual, vertical 9:16, no text, no letters", overlayText: "まず手作業で\n売る" },
      { role: "automation", imagePrompt: "AI agents reducing repetitive client work in a hybrid agency workflow, vertical 9:16, no text, no letters", overlayText: "繰り返しを\nAIで減らす" },
      { role: "lesson", imagePrompt: "A path from consulting service to repeatable SaaS product, business model evolution visual, vertical 9:16, no text, no letters", overlayText: "業務代行から\nSaaSへ" },
    ],
    threadTemplateId: "thread_ai_agency",
    threadPosts: [
      "AI時代にいきなりSaaSを作るより、先に業務代行で売る方が早いことがあります。",
      "20260305の記事のハイブリッド・エージェンシー事例では、AIで作業の約80%を自動化しながら月商210万円に到達しています。",
      "この型の強さは、顧客の痛みを手作業で先に理解できることです。その後、繰り返し部分だけAI化する。",
      "SaaS化するのは最後でいい。売れる業務、繰り返される手順、粗利が残る範囲が見えてからプロダクトにする。",
      "AIで作れる時代ほど、作る前に業務として売る選択肢は強くなっています。",
    ],
  }),
  reelPost({
    order: 18,
    scheduledAt: jstDate("2026-05-17T09:00:00"),
    contentTheme: "failure",
    caseName: "Kintsugi",
    articleUrl: "https://sparks-station.com/posts/20260227",
    sourceUrl: "src/content/posts/20260227.md",
    templateId: "reel_regulation_clock",
    hookText: "42億円あっても\n規制待ちは重い",
    caption: `Kintsugiの教訓は、規制産業での時間軸です。

技術があっても、承認までの時間が長い。

1. ベンチャーの時計は速い
2. 規制の時計は遅い
3. 収益ラインが先に必要
4. 規制外の入口を探す

AI医療では、最初の課金場所を慎重に決めたい。

#AI医療 #DeepTech #GTM #失敗事例 #SparksStation`,
    slides: [
      { role: "hook", imagePrompt: "A funded AI healthcare startup waiting beside a slow regulatory clock, dramatic startup runway scene, vertical 9:16, no text, no letters", overlayText: "42億円あっても\n規制待ちは重い" },
      { role: "clock", imagePrompt: "Two clocks showing startup speed and regulatory speed moving out of sync, healthcare AI metaphor, vertical 9:16, no text, no letters", overlayText: "時計が\n合わない" },
      { role: "revenue", imagePrompt: "A small compliant wellness revenue stream beside a larger regulated medical path, vertical 9:16, no text, no letters", overlayText: "先に日銭を\n作る" },
      { role: "lesson", imagePrompt: "A founder choosing a safer non-regulated market entry before clinical approval, vertical 9:16, no text, no letters", overlayText: "規制外の入口を\n探す" },
    ],
    threadTemplateId: "thread_regulation_case",
    threadPosts: [
      "Kintsugiの失敗は、AI医療だけでなく、規制産業に入るプロダクト全般に効く教訓です。",
      "技術があり、資金もありました。それでも、FDA承認を待つ時間とベンチャーのランウェイが合わなかった。",
      "規制産業では、最初から本丸に入ると時間がかかります。承認前に収益を作れる周辺領域を持てるかがかなり重要です。",
      "企業ウェルネス、自己理解、業務支援など、規制外で価値提供できる入口を作れるか。",
      "技術ロードマップと同じくらい、最初の課金ラインをどこに置くかを設計したいです。",
    ],
  }),
  reelPost({
    order: 19,
    scheduledAt: jstDate("2026-05-17T21:00:00"),
    contentTheme: "market_import",
    caseName: "Flightcast",
    articleUrl: "https://sparks-station.com/posts/20260204",
    sourceUrl: "src/content/posts/20260204.md",
    templateId: "reel_gtm_partner",
    hookText: "インフルエンサーと組む\n反則級GTM",
    caption: `Flightcastの学びは、共同創業者選びです。

動画ポッドキャストSaaSで大事だったのは、機能だけではない。

市場に信頼を持つ人と組むことで、初期の流通を作った。

1. 顧客がいる場所を知る
2. 言葉を持つ人と組む
3. 作る前に届け先を持つ
4. 発信を販売導線にする

GTMは、機能の後付けではない。

#SaaS #GTM #共同創業 #個人開発 #SparksStation`,
    slides: [
      { role: "hook", imagePrompt: "A SaaS founder partnering with a trusted creator to launch a video podcast tool, vertical 9:16, no text, no letters", overlayText: "インフルエンサーと組む\n反則級GTM" },
      { role: "audience", imagePrompt: "A creator audience discovering a useful production tool through a trusted expert, vertical 9:16, no text, no letters", overlayText: "届け先を\n先に持つ" },
      { role: "language", imagePrompt: "Customer language from a niche media community shaping a SaaS landing page, vertical 9:16, no text, no letters", overlayText: "顧客の言葉で\n売る" },
      { role: "lesson", imagePrompt: "A product roadmap and distribution map designed together before launch, vertical 9:16, no text, no letters", overlayText: "GTMは\n後付けしない" },
    ],
    threadTemplateId: "thread_market_import",
    threadPosts: [
      "Flightcastの事例は、GTMを共同創業者選びから設計する話です。",
      "動画ポッドキャストSaaSで勝つには、機能だけでは足りません。顧客がいる場所、顧客の言葉、信頼の導線が必要です。",
      "インフルエンサーと組む価値は、拡散力だけではありません。市場の解像度と、売れる言葉を最初から持てることです。",
      "日本で転用するなら、作る前に業界の発信者、講師、コミュニティ運営者と話す。プロダクトより先に流通の仮説を作る。",
      "GTMはローンチ後の施策ではなく、共同創業の設計にも入ります。",
    ],
  }),
  reelPost({
    order: 20,
    scheduledAt: jstDate("2026-05-18T09:00:00"),
    contentTheme: "weekly_summary",
    caseName: "Sparks Station weekly checklist",
    articleUrl: "https://sparks-station.com",
    sourceUrl: "src/content/posts",
    templateId: "reel_article_week_summary",
    hookText: "作る前に見る\n4つの問い",
    caption: `今週の投稿で一番残したい問い。

作れるかより、売れる構造があるか。

1. 誰が払うか
2. なぜ今払うか
3. どこで最初に届くか
4. 続けても利益が残るか

AIで作るスピードが上がるほど、作る前の問いが大事になる。

#SparksStation #個人開発 #AI開発 #MicroSaaS #収益化`,
    slides: [
      { role: "hook", imagePrompt: "A clean checklist for indie SaaS validation before building, startup strategy desk, vertical 9:16, no text, no letters", overlayText: "作る前に見る\n4つの問い" },
      { role: "payer", imagePrompt: "A customer wallet and decision maker highlighted in a B2B SaaS buying journey, vertical 9:16, no text, no letters", overlayText: "誰が\n払うか" },
      { role: "distribution", imagePrompt: "A first customer acquisition channel lighting up before product launch, vertical 9:16, no text, no letters", overlayText: "どこで\n届くか" },
      { role: "profit", imagePrompt: "A small SaaS business model leaving profit after support and infrastructure costs, vertical 9:16, no text, no letters", overlayText: "利益が\n残るか" },
    ],
    threadTemplateId: "thread_weekly_checklist",
    threadPosts: [
      "保存版として、作る前に見たい4つの問いを置いておきます。",
      "1. 誰が払うか。ユーザーと支払い手が違う場合、売る難易度は上がります。",
      "2. なぜ今払うか。便利そう、では弱い。期限、損失、面倒、売上増のどれかに接続したい。",
      "3. どこで最初に届くか。Product Hunt、X、SEO、コミュニティ、既存顧客。初期導線がないと良い製品でも埋もれます。",
      "4. 続けても利益が残るか。AIコスト、サポート、導入工数まで見て、粗利が残る形にする。",
      "AIで作るスピードが上がるほど、作る前の問いで差がつきます。",
    ],
  }),
  reelPost({
    order: 21,
    scheduledAt: jstDate("2026-05-18T21:00:00"),
    contentTheme: "reader_prompt",
    caseName: "Sparks Station theme poll",
    articleUrl: "https://sparks-station.com",
    sourceUrl: "src/content/posts",
    templateId: "reel_reader_prompt",
    hookText: "次に深掘りするなら\nどれですか",
    caption: `次に深掘りするテーマを選ぶなら、どれが読みたいですか。

1. 価格設計
2. 初期集客
3. SaaS買収
4. 失敗事例

Sparks Stationでは、海外事例を日本の個人開発者が使える形に分解していきます。

コメントやThreadsで教えてください。

#SparksStation #個人開発 #SaaS #AI開発 #MicroSaaS`,
    slides: [
      { role: "hook", imagePrompt: "A media editor choosing the next SaaS case study theme from several strategy cards, editorial startup visual, vertical 9:16, no text, no letters", overlayText: "次に深掘りするなら\nどれですか" },
      { role: "pricing", imagePrompt: "A pricing strategy card beside SaaS dashboards and customer segments, vertical 9:16, no text, no letters", overlayText: "価格設計" },
      { role: "gtm", imagePrompt: "A customer acquisition channel map for an indie SaaS launch, vertical 9:16, no text, no letters", overlayText: "初期集客" },
      { role: "failure", imagePrompt: "A thoughtful failure case archive helping founders avoid mistakes, vertical 9:16, no text, no letters", overlayText: "失敗事例" },
    ],
    threadTemplateId: "thread_reader_prompt",
    threadPosts: [
      "次にSparks Stationで深掘りするなら、どのテーマが読みたいですか。",
      "1. 価格設計。月額、買い切り、LTD、従量課金、BYOKの使い分け。",
      "2. 初期集客。Build in Public、SEO、コミュニティ、インフルエンサーGTM。",
      "3. SaaS買収。小さなプロダクトを買って、価格と導線を直して伸ばす話。",
      "4. 失敗事例。技術は強いのに、支払い手や規制や導入で詰まったケース。",
      "返信で番号だけでも教えてください。次の記事と投稿設計に反映します。",
    ],
  }),
];

for (const post of postsToSeed) {
  assertSafeImageText(post);
}

for (const post of postsToSeed) {
  await db.collection("postsQueue").doc().set(post);
  console.log(
    `#${post.order} [${post.caseName}] scheduled=${post.scheduledAt.toISOString()} ${post.instagram.hookText.replace(/\n/g, " ")} seeded`
  );
}

console.log(`Done: ${postsToSeed.length} article-based Sparks Station SNS posts seeded.`);
process.exit(0);
