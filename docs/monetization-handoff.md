# Sparks Station — マネタイズ次回引継ぎ

## 次回の合言葉

市川さんが以下のように聞いたら、まずこの文書を確認してから動き出す。

- 「なにするんだっけ？」
- 「次なにやる？」
- 「買い切りDB進めよう」
- 「アフィリエイト導入しよう」
- 「Sparks Station Proの続き」

## 現在の事業方針

Sparks Station は、ただの情報メディアではなく、海外SaaSの成功パターンを日本の個人開発者・小規模事業者が使える形に翻訳する場所として育てる。

記事は「海外で何が起きたか」で終わらせず、「日本で再現するなら何を検証し、どのツールを使い、どこで課金導線を作るか」まで接続する。

AdSense は床収益として残すが、主導線にはしない。主な収益導線は以下。

- 記事ごとの推奨ツール
- Sparks Station Pro
- 買い切りテンプレート・事例データベース
- ニュースレター登録
- スポンサー・タイアップ

関連文書:

- `docs/organization/philosophy.md`
- `docs/monetization-strategy.md`

## 実装済み

### 方針・ドキュメント

- `docs/organization/philosophy.md` に「海外SaaSの成功パターンを日本で試せる形に翻訳する」という編集・事業の軸を追加済み。
- `docs/monetization-strategy.md` に、アフィリエイト候補、収益導線、環境変数の方針を整理済み。

### サイト導線

- トップページを、記事一覧中心からLP寄りに変更済み。
  - 約束: 海外SaaSの成功パターンを日本で試せる形に翻訳する
  - 流れ: Case / Translate / Build
  - 導線: 最新記事、Sparks Station Pro、買い切りDB
- Aboutページを、理念に合わせて更新済み。
- Productsページを、Fantasy Quizzes Kingdom から Sparks Station Pro / 買い切りDB 中心に変更済み。
- 記事下に「この事例を日本で試すなら」という推奨ツール枠を追加済み。
- `src/lib/monetization.ts` に推奨ツール一覧と、環境変数でアフィリエイトURLに差し替える仕組みを追加済み。

### クイズアプリ/PWA

- Productsページ、Footer、sitemapから Fantasy Quizzes Kingdom の表導線を削除済み。
- PWAのmanifest routeとインストール促進コンポーネントを削除済み。
- クイズアプリ本体のページは壊さず残している。

### AdSense

- Auto ads 前提。`src/app/layout.tsx` のAdSenseグローバル読み込みは残す。
- コード側ではAdSenseを主導線にしない。
- 自動広告が記事冒頭、Pro/DBのCTA直前、Productsページなどに割り込む場合は、AdSense管理画面で「Excluded areas」または「Page exclusions」を設定する。

## 次にやるべきこと

優先順位は以下。

1. 買い切りDBの仕様を決める
2. DBの初期データを10〜20件作る
3. アフィリエイト申請・URL差し替えの運用を作る
4. Productsページに販売/予約/メール登録の実導線を入れる
5. Proの中身と価格を小さく検証する

## 1. 買い切りDBの仕様

目的は、単なる事例一覧ではなく「日本で何を作るか判断できる表」にすること。

初期カラム案:

| カラム | 内容 |
|---|---|
| productName | プロダクト名 |
| url | 公式URL |
| sourceUrls | 参照元URL。一次情報優先 |
| category | AI SaaS / Micro-SaaS / DevTool / Marketing / Automation など |
| targetCustomer | 誰が払うか |
| pain | どんな痛みを解決するか |
| productSummary | 何を売っているか |
| pricingModel | 月額 / 従量 / 買い切り / usage based など |
| priceRange | 価格帯 |
| revenue | MRR / ARR / 売却額など確認できる数字 |
| acquisitionChannel | 初期顧客の獲得チャネル |
| gtmPattern | SEO / LinkedIn / Product Hunt / marketplace / community など |
| successFactor | 成功要因 |
| riskOrFailure | 失敗・模倣時のリスク |
| japanHypothesis | 日本で再現するなら何を試すか |
| firstExperiment | 最初の検証手順 |
| recommendedTools | 実行に使うツール |
| monetizationFit | Sparks Station記事/Pro/アフィリエイトとの相性 |
| confidence | high / medium / low |
| notes | 補足 |

最初の販売形式:

- Notion DB または CSV/スプレッドシートで開始
- 10〜20件で初期版
- 価格は 2,980円〜4,980円で検証
- Productsページでは「先行案内」または「β版購入希望」から始める

## 2. 初期収録候補

すでに記事化済み・相性が良いものから始める。

- Base44
- Subscribr
- Lovable
- Cursor
- Framer
- beehiiv
- Make
- Webflow
- MicroAcquire / Acquire.com系の売却事例
- AIエージェント/業務自動化系の小規模SaaS

次回は `src/content/posts/` の既存記事を確認し、記事からDB候補を抽出するのが速い。

## 3. アフィリエイト導入

### まず申請・確認する場所

| 優先 | サービス | 目的 |
|---:|---|---|
| 1 | PartnerStack | B2B SaaS系の一括探索 |
| 2 | beehiiv | ニュースレター/メディア収益化 |
| 3 | Webflow | SaaS LP / 検証サイト |
| 4 | Framer | LP / テンプレ / AIサイト制作 |
| 5 | Make | 自動化 / AI workflow |
| 6 | Lovable | AIアプリ生成。新プログラム準備中のため確認 |
| 7 | Cursor | AI coding。公式プログラムの有無を確認 |
| 8 | impact.com / Awin | 補完的な案件探索 |

### 実装方針

承認済みURLを `.env.local` に入れる。

```text
AFFILIATE_BEEHIIV_URL=
AFFILIATE_WEBFLOW_URL=
AFFILIATE_FRAMER_URL=
AFFILIATE_MAKE_URL=
AFFILIATE_LOVABLE_URL=
AFFILIATE_CURSOR_URL=
```

`src/lib/monetization.ts` の `getToolUrl()` が、環境変数がある場合だけ提携URLに差し替える。

注意:

- `.env.local` はコミットしない。
- 記事/Products/Aboutのどこかに「一部リンクは提携リンクを含む場合があります」という表記を残す。
- 公式情報は変わりやすいので、次回の申請前に必ず最新ページを確認する。

## 4. 次回の動き方

市川さんが「なにするんだっけ？」と聞いた場合、次の順番で進める。

1. この `docs/monetization-handoff.md` を読む。
2. `docs/monetization-strategy.md` と `docs/organization/philosophy.md` を読む。
3. `src/lib/monetization.ts` と `src/app/(portal)/products/page.tsx` を確認する。
4. 市川さんに「買い切りDBから始めるか、アフィリエイト申請から始めるか」を短く確認する。
5. 迷う場合は買い切りDBから始める。理由は、DBの項目が固まると、記事導線・Pro・アフィリエイトの全部に使い回せるため。

## 次回の推奨初手

買い切りDBから始める。

具体的には:

1. `src/content/posts/` の記事一覧を確認する。
2. 既存記事からDBに入れられる候補を10件抽出する。
3. `data/monetization/saas-case-database.seed.json` のような初期データを作る。
4. Productsページに「収録予定項目」と「先行案内」の説明を足す。
5. その後、アフィリエイト申請済み/未申請の管理表を `docs/affiliate-programs.md` に作る。
