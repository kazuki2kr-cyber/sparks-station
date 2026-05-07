# Sparks Station — SNS運用方針

## 目的

Sparks Station を、AIでプロダクトを作れるようになった一方で「どう売るか」「誰がお金を払うか」に悩む日本語圏の開発者に届ける。

フォロワー数そのものより、保存・シェア・プロフィール遷移・記事閲覧・プロダクト利用への導線を重視する。

## コンテンツ方針

- 海外Micro-SaaSの成功・失敗・売却事例を短く分析する。
- 「なぜ伸びたか」「どう作ったか」に加えて、「どう課金したか」「最初の顧客をどう獲得したか」「価格をどう上げたか」まで入れる。
- サービス告知より、有益な分析コンテンツを優先する。
- 保存される「チェックリスト」「ロードマップ」「比較」「手順書」を多めにする。
- 画像内テキストでは丸数字などフォント依存文字を使わない。`1.` `2.` `3.` を使う。

## 編集テーマ

- AIで開発コストが下がった後に残る、販売・課金・継続利用の壁を扱う。
- 「作れるのに売れない」状態を突破した事例を集める。
- 価格設計、GTM、初期顧客獲得、ニッチ選定、サービス化、買収・売却、失敗理由を優先する。
- AI SaaS、Micro-SaaS、個人開発、業務代行+ソフトウェア、買収型ポートフォリオを横断して見る。
- 日本の開発者が翌日から試せる仮説、DM文、価格表、検証手順まで落とす。

## 投稿フォーマット

| 形式 | 使いどころ |
|---|---|
| Instagram Reels | フックの強い事例紹介、マネタイズ転換点のスライドショー型まとめ |
| Threadsスレッド | 事例の背景、価格設計、GTM、検証手順を連続投稿で読ませる |

Instagramはすべてリールに統一する。静止画・カルーセルは使わない。

ThreadsはInstagramの本文流用ではなく、別設計のスレッド投稿にする。標準は7〜9投稿。1投稿目で結論、2〜6投稿目で分解、最後に記事遷移・保存・返信募集のどれか1つだけを置く。

リールは動画プロンプトから直接生成しない。キューに含めた `instagram.slides[].imagePrompt` を使って各スライド画像を生成し、その画像に `overlayText` を合成してから、ffmpegでスライドショー形式のMP4に変換する。

## 投稿比率

- 50%: 海外事例から見るマネタイズ突破パターン
- 25%: AI時代のGTM、価格設計、初期顧客獲得
- 15%: 失敗事例と「売れなかった理由」
- 10%: Sparks Stationの記事・プロダクト導線

## 週次運用

投稿は毎日その場で自動生成しない。週1回、レオがテーマと優先順位を決め、ルカがInstagram ReelsとThreadsスレッドを1週間分まとめて作成し、レビュー後にFirestore `postsQueue` へ投入する。

投稿案生成はCodexとの対面作業で行う。APIは投稿案を生成しない。APIが行うのは、Firestoreキューの取得、`instagram.slides[].imagePrompt` に基づくリール用画像生成、画像へのテキスト合成、MP4化、Instagram/Threads投稿のみ。

基本フロー:

1. レオが今週のテーマを決める。
2. ルカが7日分の投稿案を作る。
3. レオが事例、数字、出典、CTAを確認する。
4. `scripts/seed-sparks-sns-posts.mjs` にレビュー済み投稿とリール用画像プロンプトを反映する。
5. `node scripts/seed-sparks-sns-posts.mjs` でSparks StationのFirestoreへ投入する。
6. `node scripts/check-sns-queue.mjs` で `pending` 件数と投稿順を確認する。

週次作成時の目安:

| 曜日 | テーマ | 目的 |
|---|---|---|
| 月 | 成功事例のマネタイズ分解 | 保存・プロフィール遷移 |
| 火 | 価格設計 / 値上げ | 保存・シェア |
| 水 | 初期顧客獲得 / GTM | 返信・記事遷移 |
| 木 | 失敗事例 / 売れなかった理由 | 信頼形成・保存 |
| 金 | 買収 / 売却 / B2B化 | 高単価テーマの反応確認 |
| 土 | 実践チェックリスト | 保存・再訪 |
| 日 | 週次まとめ / 記事導線 | 記事閲覧・次週への接続 |

キュー投入は `scheduledAt` を持たせ、Cronは `scheduledAt <= now` かつ `status == "pending"` の投稿を処理する形に拡張するのが理想。初期実装では `order` 昇順で処理し、週次投入時に投稿順を管理する。

## 投稿テンプレート

### Instagram Reels

