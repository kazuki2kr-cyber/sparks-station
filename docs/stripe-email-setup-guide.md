# Stripe決済前の公開用メールアドレス設定ガイド

## 方針

Sparks Stationの決済導入では、個人メールを表に出さず、公開用の連絡先を先に用意する。

初期案は次の構成にする。

- サイト表示: `sparks.station.contact@gmail.com`
- 受信先: `sparks.station.contact@gmail.com`
- 転送: 使わない
- 返信: 同じGmailから返信
- 用途: Stripe通知、問い合わせ、特定商取引法に基づく表記の連絡先

独自ドメインのメールは後で必要になったら追加する。まずは確実に受信できるGmailをそのまま公開する。

## 1. 先に決めるメールアドレス

初期の公開メールアドレス:

```text
sparks.station.contact@gmail.com
```

用途を分けたくなった場合の候補:

```text
support@sparks-station.com
billing@sparks-station.com
legal@sparks-station.com
```

初期は増やしすぎず、`sparks.station.contact@gmail.com` だけでよい。

## 2. 新規Gmailを作る

1. Googleアカウント作成画面を開く。
2. Sparks Station専用のGmailを作る。
3. 2段階認証を有効化する。
4. 復旧用メールと電話番号を設定する。
5. Stripe、Firebase、Cloudflare関連の通知を受ける受信箱として使う。

```text
sparks.station.contact@gmail.com
```

このGmailをサイト上、Stripe通知先、特定商取引法に基づく表記の連絡先として使う。

## 3. Gmailの初期設定

1. 2段階認証を有効化する。
2. 復旧用メールと電話番号を設定する。
3. 表示名を `Sparks Station` にする。
4. 署名を設定する。

署名例:

```text
Sparks Station
https://sparks-station.com
sparks.station.contact@gmail.com
```

## 4. 受信テスト

別のメールアドレスから送信する。

```text
To: sparks.station.contact@gmail.com
Subject: Sparks Station contact test
```

確認項目:

- Gmailに届く
- 迷惑メールに入っていない
- 差出人、件名、本文が読める
- 返信が必要な問い合わせとして扱える

## 5. 返信運用

初期は `sparks.station.contact@gmail.com` からそのまま返信する。

## 6. Stripe側で設定する

Stripe Dashboardで次を確認する。

1. アカウントの通知先メールを新規Gmailにする、または通知先として追加する。
2. 顧客向け表示やサポート連絡先に `sparks.station.contact@gmail.com` を設定できる場合は設定する。
3. 買い切りDBの商品名、価格、レシート表示に不自然な文言がないか確認する。
4. Webhook通知や本人確認関連メールが新規Gmailへ届くことを確認する。

## 7. サイト側で設定する

本番環境に次を設定する。

```text
NEXT_PUBLIC_CONTACT_EMAIL=sparks.station.contact@gmail.com
```

この値はサイト上に表示される公開連絡先として使う。未設定の場合も、コード側では `sparks.station.contact@gmail.com` を既定値にしている。

あわせてStripe決済用の環境変数も設定する。

```text
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_SAAS_CASE_DB_BETA_PRICE_ID=price_1TUe2U0MQKwsAMDfkqkBItcn
NEXT_PUBLIC_SITE_URL=https://sparks-station.com
```

## 8. 公開前チェック

- `/contact` に公開メールが表示される
- `/commerce-disclosure` に公開メールが表示される
- Productsページから特定商取引法に基づく表記へ遷移できる
- Footerから特定商取引法に基づく表記へ遷移できる
- `sparks.station.contact@gmail.com` に問い合わせメールが届く
- Stripe通知が新規Gmailへ届く

## 9. 後で独自ドメインメールにしたくなったら

必要になった段階で次のどれかに移行する。

- Cloudflare Email Routingで `contact@sparks-station.com` をGmailへ転送する
- Google Workspaceで `contact@sparks-station.com` を正式運用する
- Fastmail、Proton Mailなどの独自ドメインメールを使う

## 10. 次にやるStripe作業

メール設定後に進める順番。

1. Stripeで `Sparks Station SaaS Case DB β版` の商品を作る。
2. 2,980円のPriceを作る。
3. コードを固定Price ID参照に寄せる。
4. Webhook endpointを登録する。
5. Firebase App Hosting / Secret Managerに環境変数を入れる。
6. テスト決済で、Googleログイン、Stripe決済、Firestore購入記録、DB閲覧、CSV/JSONダウンロードを確認する。
