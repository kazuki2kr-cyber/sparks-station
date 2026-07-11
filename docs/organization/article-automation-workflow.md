# Sparks Station — 記事制作 automation ワークフロー

## 目的

Codex automation で、Sparks Station の記事制作を定期的に進める。対象はリサーチ、記事作成、DB更新、検証、mainへの自動commit / push、本番公開確認まで。オーナー承認は待たない。SNS/X/Instagram/Threadsのファイル、分析、投稿案、キュー、スクリプトには一切触れない。

記事は以下の2本軸で運用する。

- 月曜早朝: AIアップデート記事。OpenAI、Anthropic、Google、GitHub、Vercel、Cursor、Perplexity、Mistral などの最新アップデートを日本語で紹介し、日本の開発者がどう活用できるかへ翻訳する。
- 木曜早朝: 海外Micro-SaaS / AI SaaS / Exit / GTM事例記事。既存のPattern Aとして、SaaS Case DBの資産にもなる記事を作る。

## スケジュール方針

- 週2本を基本にする。
- 月曜 3:00 JST はホットなAIアップデートを扱う。
- 木曜 3:00 JST は海外Micro-SaaS / AI SaaS事例を扱う。
- automation は候補選定から始める。候補が弱い場合は、無理に公開せず調査メモだけを残す。
- Pattern A（SaaS / Micro-SaaS / Exit / 失敗事例 / GTM）はケンの3領域リサーチを前提にする。
- Pattern B（概念 / 技術思想）は必要な外部確認を行い、ファクトチェック対象の数字を無理に増やさない。
- Pattern C（AIアップデート）は速報性と実用性を重視し、公式発表または一次情報を優先して確認する。
- Pattern Aの3領域リサーチと数値照合結果は `docs/research/articles/[slug].md` に保存する。

## 命名規則

- 記事ファイルは `src/content/posts/[slug].md` に作成する。
- slugは英語小文字、数字、ハイフンのみ。
- 日本語、アンダースコア、日付だけのファイル名は使わない。
- 画像を使う場合は `public/images/[slug].webp` とし、frontmatterは `image: "/images/[slug].webp"` にする。

## automation の作業範囲

1. 実行日を確認し、月曜ならAIアップデート、木曜なら海外事例を優先する。
2. 月曜は公式ブログ、開発者ブログ、リリースノート、信頼できる報道から直近7日程度のAIアップデート候補を探す。
3. 木曜は `docs/article-candidates.md`、既存記事、SaaS Case DBから候補を選ぶ。
4. 既存記事とDBの重複を確認する。
5. 必要に応じてWebで一次情報・信頼できる情報源を確認する。
6. Pattern Aなら、ビジネスファクト / テック・GTM / 日本市場の観点で情報を整理する。
7. Pattern Cなら、何が変わったか、誰に影響するか、どんな小さなプロダクトや業務自動化に転用できるかを整理する。
8. `src/content/posts/[slug].md` に記事を作成する。
9. Pattern Aなら `data/monetization/saas-case-database.seed.json` を追加または更新する。Pattern Cでは原則DB行を作らない。
10. `npm run articles:validate -- --article=[slug]` を実行し、slug、frontmatter、タグ、文字数、構成、リンク、画像、DB整合、JSONを機械検証する。
11. `npm run articles:analyze` を実行する。このコマンドは記事インサイトだけを扱い、SNS派生物を生成しない。
12. `npm run build` を実行する。
13. 記事、Pattern A調査メモ、該当DB、記事インサイトだけをstageする。
14. `npm run articles:publish-scope -- --article=[slug] --staged` で `main`、`HEAD`、`origin/main` の整合とstage済みファイルallowlistを確認する。
15. 承認を待たずcommitし、`main` へpushする。
16. pushしたcommit SHAに対応するApp Hosting rolloutの成功を上限時間付きで待つ。
17. 公開URLのHTTP 200、記事タイトル、sitemap掲載を確認し、Search Console indexing が必要なURLを最終報告に残す。

