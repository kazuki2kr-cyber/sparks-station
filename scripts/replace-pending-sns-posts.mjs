import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envContent = readFileSync(join(__dirname, "../.env.local"), "utf-8");

for (const line of envContent.split(/\r?\n/)) {
  const index = line.indexOf("=");
  if (index > 0) {
    process.env[line.slice(0, index).trim()] = line
      .slice(index + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
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
      utmCampaign: "sns_2026_w19_strong_hooks",
      experimentId: `sparks_article_hook_${String(order).padStart(2, "0")}`,
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
    scheduledAt: jstDate("2026-05-08T21:00:00"),
    contentTheme: "exit",
    caseName: "Base44",
    articleUrl: "https://sparks-station.com/posts/base44-vibe-coding-80m-exit",
    sourceUrl: "src/content/posts/base44-vibe-coding-80m-exit.md",
    templateId: "reel_strong_case_hook",
    hookText: "誰でも使える\n116億円Exitの型",
    caption: `Base44は、広告費ゼロ、資金調達ゼロで約116億円Exit。

すごいのはAIで作ったことではなく、売れる順番を外さなかったことです。

1. Vibeコーディングの波に乗る
2. Build in Publicで初期ユーザーを集める
3. 実務で使える深さまで作る
4. 好評機能を削ってCVを上げる

作れる時代ほど、売れる導線が差になります。

#AI開発 #SaaS #個人開発 #Exit #MicroSaaS #SparksStation`,
    slides: [
      {
        role: "hook",
        imagePrompt: "A solo AI app founder turning a simple product into a major acquisition, cinematic startup office, vertical 9:16, no text, no letters",
        overlayText: "誰でも使える\n116億円Exitの型",
      },
      {
        role: "market",
        imagePrompt: "A massive wave of AI app builders moving through a global software market, premium technology editorial photo style, vertical 9:16, no text, no letters",
        overlayText: "波が来た市場を\n先に取った",
      },
      {
        role: "gtm",
        imagePrompt: "A founder sharing daily product progress on professional social media while early users gather, build in public growth scene, vertical 9:16, no text, no letters",
        overlayText: "広告費ゼロで\n1万人獲得",
      },
      {
        role: "lesson",
        imagePrompt: "A product manager removing a shiny feature to reveal a simpler onboarding path and higher conversion, SaaS strategy visual, vertical 9:16, no text, no letters",
        overlayText: "好評機能を削り\nCVを3倍へ",
      },
    ],
    threadTemplateId: "thread_open_loop_case",
    threadPosts: [
      "Base44が広告費ゼロ、資金調達ゼロで約116億円Exitできた理由。押さえるポイントは4つだけで、",
      "1つ目は、市場の波です。Vibeコーディングが一気に広がった時期に、Base44はそのど真ん中で出ました。",
      "2つ目は、Build in Public。創業者Maor Shlomo氏はLinkedInで開発状況、売上、ユーザーの声を出し続けました。",
      "3つ目は、実務で使える深さ。UIだけでなく、DB、認証、権限、デプロイまで含めて生成できた。",
      "4つ目は、削る判断です。好評だった機能を消してオンボーディングを単純化し、アクティベーション率を3倍に改善しています。",
      "AIで作れる時代ほど、勝敗は機能数ではなく、波、流通、最初の体験で決まります。",
    ],
  }),
  reelPost({
    order: 2,
    scheduledAt: jstDate("2026-05-09T21:00:00"),
    contentTheme: "validation",
    caseName: "Subscribr",
    articleUrl: "https://sparks-station.com/posts/subscribr-youtube-ai-saas-bootstrap",
    sourceUrl: "src/content/posts/subscribr-youtube-ai-saas-bootstrap.md",
    templateId: "reel_strong_validation_hook",
    hookText: "作る前に300万円\n売ったAI SaaS",
    caption: `Subscribrは、YouTubeクリエイター向けAI SaaS。

100日で$10k MRR、18ヶ月で$62k MRRへ。

でも一番マネできるのは、製品完成前にLifetime Dealを50個売り、約300万円を先に回収したこと。

需要確認を「いいね」ではなく「入金」で見た。

作る前に売る。ここは個人開発でも使えます。

#AI開発 #SaaS #GTM #個人開発 #収益化 #SparksStation`,
    slides: [
      {
        role: "hook",
        imagePrompt: "A SaaS founder selling preorders from a simple landing page before the product is fully built, checkout confirmations glowing, vertical 9:16, no text, no letters",
        overlayText: "作る前に300万円\n売ったAI SaaS",
      },
      {
        role: "result",
        imagePrompt: "A creator economy SaaS revenue dashboard growing from zero to ten thousand dollars monthly recurring revenue, vertical 9:16, no text, no letters",
        overlayText: "100日で\n$10k MRR",
      },
      {
        role: "validation",
        imagePrompt: "Fifty early customers claiming lifetime software licenses from an email list, bootstrap validation scene, vertical 9:16, no text, no letters",
        overlayText: "LTDを\n50個完売",
      },
      {
        role: "lesson",
        imagePrompt: "An indie founder choosing a small paid preorder before building a large product, practical bootstrap strategy visual, vertical 9:16, no text, no letters",
        overlayText: "先に売れば\n作りすぎない",
      },
    ],
    threadTemplateId: "thread_open_loop_validation",
    threadPosts: [
      "Subscribrが100日で$10k MRRまで伸びた話。日本の個人開発者が真似するなら、見るべきポイントはAI機能ではなく、",
      "製品完成前に売ったことです。創業者Gil Hildebrand氏は、メールリスト1,000人にLifetime Dealを案内しました。",
      "結果、50個を売り切り、約$20kを先に回収。日本円で約300万円です。",
      "彼の基準は明確で、銀行口座に現金が入った時だけ検証成立。アンケート、事前登録、いいねは検証ではない。",
      "この順番なら、AIで作り込む前に市場の反応を見られます。LP1枚、Stripe、限定30個の先行販売。日本でも十分できます。",
      "Subscribrの記事では、月$62k MRRまで伸びた背景と、Laravelを選んだ運用判断まで整理しています。",
    ],
  }),
  reelPost({
    order: 3,
    scheduledAt: jstDate("2026-05-10T21:00:00"),
    contentTheme: "monetization",
    caseName: "SEO Utils and Ring Tonic",
    articleUrl: "https://sparks-station.com/posts/20260226",
    sourceUrl: "src/content/posts/20260226.md",
    templateId: "reel_strong_pricing_hook",
    hookText: "1人で月237万円\n脱サブスクの勝ち方",
    caption: `SEO UtilsとRing Tonicは、1人運営で月商約237万円。

強かったのは、サブスク疲れを逆手に取ったこと。

1. 買い切りで固定費の痛みを解決
2. APIキー持ち込みで原価リスクを抑える
3. コミュニティで信頼を先に作る

高機能より、払いやすい形を選ぶ。

#個人開発 #MicroSaaS #SaaS #価格設計 #GTM #SparksStation`,
    slides: [
      {
        role: "hook",
        imagePrompt: "A solo developer calmly running two profitable software tools from one laptop, revenue dashboard, premium realistic startup photo, vertical 9:16, no text, no letters",
        overlayText: "1人で月237万円\n脱サブスクの勝ち方",
      },
      {
        role: "pricing",
        imagePrompt: "A one-time purchase software product standing apart from many subscription invoices, modern SaaS pricing metaphor, vertical 9:16, no text, no letters",
        overlayText: "買い切りで\n固定費を刺す",
      },
      {
        role: "cost",
        imagePrompt: "Users bringing their own API keys into a simple business software tool, infrastructure cost bypass metaphor, vertical 9:16, no text, no letters",
        overlayText: "BYOKで\n原価を逃がす",
      },
      {
        role: "lesson",
        imagePrompt: "A focused small software tool solving one expensive pain inside a crowded SaaS stack, premium editorial tech style, vertical 9:16, no text, no letters",
        overlayText: "売れるのは\n課金の形",
      },
    ],
    threadTemplateId: "thread_open_loop_pricing",
    threadPosts: [
      "1人開発で月237万円を作ったSEO UtilsとRing Tonic。面白いのは、機能の多さではなく課金の形で、",
      "SEO Utilsは買い切り型です。月額数万円のSEOツールに疲れたユーザーへ、一度買えば使える選択肢を出しました。",
      "Ring TonicはBYOK、つまりユーザーが自分のTwilio APIキーを入れる方式。運営側は従量課金リスクを抱えにくい。",
      "さらに、いきなり売ったのではなく、SEOコミュニティで無料ツールを配り、メールリストと信頼を先に作っています。",
      "個人開発で大事なのは、高機能にすることより、ユーザーが払いやすく、運営が死なない課金形態を選ぶことです。",
      "記事では、買い切り、BYOK、コミュニティ起点の集客を日本でどう転用するかまで整理しています。",
    ],
  }),
  reelPost({
    order: 4,
    scheduledAt: jstDate("2026-05-11T21:00:00"),
    contentTheme: "acquisition",
    caseName: "Noosa Labs",
    articleUrl: "https://sparks-station.com/posts/20260313",
    sourceUrl: "src/content/posts/20260313.md",
    templateId: "reel_strong_acquisition_hook",
    hookText: "作らずに買って\n月1800万円へ",
    caption: `Noosa Labsは、ゼロから作らず、利益が出ている小さなSaaSを買って育てる戦略。

全体で約$120k MRR。

やったことは派手ではありません。

1. 価格を上げる
2. 割引をやめる
3. オンボーディングを直す
4. プラットフォーム依存を避ける

新機能より、事業を運用する力。

#MicroSaaS #SaaS買収 #個人開発 #収益化 #SparksStation`,
    slides: [
      {
        role: "hook",
        imagePrompt: "A software operator buying and growing small profitable SaaS products as a portfolio, realistic strategic office scene, vertical 9:16, no text, no letters",
        overlayText: "作らずに買って\n月1800万円へ",
      },
      {
        role: "portfolio",
        imagePrompt: "Several small SaaS dashboards connected into one profitable portfolio, elegant operator business visual, vertical 9:16, no text, no letters",
        overlayText: "利益が出た\nSaaSを買う",
      },
      {
        role: "pricing",
        imagePrompt: "A SaaS pricing page being simplified and raised by an operator, premium product operations metaphor, vertical 9:16, no text, no letters",
        overlayText: "価格を上げ\n割引を消す",
      },
      {
        role: "lesson",
        imagePrompt: "An operator improving onboarding and revenue systems instead of adding new features, calm SaaS operations scene, vertical 9:16, no text, no letters",
        overlayText: "新機能より\n運用で伸ばす",
      },
    ],
    threadTemplateId: "thread_open_loop_acquisition",
    threadPosts: [
      "Noosa Labsが月$120k MRRまで伸ばした方法。ゼロから作るのを一度やめて、見たポイントは、",
      "すでに利益が出ている小さなSaaSです。ARR$200kから$600k、利益率50%以上のプロダクトを買って育てています。",
      "買収後にやることは派手ではありません。価格を上げる、割引をやめる、オンボーディングを直す。まず既存価値を売り切る。",
      "Sendtricでは、年間解約率を20から30%減らす改善もしています。新機能より、最初の体験と課金導線を直した。",
      "日本でも、放置された小さなSaaSを引き継ぎ、価格と導線を直す戦略はあり得ます。",
      "作る力だけでなく、運用する力が価値になります。記事で詳しく整理しています。",
    ],
  }),
  reelPost({
    order: 5,
    scheduledAt: jstDate("2026-05-12T21:00:00"),
    contentTheme: "failure",
    caseName: "EveryONE Medicines",
    articleUrl: "https://sparks-station.com/posts/20260306",
    sourceUrl: "src/content/posts/20260306.md",
    templateId: "reel_strong_failure_hook",
    hookText: "技術は世界級\nでも支払い手が不在",
    caption: `EveryONE Medicinesは、1人の患者に1つの薬を届ける個別化医療に挑みました。

でも事業は停止。

壁は技術だけではありません。

1. 患者ごとの手作業が重い
2. 保険償還モデルがない
3. 規制の歩みが遅い

技術が強いほど、誰が払うかを先に決める必要があります。

#DeepTech #マネタイズ #スタートアップ #失敗事例 #SparksStation`,
    slides: [
      {
        role: "hook",
        imagePrompt: "A brilliant personalized medicine startup facing an empty payer seat, deeptech business model failure metaphor, vertical 9:16, no text, no letters",
        overlayText: "技術は世界級\nでも支払い手が不在",
      },
      {
        role: "custom",
        imagePrompt: "A unique medicine being crafted individually for one patient in a high-tech lab, handcrafted complexity, vertical 9:16, no text, no letters",
        overlayText: "1人に1つの\n薬を作る",
      },
      {
        role: "payer",
        imagePrompt: "An empty payer chair between a patient and an expensive treatment pipeline, healthcare business model metaphor, vertical 9:16, no text, no letters",
        overlayText: "保険が払う\n型がない",
      },
      {
        role: "lesson",
        imagePrompt: "A startup runway clock moving faster than a slow regulatory clock, deeptech timing mismatch visual, vertical 9:16, no text, no letters",
        overlayText: "規制より先に\n資金が尽きる",
      },
    ],
    threadTemplateId: "thread_open_loop_failure",
    threadPosts: [
      "EveryONE Medicinesの失敗から学べること。技術が世界級でも、事業として先に決めるべき問いは、",
      "誰が払うのかです。同社は、1人の患者に1つの薬を届ける個別化医療に挑みました。",
      "ただ、患者ごとに異なる薬を設計し、製造し、リスク管理する。これはSaaSのように限界費用が下がる構造ではありません。",
      "さらに、世界に一人のための薬に対して、保険会社や国がどう支払うのかという枠組みがありませんでした。",
      "DeepTechでは、技術ロードマップだけでなく、支払い手、規制、最初のキャッシュフローを同時に設計しないと持ちません。",
      "記事では、個別化医療の挑戦がどこで事業の壁にぶつかったのかを整理しています。",
    ],
  }),
  reelPost({
    order: 6,
    scheduledAt: jstDate("2026-05-13T21:00:00"),
    contentTheme: "regulation",
    caseName: "Kintsugi",
    articleUrl: "https://sparks-station.com/posts/20260227",
    sourceUrl: "src/content/posts/20260227.md",
    templateId: "reel_strong_regulation_hook",
    hookText: "42億円調達でも\n規制待ちで停止",
    caption: `Kintsugiは、声からうつ病を検知するAI医療スタートアップ。

約42億円を調達しながら活動停止へ。

学びは、ベンチャーの時計と規制の時計のズレです。

1. FDA待ちが長すぎた
2. 医療機器に早く寄せすぎた
3. 収益ラインを先に作れなかった

規制外で日銭を作る道も必要でした。

#AI医療 #DeepTech #失敗事例 #GTM #SparksStation`,
    slides: [
      {
        role: "hook",
        imagePrompt: "A funded AI healthcare startup waiting at a regulatory gate while a runway clock burns down, realistic dramatic startup scene, vertical 9:16, no text, no letters",
        overlayText: "42億円調達でも\n規制待ちで停止",
      },
      {
        role: "waiting",
        imagePrompt: "Two clocks side by side, one fast startup clock and one slow regulation clock, AI healthcare startup tension, vertical 9:16, no text, no letters",
        overlayText: "規制の時計が\n遅すぎた",
      },
      {
        role: "cashflow",
        imagePrompt: "A small wellness AI product generating early revenue while a clinical product waits in the background, pragmatic startup visual, vertical 9:16, no text, no letters",
        overlayText: "先に日銭を\n作るべき",
      },
      {
        role: "lesson",
        imagePrompt: "A founder choosing a safer monetization path outside strict regulation before entering healthcare, strategic AI startup visual, vertical 9:16, no text, no letters",
        overlayText: "許可待ちを\n主戦場にしない",
      },
    ],
    threadTemplateId: "thread_open_loop_regulation",
    threadPosts: [
      "Kintsugiが約42億円を調達しても止まった理由。AI医療で最初に見るべきなのは精度だけではなく、",
      "タイムラインです。同社は声からうつ病を検知するAIを作り、臨床研究の実績もありました。",
      "ただ、FDA承認を待つ時間は長い。Kintsugiは規制対応に約1,600万ドル以上を投じたとされます。",
      "ベンチャーは早い成長を求められる一方、規制は数年単位で進む。この時計のズレが資金を削っていきます。",
      "初手から医療機器を狙うのではなく、企業ウェルネスや自己理解ツールなど、規制外で先に収益化する道もあったはずです。",
      "AIで規制産業に入るなら、プロダクト設計と同じくらい、最初の課金ラインをどこに置くかが重要です。",
    ],
  }),
  reelPost({
    order: 7,
    scheduledAt: jstDate("2026-05-14T21:00:00"),
    contentTheme: "weekly_summary",
    caseName: "Sparks Station article week summary",
    articleUrl: "https://sparks-station.com",
    sourceUrl: "src/content/posts",
    templateId: "reel_strong_weekly_summary",
    hookText: "AI時代に売れる人が\n先に見ているもの",
    caption: `今週の事例で共通していたこと。

AIで作れるかより、先に見るべきものがあります。

Base44は市場とGTM。
Subscribrは作る前の入金。
SEO Utilsは課金形態。
Noosa Labsは運用改善。
EveryONEとKintsugiは支払い手と規制。

作る前に、誰が払うかを見る。

#SparksStation #個人開発 #AI開発 #MicroSaaS #収益化`,
    slides: [
      {
        role: "hook",
        imagePrompt: "A weekly archive of startup case studies forming a clear monetization map for AI builders, editorial tech media mood, vertical 9:16, no text, no letters",
        overlayText: "AI時代に売れる人が\n先に見ているもの",
      },
      {
        role: "demand",
        imagePrompt: "A founder checking buyer demand and payment signals before building software, practical startup validation visual, vertical 9:16, no text, no letters",
        overlayText: "需要ではなく\n入金を見る",
      },
      {
        role: "pricing",
        imagePrompt: "A pricing model map showing one-time purchase, subscription, and bring-your-own-key as business levers, vertical 9:16, no text, no letters",
        overlayText: "価格モデルで\n差が出る",
      },
      {
        role: "risk",
        imagePrompt: "A founder avoiding regulation and platform dependency traps while choosing a safer monetization path, strategic startup visual, vertical 9:16, no text, no letters",
        overlayText: "支払い手と\n規制を見る",
      },
    ],
    threadTemplateId: "thread_open_loop_weekly_summary",
    threadPosts: [
      "AI時代に売れる人が、作る前に見ているもの。今週のSparks Station事例をまとめると、答えはかなりシンプルで、",
      "1つ目は、市場の波です。Base44はVibeコーディングの波とBuild in Publicが噛み合って、6ヶ月で約116億円Exitしました。",
      "2つ目は、入金です。Subscribrは完成前にLifetime Dealを50個売り、約300万円を先に回収してから本格開発しました。",
      "3つ目は、課金形態です。SEO Utilsは買い切り、Ring TonicはBYOKで、ユーザーにも運営にも痛みが少ない形を選んだ。",
      "4つ目は、運用力です。Noosa LabsはSaaSを買い、新機能より価格、割引、オンボーディングを直して伸ばしました。",
      "逆にEveryONEとKintsugiは、技術が強くても支払い手や規制の時計で苦しみました。作れる時代ほど、売れる構造を先に見たいです。",
    ],
  }),
];

for (const post of posts) {
  assertSafeImageText(post);
}

const pendingSnap = await db.collection("postsQueue").where("status", "==", "pending").get();
const batch = db.batch();

for (const doc of pendingSnap.docs) {
  batch.delete(doc.ref);
}

for (const post of posts) {
  const ref = db.collection("postsQueue").doc();
  batch.set(ref, post);
}

await batch.commit();

console.log(`Deleted pending posts: ${pendingSnap.size}`);
for (const post of posts) {
  console.log(
    `#${post.order} [${post.caseName}] scheduled=${post.scheduledAt.toISOString()} ${post.instagram.hookText.replace(/\n/g, " ")} seeded`
  );
}
console.log(`Done: ${posts.length} stronger article-based posts seeded.`);
