---
name: sparks-article-writer
description: Use when writing, editing, publishing, or preparing a Sparks Station article from a source URL, SaaS case, acquisition or failure story, AI product or model update, developer tool update, or advanced technology concept. Covers research, fact checking, Markdown creation, SaaS Case DB updates, deterministic validation, automatic git push, deployment verification, and indexing handoff.
---

# Sparks Article Writer

Use this skill for Sparks Station article work. Write in Japanese unless the user asks otherwise.

## Core Positioning

Sparks Station serves Japanese solo developers, engineers, and technical founders who want practical lessons from overseas Micro-SaaS, AI SaaS, exits, failures, AI updates, and advanced technology concepts.

The article must not be a shallow summary. It should help the reader understand:

- why this worked or failed
- who paid and why
- how it acquired users
- what changed in AI or product tooling
- what can be localized to Japan
- what the reader can try next

## Workflow

1. Read the source URL, pasted text, attachment, or user brief.
2. Classify the article:
   - Pattern A: SaaS, Micro-SaaS, overseas business success/failure, acquisition, monetization, GTM.
   - Pattern B: advanced technology, concept, product philosophy, engineering paradigm.
   - Pattern C: AI update, model release, developer tool update, agent or product workflow update.
3. **[Pattern A] Ken parallel research phase** — Before writing, launch 3 concurrent research agents (Ken). Each agent covers one domain and returns only confirmed facts with source URLs. "未確認" for anything unverifiable.
   - **Ken-A (ビジネスファクト)**: MRR, ARR, exit price, user count, team size, funding, pricing tiers.
   - **Ken-B (テック・GTM)**: tech stack, first acquisition channel (Product Hunt / Reddit / SEO / X), competitive landscape, GTM trigger.
   - **Ken-C (日本市場)**: Japanese analogues, barriers (regulation / culture / language), minimum localization experiment.
   - In **Codex**: send all three as parallel subagent sessions simultaneously.
   - In **Claude Code**: call Agent tool three times in parallel (run_in_background: true for Ken-A and Ken-B while Ken-C also runs); collect all three results before proceeding.
   - Wait for all three agents to complete before moving to step 4.
   - **[Pattern B]** Skip Ken research. Browse for conceptual context, technical background, and implementation examples directly.
   - **[Pattern C]** Prefer official announcements, docs, release notes, pricing pages, model cards, and changelogs. Use Ken research only when the article includes a concrete SaaS case or business metrics.
4. Decide a slug:
   - English lowercase words and hyphens only.
   - Include service/concept and topic keyword.
   - Avoid Japanese, underscores, and generic slugs.
   - Check `src/content/posts` for duplicates.
5. For Pattern A, save the three Ken reports and the numeric fact-check table under `docs/research/articles/[slug].md`.
6. Draft the article as Markdown under `src/content/posts/[slug].md`.
7. For Pattern A, add or update the matching row in `data/monetization/saas-case-database.seed.json`. For Pattern C, do not add a row unless it is also a concrete SaaS case.
8. Run `npm run articles:validate -- --article=[slug]`, then `npm run articles:analyze`, then `npm run build`. Stop on any failure.
8b. **[Pattern A] Fact-check gate** — Before presenting the draft to the user, cross-check all numbers in the article body against Ken's research output:
   - Numbers confirmed by Ken with a source URL → keep as stated.
   - Numbers Ken marked as 未確認 → add 「推定」or「約」, or remove entirely.
   - Numbers not present in Ken's output at all → treat as unverified; apply same rule as above.
   - Do not pass any number as a stated fact unless Ken recorded a source URL for it.
   - Pattern B articles skip this gate.
9. Confirm the branch is `main`, fetch `origin`, and stop if `HEAD` is not based on the current `origin/main` or unrelated tracked changes overlap the allowed files.
10. Stage only the article, Pattern A research note, matching DB row, and generated article insight file. Run `npm run articles:publish-scope -- --article=[slug] --staged` and stop on failure.
11. Commit the staged files and push `main` automatically without waiting for user approval.
12. Identify the Firebase App Hosting rollout for the pushed commit SHA, wait for a successful rollout with a timeout, then verify the public article URL returns HTTP 200 and contains the expected title. Also confirm the URL appears in the sitemap. Report push success separately from deployment success.
13. Do not perform Search Console indexing directly unless a dedicated authorized integration is available; report the URL requiring indexing.
14. Never read, generate, update, or invoke SNS/X/Instagram/Threads content, insight files, scripts, or Firestore queues during this workflow.