## 自動公開ゲート

以下をすべて通過した場合だけmainへ自動pushする。

1. `git branch --show-current` が `main`。
2. fetch後の `HEAD` が最新の `origin/main` を含む。
3. `articles:validate`、`articles:analyze`、`build` が成功。
4. 変更対象が次のallowlist内だけ。
   - `src/content/posts/[slug].md`
   - `docs/research/articles/[slug].md`（Pattern Aのみ）
   - `data/monetization/saas-case-database.seed.json`（Pattern Aのみ）
   - `data/insights/sparks-article-insights.json`
5. `.env*`、秘密鍵、Firebase認証情報、SNS関連ファイル、Fantasy Quizzes Kingdomのファイルが含まれていない。

push成功と本番公開成功は別々に判定する。rolloutや公開確認に失敗した場合、追加commitで取り繕わず「push済み・公開未確認」としてcommit SHA、失敗理由、再確認手順を報告する。

## Pattern C: AIアップデート記事

AIアップデート記事は、単なるニュース要約にしない。必ず「日本の個人開発者・技術系創業者がどう使えるか」へ変換する。

優先ソース:

- OpenAI News / Platform docs / Changelog
- Anthropic News / Claude docs / Release notes
- Google AI / Google Developers Blog / Gemini API release notes
- GitHub Blog / GitHub Changelog
- Vercel Blog / Changelog
- Cursor、Perplexity、Mistral、Meta AI、xAIなどの公式発表
- The Verge、TechCrunch、Axiosなどの信頼できる報道。ただし可能なら公式発表で裏取りする。

記事構成:

```markdown
## 1. 【サマリー】今回のAIアップデートで何が変わったか
### 対象サービス / モデル / 機能
### 変更点
### なぜ今重要か

## 2. 【Fact】公式発表と確認できる事実
### 機能・性能・料金・提供範囲
### 開発者向けの変更
### 未確認または注意が必要な点

## 3. 【Impact】誰の仕事・プロダクトが変わるか
### 個人開発者への影響
### SaaS / 業務ツールへの影響
### 既存プロダクトのリスク

## 4. 【Localize】日本で試せる活用アイデア
### 小さく作れるプロダクト案
### 既存業務への導入案
### 最初の1週間で試すこと
```

frontmatter:

- `tags[0]` は `AIUpdate` を使う。
- 推奨タグは `["AIUpdate", "AI", "Product", "TechStack"]` または `["AIUpdate", "AI", "Strategy", "Product"]`。
- タイトルには、対象サービス名と「何ができるようになったか」を入れる。
- summaryはニュースの要約ではなく、読者が試せる使い道まで含める。

## 禁止事項

- X投稿案を作らない。
- Instagram Reels、Threads、その他SNS投稿案を作らない。
- Firestore `postsQueue` へ投入しない。
- `scripts/seed-sparks-sns-posts.mjs`、`scripts/check-sns-queue.mjs`、`npm run sns:insights` は実行しない。
- `tmp/sns-*`、SNSインサイト、SNS候補、SNS本文を読まない・生成しない・更新しない。
- 本名を公開面に出さない。
- 同一サービスのDB行を重複作成しない。
- AIアップデート記事で未確認の性能、料金、提供範囲を断言しない。
- 報道だけを根拠にした数字やリリース情報は、公式発表で裏取りできない限り「報道ベース」と明記する。

## 完了報告

automation は以下を報告する。

- 選んだテーマと採用理由
- 記事タイプ（AIアップデート / 海外事例）
- 作成/更新した記事ファイル
- DB更新の有無
- 実行した検証コマンド
- commit / push の結果
- pushしたcommit SHAとApp Hosting rolloutの結果
- 公開URLのHTTP、タイトル、sitemap確認結果、または公開確認できなかった理由
- Search Console indexing が必要なURL