| テンプレート | フック | 尺/枚数 | 構成 | CTA | 向いている事例 |
|---|---|---:|---|---|---|
| 売れた理由3点 | 「月$12kのAI SaaS、勝因は機能ではなく課金理由」 | 16〜24秒 / 4〜6枚 | 数字と結論 / 誰の課題か / なぜ払うか / 集客経路 / 日本で試すなら / 保存CTA | 価格設計を保存 | MRR、ARR、売却額、価格が明確なMicro-SaaS |
| 作れるのに売れない壁 | 「AIで作れる人は増えた。でも売れる人は増えていない」 | 15〜20秒 / 4〜5枚 | 問題提起 / 開発コスト低下 / マネタイズ難化 / 突破施策 / 明日試す検証 | 検証リストとして保存 | AI時代のGTM、個人開発、B2B SaaS |
| 価格の上げ方分解 | 「$9から$49へ。値上げできた理由はここ」 | 18〜24秒 / 5〜6枚 | 価格変化 / 安い時の顧客 / 高く払う顧客 / 追加した価値 / 消した機能 / 日本版仮説 | 料金表づくりに保存 | 値上げ、プラン設計、B2B化、ニッチ特化 |
| 失敗から学ぶ診断 | 「このSaaSが伸びなかった理由、たぶんここ」 | 12〜18秒 / 4枚 | 失敗の結論 / 顧客が曖昧 / 課金理由が弱い / 回避策 | 作る前に保存 | 撤退事例、売れなかった個人開発、Product Hunt後に失速した事例 |
| 買収/売却の読み解き | 「この小さなSaaSが買われた本当の理由」 | 20〜28秒 / 5〜6枚 | 売却/買収額 / 買い手の狙い / 顧客資産 / 技術資産 / 再現できる要素 / 記事CTA | 買収目線で保存 | ニッチSaaS売却、買収型ポートフォリオ |

画像内テキストは1枚あたり最大2行、1行12〜14字を目安にする。必ず「$49」「月$12k」「3つ」「7日」「B2B」「解約率」など、数字・価格・課金理由を残す。

### Threadsスレッド

| テンプレート | 1投稿目 | 2投稿目以降 | CTA | 向いている事例 |
|---|---|---|---|---|
| 事例分解スレッド | 「AI SaaSで月$12kまで伸びた事例。面白いのは機能ではなく“誰が払ったか”です。」 | 何を作ったか / 誰が払ったか / なぜ今必要か / 価格設計 / 集客経路 / 日本での転用案 / 記事リンク | 詳しい数字と出典は記事へ | 成功事例、収益公開、海外Micro-SaaS |
| 仮説検証スレッド | 「作る前に、この3つを検証した方がいいです。」 | 顧客の痛み / 代替手段 / 支払い理由 / 最小検証方法 / NGサイン / 次の一手 | 検証テンプレとして保存 | MVP、GTM、個人開発者向け |
| 価格設計スレッド | 「価格を決める時、“安ければ売れる”はだいたい罠です。」 | 安い価格の弊害 / 払う顧客の条件 / プランの分け方 / 値上げのタイミング / 事例 / 自分ならこう試す | 料金表を作る前に読み返す | 課金、値上げ、B2Bプラン、サブスク |
| 失敗解剖スレッド | 「このプロダクト、作りは良いのに売れなかった。理由はかなり学びがあります。」 | 何が良かったか / 売れなかった理由 / 顧客不在 / チャネル不一致 / 回避策 / 日本の開発者への教訓 | 失敗事例も追うのでフォロー | 撤退、失速、Product Hunt後の失敗 |
| 市場選定スレッド | 「AIで作れる時代ほど、“何を作らないか”が大事です。」 | 伸びる市場の条件 / 避けたい市場 / 支払い能力 / 頻度と深刻度 / 事例 / チェックリスト | 市場選定メモとして保存 | 新規テーマ探索、ニッチ選定、記事導線 |

## Firestoreキュー

コレクション名: `postsQueue`

```json
{
  "platforms": ["instagram", "threads"],
  "contentTheme": "pricing",
  "caseName": "Example SaaS",
  "sourceUrl": "https://...",
  "articleUrl": "https://sparks-station.com/...",
  "type": "reel",
  "order": 1,
  "status": "pending",
  "scheduledAt": "timestamp",
  "instagram": {
    "type": "reel",
    "templateId": "reel_pricing_breakdown",
    "hookText": "月$12kの理由",
    "caption": "Instagram本文",
    "slides": [
      {
        "role": "hook",
        "imagePrompt": "English image prompt for the generated reel slide image, vertical 9:16, no text, no letters",
        "overlayText": "月$12k\n課金理由は1つ"
      }
    ],
    "ctaType": "save",
    "targetKpi": "saves"
  },
  "threads": {
    "templateId": "thread_case_breakdown",
    "posts": [
      "1投稿目の本文",
      "2投稿目の本文",
      "3投稿目の本文"
    ],
    "ctaType": "article_click",
    "targetKpi": "link_clicks"
  },
  "tracking": {
    "utmCampaign": "sns_2026_w01",
    "experimentId": "hook_price_001"
  },
  "result": {
    "instagramPostId": null,
    "threadsRootId": null,
    "threadsPostIds": [],
    "postedAt": null
  },
  "createdAt": "server/client timestamp"
}
```

`instagram.slides[].imagePrompt` は必須。ここにリール用画像の生成プロンプトを入れる。プロンプトは英語で書き、`vertical 9:16`, `no text`, `no letters` を含める。文字情報は画像生成に含めず、`overlayText` として後から合成する。

## 自動投稿API

- Route: `POST /api/instagram/post`
- Cron 実行時: `x-cron-secret` ヘッダーに `CRON_SECRET` を渡す。
- 手動投稿時: Firebase Admin 権限の ID token を `Authorization: Bearer <token>` で渡す。

必要な環境変数:

```text
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
ADMIN_UIDS=
GEMINI_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
INSTAGRAM_BUSINESS_ACCOUNT_ID=
INSTAGRAM_ACCESS_TOKEN=
THREADS_USER_ID=
THREADS_ACCESS_TOKEN=
CRON_SECRET=
REEL_BGM_URL=
```
