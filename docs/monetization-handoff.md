# Sparks Station — マネタイズ引継ぎ

最終更新: 2026-05-09

この文書は、Sparks Station の収益化、Stripe決済、SaaS Case DB、Sparks Station Pro、アフィリエイト、公開名義ルールの引継ぎメモです。

## まず読むもの

マネタイズ、Sparks Station Pro、買い切りDB、アフィリエイト導入、または「次になにするんだっけ？」という相談では、最初にこの文書を読む。

関連文書:

- `docs/monetization-service-design.md`
- `docs/monetization-strategy.md`
- `docs/stripe-email-setup-guide.md`
- `docs/organization/philosophy.md`
- `docs/organization/sns-strategy.md`

## 公開名義ルール

公開サイト、SNS、Stripe審査、特定商取引法に基づく表記、顧客向けメールや決済画面では、オーナー本名を原則公開しない。

- 販売事業者: `Sparks Station運営事務局`
- 運営責任者、編集者名が必要な場合: `川上大和`
- 問い合わせ先: `sparks.station.contact@gmail.com`

作業用ドキュメントやCodex内の会話では市川さんと呼んでよいが、外部公開面へ転記しない。

## 2026-05-09 時点の完了事項

### Stripe / SaaS Case DB

- Stripe本番モードで `Sparks Station SaaS Case DB β版` の商品とPriceを作成済み。
  - Product ID: `prod_UTbEFvlOvdpBDG`
  - Live Price ID: `price_1TUe2U0MQKwsAMDfkqkBItcn`
  - 価格: 2,980円
- Stripe本番Webhookを作成済み。
  - URL: `https://sparks-station.com/api/stripe/webhook`
  - Event: `checkout.session.completed`
- Firebase App Hosting Secret Manager に以下を登録済み。
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- `apphosting.yaml` は本番購入受付ON。
  - `SAAS_CASE_DB_CHECKOUT_ENABLED=true`
  - `NEXT_PUBLIC_SAAS_CASE_DB_CHECKOUT_ENABLED=true`
- 決済フローは、購入前にGoogleログインし、Stripe Checkoutへ進む方式。
- WebhookでFirestore `productPurchases` に購入情報を保存する。
- 購入済みユーザー入口:
  - `/products/saas-case-db/access`
- Productsページに「購入済みの方はこちら」導線を追加済み。
- ローカルテスト専用のログイン迂回は本番反映前に削除済み。

注意:

- 実決済の完全通し確認は、本番で実際に購入しない限り完全には確認できない。
- テスト環境では、Checkout完了、Webhook、Firestore保存、DB表示、CSV/JSONダウンロードまで成功済み。
- 本番では、ログイン済みGoogleアカウントのUID/emailと購入情報を紐づける。

### 特定商取引法 / 連絡先

- `/commerce-disclosure` を公開済み。
- FooterやProductsページから遷移できる。
- 公開連絡先は `sparks.station.contact@gmail.com`。
- 個人名の公開は避け、必要箇所は `Sparks Station運営事務局` / `川上大和` を使用。

### Products / Pro / Waitlist

- ProductsページをSparks Station Proと買い切りDB中心に整理済み。
- Sparks Station Proの「先行案内を希望する」ボタンを追加済み。
- Pro先行案内はGoogleログイン後、Firestore `proWaitlist` に保存する。
- 2026-05-09に実登録を確認済み。Firestore `proWaitlist` に1件保存され、`source: products-pro-card` / `status: active` で反映された。
- Pro先行案内APIは、再登録時に初回 `createdAt` を上書きしないよう修正済み。
- API:
  - `src/app/api/pro-waitlist/route.ts`
- 現時点ではメール送信サービス未接続。登録者を保存するところまで。
- 今後Resend等を入れれば、登録直後の確認メールや先行案内メールへ接続できる。

### サイトUI

- トップページのH1改行を明示制御。
  - PCでは「海外SaaSの成功パターンを、」「日本で試せる形に翻訳する。」の2行。
- トップページ、Productsページ、Toolsページの文字化けを修正済み。
- Toolsページを現行デザインに合わせて刷新済み。
- Fantasy Quizzes Kingdomは壊さず残しつつ、Sparks Stationの主導線からは外している。

### 記事 / DB

- 記事作成skill:
  - `sparks-article-writer`
- Pattern A記事作成時は、原則 `data/monetization/saas-case-database.seed.json` にDB行を追加または更新する。
- 2026-05-08に追加した記事:
  - `/posts/cuppa-ai-seo-saas-acquisition`
  - file: `src/content/posts/cuppa-ai-seo-saas-acquisition.md`
- DBにCuppa行を追加済み。
- Magaiは既存記事と既存DB行があったため、重複追加しない方針にした。
- 2026-05-09に追加した記事:
  - `/posts/youform-affordable-typeform-alternative`
  - file: `src/content/posts/youform-affordable-typeform-alternative.md`
