# SNS自動投稿API 流用確認

## 結論

Mixia由来と思われる自動投稿APIは、Sparks Station向けにかなり流用可能です。ただし運用方針変更により、Instagramはリールのみ、ThreadsはInstagramとは別設計のスレッド投稿として扱います。

## 既に使えること

- Firestore `postsQueue` から `status == "pending"` の投稿を `order` 昇順で1件取り出す。
- 投稿中は `processing`、成功時は `posted`、失敗時は `failed` に更新する。
- Instagramは `reel` のみ投稿する。
- Threadsは `threads.posts[]` / `threadPosts[]` を順番に投稿し、2投稿目以降を前投稿への返信としてスレッド化する。
- Firestoreキューに入っているリール用画像プロンプトをもとに、Imagen 4で各スライド画像を生成する。
- sharpで画像にSparks Stationのテキストとブランド名を合成する。
- 生成した複数画像をffmpegでスライドショーMP4へ変換し、Instagram Reelsとして投稿する。
- Cloudinaryに画像・動画をアップロードし、Meta APIからInstagramへ投稿する。
- Threads投稿はInstagramリールの画像や本文を流用せず、テキストスレッドとして別投稿する。
- 手動投稿はFirebase Admin権限、Cron投稿は `CRON_SECRET` で認証する。

## 必要な環境変数

```text
NEXT_PUBLIC_FIREBASE_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
ADMIN_UIDS
GEMINI_API_KEY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
INSTAGRAM_BUSINESS_ACCOUNT_ID
INSTAGRAM_ACCESS_TOKEN
THREADS_USER_ID
THREADS_ACCESS_TOKEN
CRON_SECRET
REEL_BGM_URL
```

## Mixia `.env.local` の流用可否

`C:\Users\ichikawa\Desktop\mixia\.env.local` には以下のSNS関連キーが存在します。

- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_BUSINESS_ACCOUNT_ID`
- `INSTAGRAM_APP_ID`
- `INSTAGRAM_APP_SECRET`
- `META_APP_SECRET`
- `THREADS_USER_ID`

一方で、`THREADS_ACCESS_TOKEN` は見当たりませんでした。現在の実装では `THREADS_ACCESS_TOKEN` があればそれを使い、なければ `INSTAGRAM_ACCESS_TOKEN` をフォールバックで試します。ただしMeta側の権限・トークン種別によってはThreads投稿に失敗する可能性があるため、本番ではThreads用アクセストークンを明示的にSecret Managerへ登録するのが安全です。

Firebase Admin系の値はMixiaのものを流用しません。FirestoreキューはSparks Stationのプロジェクトにある `postsQueue` を正とします。Mixia側のFirebaseプロジェクトを使うと、キューや権限が混線するため避けます。

## 運用開始前の確認事項

- Meta側でInstagram Business AccountとThreadsアカウントの投稿権限が有効か確認する。
- `INSTAGRAM_ACCESS_TOKEN` と `THREADS_ACCESS_TOKEN` の期限、更新方法、権限スコープを確認する。
- Cloudinaryの無料枠、動画アップロード容量、配信URLの安定性を確認する。
- Cloud SchedulerまたはVercel Cronから `POST /api/instagram/post` に `x-cron-secret` を付けて呼び出す。
- `scripts/seed-sparks-sns-posts.mjs` はSparks StationのFirestoreへレビュー済み投稿を投入するスクリプト。本番投入前に投稿内容をレビューする。
- `scripts/check-sns-queue.mjs` でキュー件数と `status` を確認してからCronを有効化する。

## 改善したい点

- Instagram/Threads APIの失敗レスポンスを保存し、後で原因を見やすくする。
- キューに `sourceUrl`, `caseName`, `contentTheme`, `instagram.templateId`, `threads.templateId`, `tracking.experimentId` を追加し、投稿品質を安定させる。
- 空キュー時のGemini生成は便利だが、事実確認なしの投稿になりやすい。初期運用ではキュー投入型を主にする。
- Threads APIの返信連投は、投稿間に短い待機を入れて順番に公開する。途中失敗時の再開処理は今後改善する。
- APIバージョン `graph.instagram.com/v21.0` はMeta側の期限に合わせて定期確認する。

## 推奨運用

毎日その場で完全自動生成するのではなく、週1回ルカと1週間分の投稿を作成し、レビュー済み投稿だけを `postsQueue` へ投入する。投稿案生成はCodexとの対面作業で行い、APIでは行わない。APIは画像生成と投稿処理に集中する。
