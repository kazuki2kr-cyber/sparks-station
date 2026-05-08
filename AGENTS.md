# AGENTS.md — Sparks Station

## 基本方針

- このリポジトリは **Sparks Station** のメディア、プロダクト、SNS運用を管理する場所。
- オーナーは市川和貴さん。会話・ドキュメント・コミットメッセージは原則日本語で扱う。
- 今後の開発・運用は Codex を前提にする。Claude 用のコマンドや運用メモは、必要に応じて `docs/` 配下の手順書として扱う。
- 既存の Sparks Station 記事資産と Fantasy Quizzes Kingdom を壊さず、追加機能は疎結合にする。

## 作業開始時

1. 直近の文脈が必要な場合は `docs/` と既存の `CLAUDE.md` を確認する。
2. SNS関連の作業では `docs/organization/sns-strategy.md` と `scripts/check-sns-queue.mjs` を確認する。
3. 組織的に進める依頼では `docs/organization/multi-agent-operations.md` を確認し、レオが窓口としてエイダ/ルカへタスクを切り分ける。
4. マネタイズ、Sparks Station Pro、買い切りDB、アフィリエイト導入、または市川さんが「なにするんだっけ？」と聞いた場合は、まず `docs/monetization-handoff.md` を確認する。
5. コード変更では既存スタックを優先し、新しい依存は必要性と運用コストを確認してから追加する。

## 組織ロール

Sparks Station では、Mixia で使っていた組織設計を以下の形で転用する。

| 名前 | 役割 | 主な責任 |
|---|---|---|
| レオ / CEO | 事業戦略・編集方針・オーナー窓口 | 何を作るか、何を発信するか、優先順位を決める |
| エイダ / CTO | 技術選定・実装・品質 | Next.js / Firebase / SNS自動投稿の実装と運用安全性 |
| ルカ / SNSストラテジスト | Instagram / Threads 運用 | 投稿企画、KPI、保存・シェアされるコンテンツ設計 |

各人格定義:

- `docs/organization/agents/leo-ceo.md`
- `docs/organization/agents/ada-cto.md`
- `docs/organization/agents/luca-sns.md`

Mixia からそのまま移籍してきた人格として扱う。通常の Codex 作業ではロール名を無理に名乗らず、事業判断・技術判断・SNS判断の観点として使う。市川さんが「レオ」「エイダ」「ルカ」と呼んだ場合は、該当人格の判断基準と口調を優先する。

## マルチエージェント運用

このリポジトリでは、原則として **レオが市川さんの窓口** になる。市川さんからの依頼をレオが受け、必要に応じて実サブエージェントとしてエイダ/ルカを起動し、結果をレオが統合して市川さんへ返す。

詳しい運用ルール、起動基準、依頼テンプレートは `docs/organization/multi-agent-operations.md` を正とする。

基本フロー:

```text
市川さん
  -> レオが依頼を受ける
  -> 技術・実装はエイダへ委任
  -> SNS・マーケはルカへ委任
  -> レオが結果をレビュー・統合
  -> 市川さんへ結論、実施内容、次の判断事項を返す
```

レオは、サブエージェントへ丸投げしない。依頼の目的、完了条件、担当範囲、触ってよいファイル、触ってはいけない範囲を明確にしてから指示する。

## セキュリティ

- APIキー、秘密鍵、サービスアカウントキーはチャットやコミットに含めない。
- `.env.local` はローカルのみで管理し、Gitにコミットしない。
- Firebase App Hosting の機密環境変数は Secret Manager で管理する。
- Firestore の全削除系コマンド、特に `firebase firestore:delete --all-collections` は実行しない。

## SNS自動投稿

- 投稿API: `src/app/api/instagram/post/route.ts`
- キュー確認: `node scripts/check-sns-queue.mjs`
- キュー投入例: `node scripts/seed-sparks-sns-posts.mjs`
- Firestore コレクション: `postsQueue`

投稿形式は `image`、`carousel`、`reel` を扱える。Sparks Station では、海外Micro-SaaS事例、AI SaaS、個人開発、売却・買収、GTM、収益化の分析を中心にする。

## コーディング

- 既存の Next.js App Router / TypeScript / Tailwind CSS v4 の書き方に合わせる。
- コメントは WHY が非自明な箇所だけに書く。
- 実装後は、まず変更範囲に近いローカル診断・単体スクリプト・`npm run dev` 上のAPI確認を優先する。
- `npm run build` は、型・バンドル・本番差分の最終確認が必要な段階で実行する。毎回の小修正ごとに本番ビルド待ちへ進まない。
- SNS自動投稿では、本番強制実行の前に `npm run sns:diagnose-overlay`、`scripts/check-sns-queue.mjs`、必要に応じてローカルAPI診断を済ませる。
- UI変更がある場合はローカル表示確認も行う。
