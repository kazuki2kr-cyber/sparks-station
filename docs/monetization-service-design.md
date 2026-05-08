# Sparks Station — 収益商品のサービス設計

## 基本方針

Sparks Station の初期収益商品は、運用負荷を小さく保つ。

- 買い切りDB: 所有型の商品。購入時点のv1系データへアクセスできる。
- Sparks Station Pro: 継続アクセス型の商品。最新DB、月次追加、実験テンプレート、Pro限定メモを読むための軽い月額。
- Pro Plus、個別相談、添削、優先リサーチなど、継続提供の負荷が高い商品は当面作らない。

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

β版購入者は、正式版v1へ差額なしでアップグレードできる。

### 正式版

| 項目 | 内容 |
|---|---|
| 価格 | 4,980〜9,800円 |
| 件数 | 50〜100件 |
| 形式 | Web閲覧 + CSV + JSON + Notion複製リンク |
| 更新 | v1系の軽微更新のみ |
| 品質 | 主要URL、価格、売上、買収額などを再確認 |
| 目的 | 商品として継続販売する |

正式版購入者は、v1系の軽微な更新を受け取れる。v2以降は別売り、またはPro加入中の閲覧対象にする。

## Sparks Station Pro

### 役割

Proは「DBを無料で見られる月額」ではなく、最新の事例と実験手順が継続的に届くサービスにする。

### 初期価格

- 月額980〜1,980円で検証する。
- 最初は月額980円から始め、更新頻度と内容が安定したら値上げを検討する。

### 含めるもの

- 月1〜2本程度のPro限定事例メモ
- 買い切りDBの新規追加分を加入中に閲覧
- 日本で試すための初回検証テンプレート
- 推奨ツールと実装メモ
- 不定期の「今月作るならこれ」メモ。継続提供の約束にしすぎない。

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
| 性質 | 所有 | 加入中のアクセス |
| 対象 | v1系DB | 最新DB + Proメモ |
| 退会後 | 購入済みv1は残る | 最新DBアクセスは停止 |
| 更新 | v1正式版まで / v1軽微更新 | 加入中は継続更新 |

買い切りDBはProへの入口商品として扱う。

## リリース順序

1. β版DBを先行販売する。
2. 購入者の反応、問い合わせ、利用状況を見て正式版DBの範囲を決める。
3. Proは正式版DBより後でもよい。β版DBの需要が確認できてから募集する。

ページ上でも、販売中なのはβ版DBだけで、正式版DBとProは準備中であることを明示する。更新頻度は実際より控えめに予告し、継続負荷の高い約束をしない。

## 課金・アクセス設計

### 課金

- 買い切りDBは Stripe Checkout の一回払い。
- Proは Stripe Checkout + Billing の月額サブスクリプション。
- 初期実装は買い切りDBのみ先に入れる。

### 購入後アクセス

放置運用を優先するため、購入前にGoogleログインを必須にする。購入者リンクだけに依存すると、ブラウザを閉じた、別端末で開いた、URLを紛失した、プライベートブラウザで購入した、といったケースでサポートが増えるため。

1. ProductsページでGoogleログインする。
2. ログイン済みメールアドレスを `customer_email` としてStripe Checkoutへ送る。
3. Stripe Checkoutで決済する。
4. Stripe webhook `checkout.session.completed` でFirestoreに購入記録を保存する。
5. 購入者は同じGoogleアカウントで `/products/saas-case-db/access` からDBを閲覧し、CSV/JSONをダウンロードできる。

### 注意

- Notion複製リンクは便利だが流出制御が難しいため、正式版まではSparks Station内のWeb閲覧とCSV/JSONを主にする。
- 購入者リンク方式は主導線にしない。ブラウザ依存が強く、サポートが増えるため。
- 購入時と別のGoogleアカウントでログインした場合のみ、購入者側の操作ミスとして案内する。
- メール再送、購入履歴ページは後続実装でよい。

## 初期実装スコープ

1. Productsページに買い切りDB β版の購入導線を追加する。
2. Stripe Checkout Session作成APIを追加する。
3. Stripe webhookで購入権限をFirestoreへ保存する。
4. Googleログイン済み購入者専用ページでDBを表示する。
5. CSV/JSONダウンロードAPIを追加する。
6. Stripe webhookで購入記録を補強する。

## 必要な環境変数

```text
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_SAAS_CASE_DB_BETA_PRICE_ID=
NEXT_PUBLIC_SITE_URL=https://sparks-station.com
```

Firebase Admin の既存環境変数も、購入記録をFirestoreへ保存するために必要。

```text
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

## 次回のStripe決済フロー完成タスク

次回はここから再開する。

1. Stripe上に `Sparks Station SaaS Case DB β版` の商品と2,980円のPriceを作る。（対応済み）
   - Product ID: `prod_UTbEFvlOvdpBDG`
   - Price ID: `price_1TUe2U0MQKwsAMDfkqkBItcn`
2. コード側を動的 `price_data` ではなく、環境変数 `STRIPE_SAAS_CASE_DB_BETA_PRICE_ID` 参照に変更する。（対応済み）
3. Stripe webhook endpoint を本番URLに登録する。
   - URL: `https://sparks-station.com/api/stripe/webhook`
   - Event: `checkout.session.completed`
4. Firebase App Hosting / Secret Manager に必要な環境変数を入れる。
5. テスト決済で、購入前Googleログイン、Stripe決済、Firestore購入記録、DB閲覧、CSV/JSONダウンロードまで確認する。