- DBにYouform行を追加済み。
- Youform記事は、Typeformの価格不満を拾ったフォームSaaS事例。月$18k MRR、8万人ユーザー、初期LTD、X/Redditでの手動DM、無料プランのブランド露出を主な学びとして整理した。

### SNS / Insights

- Instagram / Threads インサイト取得スクリプトを追加済み。
  - `scripts/check-sns-insights.mjs`
  - package script: `npm run sns:insights`
  - 出力: `tmp/sns-insights-latest.json`
- 2026-05-09時点では、直近posted 4件のインサイト取得に成功。
  - Instagramは `views`, `reach`, `likes`, `comments`, `saved`, `shares`, `total_interactions`, `ig_reels_avg_watch_time`, `ig_reels_video_view_total_time` を取得。
  - Threadsは `views`, `likes`, `replies`, `reposts`, `quotes` を取得。
  - Instagram APIは投稿実装と同じ `https://graph.instagram.com/v21.0` を使う。`graph.facebook.com` では現在の投稿用トークンをパースできなかった。
- `docs/organization/sns-strategy.md` と `docs/organization/agents/luca-sns.md` に、週次投稿作成前の流れを追加済み。
  1. `npm run sns:insights` で最新インサイト取得
  2. ルカが分析
  3. 必要なら改善候補を出す
  4. 方針変更は市川さん承認後に反映
  5. 投稿作成、投入、キュー確認
- SNS方針として、InstagramとThreadsの役割分担を導入済み。
  - Instagram: 保存 / プロフィール遷移
  - Threads: 記事流入 / 返信 / 引用・リポスト
- リール1枚目のフックは短くするだけでなく、「何の事例か」「なぜ自分に必要か」が伝わる情報を残す方針にした。

## 現在の主要ファイル

- Productsページ: `src/app/(portal)/products/page.tsx`
- Pro先行案内ボタン: `src/app/(portal)/products/components/ProWaitlistButton.tsx`
- Pro先行案内API: `src/app/api/pro-waitlist/route.ts`
- Checkout API: `src/app/api/checkout/saas-case-db/route.ts`
- Stripe webhook: `src/app/api/stripe/webhook/route.ts`
- 購入済みDB閲覧: `src/app/(portal)/products/saas-case-db/access/SaasCaseDbAccessClient.tsx`
- DB rows API: `src/app/api/products/saas-case-db/rows/route.ts`
- DB download API: `src/app/api/products/saas-case-db/download/route.ts`
- DB seed: `data/monetization/saas-case-database.seed.json`
- DB型/CSV生成: `src/lib/saas-case-db.ts`
- 購入権限: `src/lib/purchases.ts`
- Stripe REST helper: `src/lib/stripe-rest.ts`
- 推奨ツール/アフィリエイト: `src/lib/monetization.ts`
- トップページ: `src/app/(portal)/page.tsx`
- Toolsページ: `src/app/(portal)/tools/page.tsx`
- SNSインサイト取得: `scripts/check-sns-insights.mjs`
- SNSキュー確認: `scripts/check-sns-queue.mjs`
- SNSキュー投入: `scripts/seed-sparks-sns-posts.mjs`

## 今後必ずやること

### 1. 本番決済後の監視

初回本番購入が発生したら、以下を確認する。

1. Stripe DashboardでPaymentが成功している。
2. Stripe webhook endpointで `checkout.session.completed` が成功している。
3. Firestore `productPurchases` に購入記録が保存されている。
4. 購入者が `/products/saas-case-db/access` に同じGoogleアカウントで入れる。
5. CSV/JSONダウンロードができる。

初回購入前に安全に見る場合は、Checkout遷移直前までの動線確認に留める。

### 2. Pro先行案内のメール配信

現在はFirestore保存のみ。

次にやるなら:

1. Resend、SendGrid、Mailgun、またはGmail運用のどれにするか決める。
2. `proWaitlist` 登録時に確認メールを送る。
3. 運営側に新規登録通知を送る。
4. 配信停止導線とプライバシーポリシーの記載を確認する。

小さく始めるなら、まずはFirestoreから手動エクスポートしてGmailで案内でもよい。

### 3. DBの正式版品質チェック

β版販売中は `confidence: medium` を許容する。正式版v1前には、以下を再確認する。

- 公式URL
- 価格ページ
- MRR / ARR / 売却額
- sourceUrls
- 競合や現在のサービス存続
- 日本での初回実験が具体的か
- 推奨ツールが実装に繋がるか

DB行を追加するたびに、購入者向けの価値が上がるかを確認する。

### 4. 公開情報の個人名監査

本名公開回避は基本ルール。

定期的に以下を検索する。

```powershell
rg "市川|ichikawa|kazuki|Kazuki|一貴|和貴" src docs data -g "!node_modules" -g "!.next"
```

公開面に出る箇所があれば、`Sparks Station運営事務局` または `川上大和` に置き換える。

