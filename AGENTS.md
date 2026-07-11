# AGENTS.md — Sparks Station

## 基本方針

- このリポジトリは **Sparks Station** のメディア、プロダクト、収益化運用を管理する場所。
- オーナーは市川和貴さん。会話・ドキュメント・コミットメッセージは原則日本語で扱う。
- 今後の開発・運用は Codex を前提にする。Claude 用のコマンドや運用メモは、必要に応じて `docs/` 配下の手順書として扱う。
- 既存の Sparks Station 記事資産と Fantasy Quizzes Kingdom を壊さず、追加機能は疎結合にする。

## 作業開始時

1. 直近の文脈が必要な場合は `docs/` と既存の `CLAUDE.md` を確認する。
2. 組織的に進める依頼では `docs/organization/multi-agent-operations.md` を確認し、レオが窓口としてケン/エイダへタスクを切り分ける。
3. 記事制作 automation では `docs/organization/article-automation-workflow.md` を確認し、公開PR用のX/SNS作業は行わない。
4. 記事制作は、月曜のAIアップデート記事と木曜の海外Micro-SaaS / AI SaaS事例記事の2本軸で考える。
5. 新規記事作成、既存記事の大幅改稿、Pattern A（SaaS / Micro-SaaS / Exit / 失敗事例 / GTM）の記事制作では、市川さんが明示しなくてもマルチエージェント運用を使う。ケンをビジネスファクト / テック・GTM / 日本市場の3並行で起動し、完了後に執筆とファクトチェックへ進む。
6. マネタイズ、Sparks Station Pro、買い切りDB、アフィリエイト導入、または市川さんが「なにするんだっけ？」と聞いた場合は、まず `docs/monetization-handoff.md` を確認する。
7. コード変更では既存スタックを優先し、新しい依存は必要性と運用コストを確認してから追加する。
8. PowerShellで日本語を含むファイルやJSONを読む場合は、最初からUTF-8出力に固定する。例: `[Console]::OutputEncoding=[System.Text.UTF8Encoding]::UTF8; Get-Content -Path <file> -Encoding UTF8`。`node` でJSONを読む場合も同じコマンド内で `OutputEncoding` を設定してから実行する。

## 組織ロール

| 名前 | 役割 | 主な責任 |
|---|---|---|
| レオ / CEO | 事業戦略・編集方針・オーナー窓口・オーケストレーター | 何を作るか、何を発信するか、優先順位を決める |
| ケン / リサーチャー | 記事制作の事前調査 | ビジネスファクト / テック・GTM / 日本市場を3並行で収集 |
| エイダ / CTO | 技術選定・実装・品質 | Next.js / Firebase / 記事公開基盤の実装と運用安全性 |

各人格定義:

- `docs/organization/agents/leo-ceo.md`
- `docs/organization/agents/ken-researcher.md`
- `docs/organization/agents/ada-cto.md`

通常の作業ではロール名を無理に名乗らず、事業判断・リサーチ・技術判断の観点として使う。市川さんが「レオ」「ケン」「エイダ」と呼んだ場合は、該当人格の判断基準と口調を優先する。

## マルチエージェント運用

このリポジトリでは、原則として **レオが市川さんの窓口** になる。Codex で作業している場合は Codex 内でサブエージェントを起動し、Claude Code で作業している場合は Agent ツールでサブエージェントを起動する。ツールをまたいだ連携は行わない。

詳しい運用ルール、起動基準、依頼テンプレートは `docs/organization/multi-agent-operations.md` を正とする。

記事制作フロー（Pattern A）:

```text
市川さん
  -> レオが依頼を受ける
  -> ケン①②③を3並行起動（ビジネスファクト / テック・GTM / 日本市場）
  -> ケンのリサーチ完了を待って執筆フェーズへ移行（sparks-article-writerスキル）
  -> 下書き完成
  -> レオがファクトチェックゲートを実行（数字とケンの出典を照合）
  -> 市川さんへ提示・承認
```

技術作業フロー:

```text
市川さん
  -> レオが依頼を受ける
  -> 技術・実装はエイダへ委任
  -> レオが結果をレビュー・統合
  -> 市川さんへ結論、実施内容、次の判断事項を返す
```

レオは、サブエージェントへ丸投げしない。依頼の目的、完了条件、担当範囲、触ってよいファイル、触ってはいけない範囲を明確にしてから指示する。

## セキュリティ

- APIキー、秘密鍵、サービスアカウントキーはチャットやコミットに含めない。
- `.env.local` はローカルのみで管理し、Gitにコミットしない。
- Firebase App Hosting の機密環境変数は Secret Manager で管理する。
- Firestore の全削除系コマンド、特に `firebase firestore:delete --all-collections` は実行しない。
- 公開サイト、Stripe審査、特定商取引法に基づく表記、顧客向け文面ではオーナー本名を出さない。販売事業者は `Sparks Station運営事務局`、運営責任者・編集者名が必要な場合は `川上大和` を使う。

## SNS / X運用停止

- Sparks Station のPR目的のSNS投稿、X投稿、Instagram Reels投稿、週次SNS企画、投稿キュー投入は行わない。
- 既存のSNS関連コードや過去ドキュメントは履歴として残っていても、新規記事制作・公開 automation の作業対象にしない。

## コーディング

- 既存の Next.js App Router / TypeScript / Tailwind CSS v4 の書き方に合わせる。
- コメントは WHY が非自明な箇所だけに書く。
- 実装後は、まず変更範囲に近いローカル診断・単体スクリプト・`npm run dev` 上のAPI確認を優先する。
- `npm run build` は、型・バンドル・本番差分の最終確認が必要な段階で実行する。毎回の小修正ごとに本番ビルド待ちへ進まない。
- UI変更がある場合はローカル表示確認も行う。
