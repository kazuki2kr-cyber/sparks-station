# Sparks Station — マネタイズ引継ぎ

最終更新: 2026-05-08

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

## 2026-05-08 時点の完了事項

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

1. App Hosting反映後のProducts/Tools/記事表示を軽く確認する。
2. Pro先行案内の登録がFirestoreへ入るか確認する。
3. 初回購入が出たら、本番WebhookとDBアクセスを確認する。
4. 次の記事を1本追加し、DBを増やす。
5. Resend等のメール送信基盤を決める。

## 今日の最終コミット

- `465b1ec Pro先行案内とCuppa事例を追加`

このコミットには、Pro先行案内、トップ/Tools改善、Cuppa記事、DB追加が含まれる。
