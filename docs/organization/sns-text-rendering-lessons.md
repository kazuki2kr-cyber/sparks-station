# SNSリール文字合成の文字化け対策メモ

## 結論

Sparks StationのInstagram Reelsでは、リール画像の文字合成を `@vercel/og` の `ImageResponse` でPNGオーバーレイ化し、そのPNGを `sharp` で元画像に合成する方式が安定しました。

最終的に効いたポイントは以下です。

- 日本語表示には `public/fonts/noto-sans-jp-japanese-700-normal.woff` を使う。
- `NotoSansJP-Bold.ttf` は使わない。環境によって読めず、豆腐文字やフォント登録失敗の原因になる。
- `@napi-rs/canvas` の `registerFont` に依存しない。
- App Hosting本番では `@vercel/og` を静的importせず、`@vercel/og/dist/index.node.js` を動的importする。
- 本番投稿前に `npm run sns:diagnose-overlay` でローカルPNGを確認する。

## ダメだったこと

### 1. そのままCanvasで描画する

Mixiaでは `@napi-rs/canvas` と `registerFont` で最終的に動いていましたが、Sparks StationのFirebase App Hostingではフォント登録とnative module解決が不安定でした。

発生した問題:

- `Cannot find module '@napi-rs/canvas'`
- フォントパスが本番standalone環境で見つからない
- `registerFont` が `null` を返す
- ローカルとApp Hostingでフォント探索パスがずれる

結論として、App Hosting上でCanvasのnative dependencyとフォント登録を安定させるより、Canvas依存を外す方が安全でした。

### 2. `NotoSansJP-Bold.ttf` を使う

`NotoSansJP-Bold.ttf` は、Mixia時代から丸数字や矢印に弱いことが分かっていました。さらに、`@vercel/og` ではOpenTypeとして読めないケースがありました。

発生した問題:

- `Unsupported OpenType signature`
- `①` や `⇒` などが豆腐文字になる
- 日本語の一部が表示されず `□` になる

対策として、画像内テキストでは以下を禁止または置換します。

- `①②③` などの丸数字は `1.` `2.` `3.` にする
- `⇒` `→` は `->` にする
- 装飾的な記号は避ける

### 3. `@vercel/og` を静的importする

`import { ImageResponse } from "@vercel/og"` だと、Next.js/App Hostingのstandalone出力で `next/dist/compiled/@vercel/og` 側を参照し、本番で内部ファイルが見つからないことがありました。

発生した問題:

- `Cannot find module '/workspace/.next/standalone/node_modules/next/dist/compiled/@vercel/og/index.node.js'`
- `Cannot find package '/workspace/.next/standalone/node_modules/@vercel/og/index.js'`

最終的には、`new Function("specifier", "return import(specifier)")` 経由で `@vercel/og/dist/index.node.js` を直接動的importする形にしました。

## うまくいったこと

### 1. ローカル診断スクリプトを先に作る

`npm run sns:diagnose-overlay` で、実際のリールサイズに近いPNGを生成できるようにしました。

これにより、本番ビルドやInstagram投稿を待たずに以下を確認できます。

- 日本語が豆腐文字にならないか
- フォントサイズが大きすぎないか
- 黒帯なしで読めるか
- ブランド表記が見切れないか

生成先:

```text
tmp/sparks-reel-overlay-diagnostic.png
```

### 2. WOFFフォントを使う

`public/fonts/noto-sans-jp-japanese-700-normal.woff` は `@vercel/og` で正常に読め、実際のInstagram投稿でも日本語が崩れませんでした。

### 3. 文字合成をPNGオーバーレイに分離する

直接JPEGへ描くのではなく、透明背景のPNGオーバーレイを作り、それを `sharp` で合成しています。

この分離により、画像生成、文字描画、動画化の責務が分かれ、原因切り分けがしやすくなりました。

## 現在の推奨フロー

1. 投稿文・画像内テキストから禁止文字を除く。
2. `npm run sns:diagnose-overlay` でローカルPNGを確認する。
3. 必要な場合だけ `npm run build` を通す。
4. App Hostingへロールアウトする。
5. 本番APIの `{"diagnostic":"font"}` を叩く。
6. 成功後にキューを投稿する。

## 表示位置の方針

初回投稿では、メイン文字がやや上寄り、`SPARKS STATION` がスマホUIで見切れ気味でした。

次回以降は以下に調整します。

- メイン文字: 縦位置を少し中央寄りにする。
- ブランド名: 下端から少し上に逃がす。
- 黒い透かし帯は使わない。
- 写真の主役を完全に隠さないよう、文字は2行まで、長い場合はフォントサイズを下げる。

## 他プロジェクトへ持ち込む時の注意

- App Hosting / Cloud Run / Vercel / ローカルでフォント解決は変わる。
- native canvas系は、ホスティング環境ごとに壊れやすい。
- 画像内日本語は、必ず実画像で確認する。
- フォントファイルは `.ttf` より `.woff` / `.woff2` の方がWeb系レンダラーで扱いやすいことがある。
- 本番投稿前に、投稿しない診断エンドポイントを用意しておく。