## Stripeテスト環境での確認手順

本番モードでは実際に課金できてしまうため、公開サイトでは `SAAS_CASE_DB_CHECKOUT_ENABLED=false` のままにする。

テスト決済はローカル環境で行う。Stripeプラグインから取得できる商品/Priceは本番側のみのため、テスト環境で作成した1980円商品のPrice IDはStripe Dashboardから手動でコピーする。

ローカル `.env.local` に一時的に入れる値:

```text
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SAAS_CASE_DB_BETA_PRICE_ID=price_...
SAAS_CASE_DB_CHECKOUT_ENABLED=true
NEXT_PUBLIC_SAAS_CASE_DB_CHECKOUT_ENABLED=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CONTACT_EMAIL=sparks.station.contact@gmail.com
```

注意:

- `STRIPE_SECRET_KEY` は必ず `sk_test_` で始まるものを使う。
- テスト用Price IDは、テスト環境で作った1980円商品のPrice IDを使う。
- 本番 `apphosting.yaml` は `SAAS_CASE_DB_CHECKOUT_ENABLED=false` のままにする。
- テスト完了後、本番公開するときだけ `SAAS_CASE_DB_CHECKOUT_ENABLED=true` / `NEXT_PUBLIC_SAAS_CASE_DB_CHECKOUT_ENABLED=true` に切り替える。

ローカルWebhook確認は、Stripe CLIが使える場合は以下で転送する。

```powershell
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

表示された `whsec_...` をローカル `.env.local` の `STRIPE_WEBHOOK_SECRET` に入れる。

テストカード:

```text
4242 4242 4242 4242
任意の未来日付
任意のCVC
```

## Stripe・サイト表示・個人情報の方針

できるだけ個人情報を表に出さない。ただし、通信販売/オンライン販売として必要な表示は避けない。

現時点で確認した公式情報:

- 消費者庁の特定商取引法ガイドでは、インターネット上で申込みを受ける取引も通信販売に該当し得る。
- 通信販売広告では、販売価格、支払時期/方法、引渡時期、撤回/解除、事業者の氏名/名称、住所、電話番号などが表示事項として挙げられている。
- 一部表示事項は、消費者から請求があった場合に電子メール等で遅滞なく提供できる措置を講じ、広告上にその旨を表示することで省略できる余地がある。
- 電子メール広告を送る場合は、事業者の電子メールアドレスが表示事項に含まれる。
- Stripeの日本向けヘルプでも、商取引に関する開示ページの表示が必要とされている。

次回の実装方針:

- `/commerce-disclosure` または `/legal/commerce-disclosure` に「特定商取引法に基づく表記」ページを作る。
- Productsページ、Footer、Stripe Checkoutの説明欄から同ページへ到達できるようにする。
- 個人住所・個人電話番号は、可能ならページ上では直接表示せず、「請求があれば遅滞なく開示します」という方式を検討する。
- ただし、最終的にStripe審査や法務上の都合で直接表示が必要になった場合は、個人情報保護とのバランスを再判断する。
- 返品/キャンセルは、デジタル商品の性質上「購入後の返金不可。ただし重複購入、アクセス不能、当方の重大な不具合は個別対応」と明記する案を検討する。

## 公開用メールアドレス候補

余剰メールアドレスがないため、次回Stripe設定と並行して無料で取得・設定する。

第一候補:

1. 無料Gmailを新規取得する。
   - 例: `sparks.station.contact@gmail.com`
   - 用途: Stripe通知、問い合わせ受信、特商法表示の連絡先。
   - 個人メールを表に出さずに済む。
2. ドメインDNSがCloudflareで管理できる場合、Cloudflare Email Routingを使う。
   - 例: `contact@sparks-station.com` → 新規Gmailへ転送。
   - Cloudflare Email Routingは無料で、カスタムアドレスを作り任意の受信箱へ転送できる。
   - 注意: Cloudflare Email Routingは基本的に受信転送用。送信SMTPは提供しないため、返信時の送信元をどうするかは別途決める。

現実的な初期案:

- サイト表示: `contact@sparks-station.com`
- 転送先: 新規無料Gmail
- 返信: 初期は新規Gmailから返信。必要になったら有料メール/送信サービスを検討。

無料候補:

- Gmail: 最速。個人情報を分離しやすい。
- Cloudflare Email Routing: 独自ドメインの受信用アドレスを無料作成できる。ドメインをCloudflare管理に寄せる必要がある。
- Forward Email: 無料転送候補。使う場合はDNS設定と信頼性を確認する。

次回の確認事項:

- `sparks-station.com` のDNSがCloudflare管理かどうか。
- Stripeアカウントのメールを新規公開用Gmailに変更するか、通知先だけ追加できるか。
- 特商法ページに掲載する販売者名、住所/電話の扱い、請求時開示の文言。

参考:

- 消費者庁 特定商取引法ガイド 通信販売: https://www.no-trouble.caa.go.jp/what/mailorder/
- 消費者庁 特定商取引法ガイド インターネット通信販売: https://www.no-trouble.caa.go.jp/what/mailorder/rule.html
- Stripe「特定商取引法に基づく表記」ページの作成と表示方法: https://support.stripe.com/questions/how-to-create-and-display-a-commerce-disclosure-page?locale=ja-JP
- Cloudflare Email Routing: https://developers.cloudflare.com/email-routing/