## Frontmatter

Use this shape:

```yaml
---
title: "記事タイトル"
date: "YYYY-MM-DD"
tags: ["CaseStudy", "AI", "SaaS", "GTM"]
summary: "180〜220字程度の概要"
mrr: "約 xxx万円"
exit_price: "推定 xxx億円"
image: "/images/[slug].webp"
---
```

Omit `mrr`, `exit_price`, or `image` if not actually used or confirmed.

Allowed tags only:

- Primary: `AIUpdate`, `CaseStudy`
- Domain: `AI`, `SaaS`, `MobileApp`, `DeepTech`
- Phase/tactic: `Strategy`, `GTM`, `Product`, `TechStack`, `Monetization`, `Bootstrapped`, `Exit`, `BuildInPublic`, `Failure`

Use up to 4 tags. `tags[0]` must be `AIUpdate` for Pattern C and `CaseStudy` for Pattern A or B.

## Pattern A Structure

For SaaS, business, exit, or failure cases:

```markdown
## 1. 【サマリー】30秒でわかる今回の案件
### サービス名 / ジャンル
### 売上 / MRR / Exit
### ここが凄い

## 2. 【Fact】サービスの詳細とTech Stack
### 機能
### 技術
### 運営体制

## 3. 【Insight】なぜ売れたのか？
### 集客のきっかけ
### タイミング
### Exitや収益化の背景

## 4. 【Localize】日本市場への転用・アイデア
### 日本の類似市場
### 障壁と対策
### 結論
```

For failures, change the framing from "ここが凄い" to "ここが学び".

## Pattern B Structure

For technology concepts or product philosophy:

```markdown
## 1. 【サマリー】30秒でわかる今回の概念
### キーワード
### 核心的な問い
### エンジニアへの影響

## 2. 【Concept】思想の正体と背景
### 定義
### 起源と文脈
### 本質

## 3. 【Engineering】プロダクトへの実装論
### 概念の実装
### コードとしての表現

## 4. 【Sparks】次世代のアイデア
### プロトタイプ案
### 未来予報
```

## Pattern C Structure

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

## Writing Rules

- Aim for roughly 5000 Japanese characters unless the user requests shorter.
- Use polite Japanese: です・ます調.
- Prefer concrete facts, numbers, names, user acquisition channels, pricing, and buyer logic.
- For Pattern C, use primary sources and distinguish confirmed availability, rollout timing, pricing, and regional restrictions from inference.
- Convert money to Japanese yen when useful. State assumptions when conversion is approximate.
- Avoid hollow metaphors, excessive quotation marks, and vague praise.
- Do not use `*` as emphasis or bullet marker in the article body.
- Avoid parenthetical escape hatches and over-cautious phrasing.
- Always land on "what a Japanese developer can try".

## Research Checklist

For Pattern A, look for:

- product, market, buyer, pricing
- MRR, ARR, revenue, users, sale price, funding, team size
- launch channel, first 100 users, Product Hunt, Reddit, SEO, direct sales, build in public
- tech stack and operational constraints
- why buyers/users cared enough to pay

For Pattern B, look for:

- origin, proposer, historical context
- technical implementation path
- product UX implications
- why this changes developer or founder behavior

Use direct citations and links in the final response when browsing informed the work.

## Validation

Before presenting work:

- Confirm the Markdown file path.
- Run a character count when an article file is created.
- For Pattern A, confirm the SaaS Case DB row and article insight output were updated.
- Run `npm run articles:validate -- --article=[slug]` before analysis.
- Run `npm run articles:analyze` after article/DB changes. This command must remain article-only.
- Run `npm run build` when article/frontmatter changes may affect routing.
- Mention if browsing or indexing could not be completed.