## 定期実行するとよいこと

### 毎週

- 新記事を1本追加する。
- Pattern AならDB行も追加または更新する。
- 週次SNS投稿作成前に最新インサイトを取得する。
  - `npm run sns:insights`
- ルカがインサイトを分析し、必要なら改善候補を出す。
- SNS方針変更は市川さんの許可を得てから反映する。
- SNS投稿キューを確認する。
  - `node scripts/check-sns-queue.mjs`
- 必要ならSNSキューを追加する。
  - `node scripts/seed-sparks-sns-posts.mjs`
- Pro先行案内登録者数を確認する。
- Search Consoleで新記事のインデックス状況を見る。

### 月次

- DBの新規行数と品質を確認する。
- 購入数、Checkout離脱、購入済みアクセス不具合を確認する。
- Pro先行案内登録者に送る近況/先行案内を作る。
- Toolsページのリンク切れと提携リンクを確認する。
- AdSenseがCTAや購入導線を邪魔していないか確認する。
- Stripe、Firebase、Google Cloudの請求/エラーを確認する。

### 四半期

- β版DBを正式版v1へ進めるか判断する。
- Proを月額課金にするか、先行案内だけ続けるか判断する。
- 価格を見直す。
- 特定商取引法、利用規約、プライバシーポリシーを見直す。

## できればやる改善

優先度順:

1. Pro先行案内の確認メール送信を実装する。
2. 管理者用の簡易ダッシュボードを作る。
   - `productPurchases`
   - `proWaitlist`
   - DB件数
   - 最新記事
3. 購入完了後メールを実装する。
   - DB入口URL
   - 購入時Googleアカウントでログインする説明
   - 問い合わせ先
4. DB閲覧画面に検索/フィルタを追加する。
   - category
   - confidence
   - acquisitionChannel
   - monetizationFit
5. 記事からDB購入へのCTAをA/B的に調整する。
6. Toolsページの提携リンクを正式に申請し、環境変数で差し替える。
7. Notion複製リンクは正式版v1以降に検討する。
   - β版ではWeb閲覧 + CSV/JSONを主にする。

## 記事作成時の運用

SaaS、Micro-SaaS、海外事例、買収、収益化、GTM系の記事では `sparks-article-writer` skillを使う。

基本手順:

1. 既存記事とDBに重複がないか検索する。
2. 一次情報または信頼できる記事を確認する。
3. slugを英語小文字ハイフンで決める。
4. `src/content/posts/[slug].md` を作る。
5. `data/monetization/saas-case-database.seed.json` に行を追加または更新する。
6. JSON parseチェックを行う。
7. `npm.cmd run build` を実行する。
8. commit/pushする。

重複注意:

- 同じプロダクトのDB行を増やさない。
- 既存行がある場合は、sourceUrls、revenue、japanHypothesis、firstExperiment、notesを更新する。

## ローカルテスト注意

Stripeテスト時にローカル専用の迂回を入れる場合は、本番反映前に必ず削除する。

禁止:

- `SAAS_CASE_DB_LOCAL_TEST_EMAIL` を `apphosting.yaml` に入れる。
- `NEXT_PUBLIC_SAAS_CASE_DB_LOCAL_TEST` を本番に入れる。
- ログインなしで購入済みアクセスできるコードを本番へ残す。

本番コードの原則:

- Checkout作成にはGoogle ID tokenが必要。
- DB rows APIにはGoogle ID tokenが必要。
- ダウンロードAPIは、Google ID tokenまたは購入成功ページで発行したtokenのみ許可。

## 次回のおすすめ着手順

1. 2026-05-11 月曜日に、まず `npm run sns:insights` を実行して最新インサイトを取得する。
2. ルカが直近投稿を分析する。
   - Instagramのviews/reach/保存/シェア/平均視聴時間
   - Threadsの1投稿目ビュー、返信、リンク導線
   - フック、テーマ、CTAの差
3. 必要ならSNS方針の改善候補を出す。ただし方針反映は市川さん承認後。
4. Youform記事を含め、次週の投稿を作成して `scripts/seed-sparks-sns-posts.mjs` に反映する。
5. `node scripts/seed-sparks-sns-posts.mjs` で投稿キューを投入し、`node scripts/check-sns-queue.mjs` で確認する。
6. 初回購入が出たら、本番WebhookとDBアクセスを確認する。
7. Resend等のメール送信基盤は先送り。実装時はPro登録確認メール、運営通知、購入完了メールの順で考える。

## 今日の最終コミット

- `465b1ec Pro先行案内とCuppa事例を追加`
- `Youform事例とSNS分析フローを追加`

`465b1ec` には、Pro先行案内、トップ/Tools改善、Cuppa記事、DB追加が含まれる。
`Youform事例とSNS分析フローを追加` には、Youform記事、DB追加、SNSインサイト取得、週次SNS分析フロー、Pro先行案内APIの小修正が含まれる。
