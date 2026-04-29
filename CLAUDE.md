# CLAUDE.md — Sparks Station

## プロジェクト概要

**Sparks Station** は、海外Micro-SaaS開発・売却事例を日本語で分析・配信するメディア＆プロダクトスタジオです。  
ターゲット：日本のエンジニア・技術系スタートアップ創業者。

- **ドメイン**: sparks-station.com
- **スタック**: Next.js (App Router) + TypeScript + Tailwind CSS v4 + Firebase + Vercel
- **コンテンツ**: `/src/content/posts/` に Markdown ファイルで管理
- **サブプロダクト**: Fantasy Quizzes Kingdom（リアルタイム多人数クイズゲーム）

---

## コンテンツ構成（記事）

### ファイル配置
- **場所**: `src/content/posts/YYYYMMDD.md`
- **命名規則**: `YYYYMMDD.md`（同日2本目は `YYYYMMDD_2.md`）
- **画像**: `public/images/YYYYMMDD.webp`（任意）

### Frontmatter スキーマ
```yaml
---
title: "（記事タイトル）"
date: "YYYY-MM-DD"
tags: ["SuccessCase", "SaaS", "Bootstrapped", "Strategy"]
summary: "（200字程度の要約）"
mrr: "約 xxx万円"          # 任意
exit_price: "推定 xxx億円"  # 任意
isPremium: false            # 任意
image: "/images/YYYYMMDD.webp"  # 任意
---
```

### 利用可能タグ
- **カテゴリ**: `SuccessCase`, `FailureCase`, `Thought`, `Concept`
- **テーマ**: `SaaS`, `AI`, `LLM`, `Strategy`, `GTM`, `Exit`, `Bootstrapped`, `BuildInPublic`, `Monetization`, `NarrativeEngineering`

### 記事の4セクション構成（必須）
```
## ① 【サマリー】30秒でわかる今回の案件
## ② 【Fact】サービスの詳細とTech Stack
## ③ 【Insight】なぜこの戦略は機能するのか？
## ④ 【Localize】日本市場への転用・アイデア
```

---

## 記事カテゴリ分類ロジック

`src/lib/classifier.ts` が1番目のタグで振り分け:
- `SuccessCase` → **成功事例 & テック** (emerald)
- `FailureCase` → **失敗事例** (rose)
- それ以外 → **哲学 & 思想** (purple)

---

## よく使うコマンド

```bash
npm run dev       # 開発サーバー起動 (localhost:3000)
npm run build     # 本番ビルド
npm run lint      # ESLint チェック
```

---

## プロジェクトスキル（カスタムスラッシュコマンド）

| コマンド | 用途 |
|---|---|
| `/new-article` | 新記事の下書き生成（海外事例を指定してワンショット生成） |

---

## コーディングルール

- コメントは **WHYが非自明な場合のみ** 記載する（何をしているかの説明は不要）
- 新規ファイルより既存ファイルの編集を優先する
- フロントエンドの変更は `npm run dev` で動作確認してから報告する
- セキュリティ：XSS / SQLインジェクション等 OWASP Top 10 に注意する
- Firebase のクライアントキーはブラウザ公開前提のため、コード内に含まれていても問題ない

## コンテンツ作業ルール

- 新記事は `src/content/posts/YYYYMMDD.md` に作成する
- 4セクション構成（サマリー・Fact・Insight・Localize）を必ず守る
- 事実・数字はソースに基づき記載する（AI による捏造は禁止）
- 画像が不要な場合は `image` フィールドを省略する

---

## Fantasy Quizzes Kingdom（サブプロダクト）

- **ルーティング**: `/FantasyQuizzesKingdom/`
- **アーキテクチャ**: Firestore（永続データ）+ Realtime Database（対戦中のリアルタイム状態）
- **最適化計画**: `docs/fantasy-quizzes-kingdom-firestore-optimization-plan.md` を参照

---

## 外部サービス

| サービス | 用途 |
|---|---|
| Firebase (`hayaoshi-aef9c`) | Auth / Firestore / Realtime DB / Storage |
| Vercel | ホスティング / デプロイ |
| Google Analytics (`G-4V4BG1669S`) | アクセス解析 |
| Google AdSense (`ca-pub-3577742758028719`) | 広告収益 |
