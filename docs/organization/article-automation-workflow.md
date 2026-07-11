# Sparks Station — 記事制作 automation ワークフロー

## 目的

Codex automation で、Sparks Station の記事制作を定期的に進める。対象はリサーチ、記事作成、DB更新、検証、commit / push、公開確認まで。PR目的のX/SNS投稿、投稿案作成、投稿キュー投入は行わない。

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
10. `npm run articles:analyze` を実行する。
11. JSON parse、記事文字数、frontmatter、内部リンク、タグを確認する。
12. `npm run build` を実行する。
13. 変更内容が妥当なら記事関連ファイルだけをcommit / pushする。
14. デプロイが完了したら公開URLを確認し、Search Console indexing が必要なURLを最終報告に残す。

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
- 公開URL、または公開確認できなかった理由
- Search Console indexing が必要なURL
