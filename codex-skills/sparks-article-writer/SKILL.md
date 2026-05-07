---
name: sparks-article-writer
description: Use when writing, editing, publishing, or preparing a Sparks Station article from a source URL, startup/SaaS case, overseas business example, acquisition story, failure case, or advanced technology concept. Covers research, slug/frontmatter, Markdown article creation, SNS copy, git push, and indexing workflow.
---

# Sparks Article Writer

Use this skill for Sparks Station article work. Write in Japanese unless the user asks otherwise.

## Core Positioning

Sparks Station serves Japanese solo developers, engineers, and technical founders who want practical lessons from overseas Micro-SaaS, AI SaaS, bootstrapped products, exits, failure cases, and advanced technology concepts.

The article must not be a shallow summary. It should help the reader understand:

- why this worked or failed
- who paid and why
- how it acquired users
- what can be localized to Japan
- what the reader can try next

## Workflow

1. Read the source URL, pasted text, attachment, or user brief.
2. Classify the article:
   - Pattern A: SaaS, Micro-SaaS, overseas business success/failure, acquisition, monetization, GTM.
   - Pattern B: advanced technology, concept, product philosophy, engineering paradigm.
3. Browse for current facts when the topic depends on recent information, external sources, or precise numbers.
4. Decide a slug:
   - English lowercase words and hyphens only.
   - Include service/concept and topic keyword.
   - Avoid Japanese, underscores, and generic slugs.
   - Check `src/content/posts` for duplicates.
5. Draft the article as Markdown under `src/content/posts/[slug].md`.
6. Verify frontmatter, tags, length, internal style, and build impact.
7. Produce X/SNS copy separately in the final response or a doc section.
8. After user approval, commit and push only the article-related files.
9. Wait for App Hosting deployment before any Search Console indexing step.

## Frontmatter

Use this shape:

```yaml
---
title: "記事タイトル"
date: "YYYY-MM-DD"
tags: ["SuccessCase", "AI", "SaaS", "GTM"]
summary: "180〜220字程度の概要"
mrr: "約 xxx万円"
exit_price: "推定 xxx億円"
image: "/images/[slug].webp"
---
```

Omit `mrr`, `exit_price`, or `image` if not actually used or confirmed.

Allowed tags only:

- Primary: `SuccessCase`, `FailureCase`, `Concept`
- Domain: `AI`, `SaaS`, `MobileApp`, `DeepTech`
- Phase/tactic: `Strategy`, `GTM`, `Product`, `TechStack`, `Monetization`, `Bootstrapped`, `Exit`, `BuildInPublic`

Use up to 4 tags. `tags[0]` must be one of `SuccessCase`, `FailureCase`, or `Concept`.

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

## Writing Rules

- Aim for roughly 5000 Japanese characters unless the user requests shorter.
- Use polite Japanese: です・ます調.
- Prefer concrete facts, numbers, names, user acquisition channels, pricing, and buyer logic.
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

## SNS Copy

Generate X copy after the article draft:

- Main post: 140 Japanese characters or less, no URL, strong first phrase, 2〜3 hashtags.
- Self-reply: short CTA with `https://sparks-station.com/posts/[slug]`.

Do not auto-post unless the user explicitly asks.

## Validation

Before presenting work:

- Confirm the Markdown file path.
- Run a character count when an article file is created.
- Run `npm run build` when article/frontmatter changes may affect routing.
- Mention if browsing or indexing could not be completed.

