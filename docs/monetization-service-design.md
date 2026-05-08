# Sparks Station — 収益商品のサービス設計

最終更新: 2026-05-08

この文書は、Sparks Station の買い切りDB、Sparks Station Pro、決済、購入後アクセス、先行案内の設計メモ。

## 基本方針

初期収益商品は、運用負荷を小さく保つ。

- 買い切りDB: 一回払い。購入者はv1系DBへアクセスできる。
- Sparks Station Pro: 継続アクセス型。最新事例、実験テンプレート、Pro限定メモを読むための軽い月額候補。
- Pro Plus、個別相談、添削、優先リサーチ、DMサポートなど、継続提供負荷が高い商品は当面作らない。

Sparks Stationは「稼げます」ではなく、海外SaaSの成功パターンを日本で試せる形に翻訳する場所として育てる。

## 買い切りDB

### 役割

海外SaaS事例を、日本で何を作るか判断できる形に整理した入口商品。

### β版

| 項目 | 内容 |
|---|---|
| 価格 | 2,980円 |
| 件数 | 15〜25件 |
| 形式 | Web閲覧 + CSV/JSONダウンロード |
| 更新 | 正式版v1まで無料更新 |
| 品質 | 一部 `confidence: medium/low` を含む |
| 目的 | 買う人がいるか検証する |

β版購入者は、正式版v1へ差額なしでアップグレードできる想定。

### 正式版v1

| 項目 | 内容 |
|---|---|
| 価格 | 4,980〜9,800円 |
| 件数 | 50〜100件 |
| 形式 | Web閲覧 + CSV + JSON + 必要に応じてNotion複製 |
| 更新 | v1系の軽微な更新のみ |
| 品質 | 主要URL、価格、売上、買収額などを再確認 |
| 目的 | 商品として継続販売する |

正式版v1では、β版よりもソース確認と実験仮説の精度を上げる。

## Sparks Station Pro

### 役割

Proは「DBを無料で見られる月額」ではなく、最新事例と実験手順が継続的に届くサービスにする。

### 初期価格候補

- 月額980〜1,980円で検証する。
- 最初は980円でもよい。
- 更新頻度と中身が安定してから値上げを検討する。

### 含めるもの

- 月1〜2本程度のPro限定事例メモ
- 買い切りDBの新規追加分を加入中に閲覧
- 日本で試すための初回検証テンプレート
- 推奨ツールと実装メモ
- 不定期の「今月作るならこれ」メモ

### 含めないもの

- 個別相談
- 添削
- 優先リサーチ
- DMサポート
- コミュニティ運営
- 月次面談

## 買い切りDBとProの関係

| 区分 | 買い切りDB | Pro |
|---|---|---|
| 性質 | 所有型 | 加入中アクセス |
| 対象 | v1系DB | 最新DB + Proメモ |
| 退会後 | 購入済みv1は残る | 最新DBアクセスは停止 |
| 更新 | v1正式版まで / v1軽微更新 | 加入中は継続更新 |

買い切りDBはProへの入口商品として扱う。

## 決済設計

### 買い切りDB

- Stripe Checkoutの一回払い。
- 本番Price ID: `price_1TUe2U0MQKwsAMDfkqkBItcn`
- Checkout作成API: `src/app/api/checkout/saas-case-db/route.ts`
- Webhook: `src/app/api/stripe/webhook/route.ts`

### Pro

- 将来的にはStripe Checkout + Billingの月額サブスクリプション。
- 現在は先行案内登録のみ。
- 先行案内API: `src/app/api/pro-waitlist/route.ts`
- Firestore collection: `proWaitlist`

## 購入後アクセス

放置運用を優先するため、購入前にGoogleログインを必須にする。

理由:

- 購入者リンク紛失を避ける。
- 別端末でも同じGoogleアカウントでアクセスできる。
- サポート負荷を下げる。
- 購入者のメールとUIDをFirestoreに保存できる。

フロー:

1. ProductsページでGoogleログインする。
2. ログイン済みメールアドレスを `customer_email` としてStripe Checkoutへ送る。
3. Stripe Checkoutで決済する。
4. Stripe webhook `checkout.session.completed` でFirestoreに購入記録を保存する。
5. 購入者は同じGoogleアカウントで `/products/saas-case-db/access` からDBを閲覧する。
6. CSV/JSONをダウンロードできる。

購入済み入口:

- `/products/saas-case-db/access`

## Firestore

### productPurchases

購入済みDBアクセス用。

主なフィールド:

- `productId`
- `release`
- `authUid`
- `stripeSessionId`
- `email`
- `status`
- `source`
- `createdAt`
- `updatedAt`

### proWaitlist

Sparks Station Pro先行案内用。

主なフィールド:

- `uid`
- `email`
- `source`
- `status`
- `createdAt`
- `updatedAt`

現時点ではメール送信は未接続。登録者保存のみ。

## 必要な環境変数

本番:

```text
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SAAS_CASE_DB_BETA_PRICE_ID=price_1TUe2U0MQKwsAMDfkqkBItcn
SAAS_CASE_DB_CHECKOUT_ENABLED=true
NEXT_PUBLIC_SAAS_CASE_DB_CHECKOUT_ENABLED=true
NEXT_PUBLIC_SITE_URL=https://sparks-station.com
NEXT_PUBLIC_CONTACT_EMAIL=sparks.station.contact@gmail.com
```

Firebase Admin:

```text
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

注意:

- `.env.local` はコミットしない。
- Secret Managerに入れる値はチャットに貼らない。
- `SAAS_CASE_DB_LOCAL_TEST_EMAIL` や `NEXT_PUBLIC_SAAS_CASE_DB_LOCAL_TEST` は本番に入れない。

## Stripe本番設定

完了済み:

1. 商品作成
   - Product ID: `prod_UTbEFvlOvdpBDG`
   - Price ID: `price_1TUe2U0MQKwsAMDfkqkBItcn`
2. Webhook作成
   - URL: `https://sparks-station.com/api/stripe/webhook`
   - Event: `checkout.session.completed`
3. Firebase Secret Manager登録
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
4. App Hostingの購入受付ON

初回本番購入が発生したら、Stripe Dashboard、Webhook、Firestore、購入済みアクセスを確認する。

## Stripeテスト手順

ローカルでテストする場合:

1. Stripeテストモードで商品/Priceを作る。
2. `.env.local` に `sk_test_...` とテストPrice IDを入れる。
3. Stripe CLIでWebhookを転送する。

```powershell
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. 表示された `whsec_...` を `.env.local` の `STRIPE_WEBHOOK_SECRET` に入れる。
5. `NEXT_PUBLIC_SITE_URL=http://localhost:3000` にする。
6. `npm.cmd run dev` で確認する。

テストカード:

```text
4242 4242 4242 4242
任意の未来日
任意のCVC
```

重要:

- ローカルテスト用のログイン迂回を入れた場合は、本番前に必ず削除する。
- 本番コードではGoogleログイン必須を維持する。

## 公開情報と法務表示

公開名義:

- 販売事業者: `Sparks Station運営事務局`
- 運営責任者: `川上大和`
- 連絡先: `sparks.station.contact@gmail.com`

ページ:

- `/commerce-disclosure`
- `/privacy`
- `/terms`

デジタル商品のため、購入後のお客様都合による返品・キャンセルは不可。ただし重複決済、アクセス不具合、重大な商品説明との不一致は個別対応。

## 今後の設計課題

1. Pro先行案内のメール送信。
2. 購入完了メール。
3. 管理者用ダッシュボード。
4. DB検索/フィルタ。
5. 正式版v1の価格と件数。
6. Proの月額課金化。
7. アフィリエイトリンクの正式運用。
