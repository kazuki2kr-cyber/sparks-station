# DropInBlog Pattern A 調査記録

- 調査日: 2026-07-16
- 対象: DropInBlog
- 記事slug: `dropinblog-seven-figure-growth`
- 分類: Pattern A / Bootstrapped SaaS / CMS / SEO / GTM
- 採用理由: 既存記事・SaaS Case DBに重複がなく、長期運営、SEO依存による停滞、上位市場への移行、API・SDK・MCPによる製品拡張を一つの事例で扱えるため。

## ケンA：ビジネスファクト

- 2013年に着想・会社としてestablished、2015年に初版を公開。公式会社ページと創業者インタビューで確認。
- 2015年から2018年は低成長。2019年に本格的なトラクションを得た。
- 2019年から2021年に強く成長した後、年商7桁ドル付近で約4年停滞し、その後再成長。厳密な停滞開始月・終了月は未確認。
- Indie Hackersの2026年5月6日記事は月間売上を8.3万ドル超と掲載。ただし編集部メタデータであり、MRRとは記載されていない。
- 2026年5月時点で2,000件超のブログが50超のプラットフォームで稼働。2,000件は顧客社数ではない。
- 創業者はJesse Schoberg、Jason Mayfield、Laura Leeの3人。創業以来ブートストラップで、公式はself-funded、debt-free、privately owned、profitableと説明。
- 停滞打破時にマーケティングとカスタマーサクセスへフルタイム3人を採用。現在の正確な従業員数は未確認。
- 2026年7月16日確認の月払い価格はSolo 49ドル、Team 199ドル、Business 499ドル。年払い時月額は39ドル、159ドル、399ドル。Business Plusは月750ドル、年9,000ドル。
- 正確な現行MRR、ARR、利益率、解約率、顧客社数は未確認。

## ケンB：テック・GTM

- 既存サイトのページまたはフォルダへブログを組み込むヘッドレス型ブログCMS。基本はSEO対応JavaScript、強化方式はCloudflare静的化、SDK、API。
- Raw APIはJSON、Rendered APIはレイアウト済みHTMLを返す。OAuth 2、Private/Public key分離、標準レート制限は毎分60リクエスト。
- 公式SDKはLaravel、Astro、React、Next.js、TanStack Start、Expressを掲載。Next.js SDKはApp Router、Pages Router、SSR、Metadata APIに対応。
- MCPサーバーは投稿作成・更新・検索、FAQ、下書き、スニペット、カテゴリ、著者を扱う。
- 現行スタックはLaravel、Livewire、Flux UI、Tailwind、Laravel Cloud、Cloudflare、PlanetScale。2015年版はSymfony 1.4とBootstrap、2019年にLaravelへ移行。
- 初期獲得はSEOと制作会社経由の口コミ。2019年のノーコード普及を機に本格投資。
- 約4年の停滞は、SEOから得る新規売上と解約による減少が均衡したことが要因だと創業者が分析。
- 停滞打破は価格の見直しと新チャネル開拓。大企業訪問者が登録していないことを観測し、上位プラン、必要機能、ブランド、コピー、デモを整備。
- 上位価格帯によりポッドキャストスポンサーと直接営業を試した。Microsoft Clarityでオンボーディングを改善。
- チャネル別CAC、受注率、売上寄与、代理店施策の売上寄与は未確認。

## ケンC：日本市場

- microCMSは2026年5月20日に累計利用企業15,000社を公表。国内にもヘッドレスCMS需要がある。
- Kurocoは既存サイトへの部分導入を案内。PiyoCMSは既存HTMLへ記事機能を追加できるセルフホスト型で、買い切り4,980円。
- 国内代替に対するDropInBlog型の差別化余地は「ホスティング済み、ブログ機能一式、既存サイトへの短時間組み込み」。
- 価格障壁はSoloでも月49ドルであること。日本語管理画面、日本語サポート、円建て請求、適格請求書対応は未確認。
- 米国事業者、米ドル課金、ワイオミング準拠法、海外データ処理、Cloudflare/DNS設定は法人導入の確認項目。
- 最小実験は、制作会社または小規模B2B SaaS約5社へのヒアリング、日本語LP1枚、デモ5記事、JavaScript版と静的版のSEO比較。
- 初期判定は3社以上のデモ希望、1社以上の有料継続意思。これは市場事実ではなく検証仮説。

## 数値ファクトチェック表

| 記事内の数字 | 判定 | 条件・時点 | 出典 |
|---|---|---|---|
| 2013年 | 確認済み | 着想・established | https://dropinblog.com/company/ |
| 2015年 | 確認済み | 初版ローンチ | https://dropinblog.com/company/ |
| 最初の約4年 | 確認済み | 2015年公開から2019年のトラクションまで | https://www.indiehackers.com/post/shattering-the-7-figure-ceiling-after-a-4-year-plateau-OCmI5NQKKqyyCH0SqoiQ |
| 2019〜2021年 | 確認済み | 強い成長期間 | 同上 |
| 7桁ドル付近で約4年 | 確認済み | 創業者の停滞期間説明。正確な開始・終了月は未確認 | 同上 |
| 月間売上8.3万ドル超 | 条件付き確認 | Indie Hackers編集部の2026年5月掲載値。MRRではない | 同上 |
| 2,000件超 | 確認済み | 稼働ブログ数。顧客社数ではない | 同上 |
| 50超 | 確認済み | 対応・稼働プラットフォーム数 | 同上 |
| 創業者3人 | 確認済み | Jesse Schoberg、Jason Mayfield、Laura Lee | https://dropinblog.com/company/ |
| フルタイム3人 | 確認済み | 停滞打破時のマーケティング・CS採用数 | Indie Hackers記事 |
| Solo 49/39ドル | 確認済み | 月払い / 年払い時月額、2026-07-16 | https://dropinblog.com/pricing/ |
| Team 199/159ドル | 確認済み | 月払い / 年払い時月額、2026-07-16 | 同上 |
| Business 499/399ドル | 確認済み | 月払い / 年払い時月額、2026-07-16 | 同上 |
| Business Plus 750ドル / 年9,000ドル | 確認済み | 年払いのみ、2026-07-16 | 同上 |
| 7日間 | 確認済み | Solo・Teamの無料トライアル | 同上 |
| 毎分60リクエスト | 確認済み | API標準レート制限 | https://dev.dropinblog.com/reference/api-reference |
| microCMS 15,000社 | 確認済み | 2026-05-20公表の累計利用企業 | https://microcms.co.jp/news/20260520-01 |
| PiyoCMS 4,980円 | 確認済み | 公式掲載の税込買い切り価格 | https://piyocms.webcolor.jp/ |
| 5社、LP1枚、デモ5記事、3社、1社 | 仮説として使用可 | 日本市場の最小実験と合否基準。実績値ではない | ケンCの検証仮説 |

## 未確認として記事で断言しない項目

- 8.3万ドル超がMRRであること
- 正確な現行ARR、利益率、解約率、顧客社数、従業員数
- 代理店施策、直接営業、ポッドキャストスポンサー別の売上寄与
- 上位顧客の訪問数、商談数、受注率、CAC
- 日本語管理画面、日本語サポート、円建て請求、適格請求書対応

## 主要出典

- https://www.indiehackers.com/post/shattering-the-7-figure-ceiling-after-a-4-year-plateau-OCmI5NQKKqyyCH0SqoiQ
- https://dropinblog.com/company/
- https://dropinblog.com/pricing/
- https://dropinblog.com/features/
- https://dropinblog.com/agencies/
- https://docs.dropinblog.com/en/article/how-does-dropinblog-work-and-for-who-7ts1hq/
- https://dev.dropinblog.com/reference/api-reference
- https://dev.dropinblog.com/reference/mcp-server
- https://github.com/DropInBlog/react-nextjs
- https://microcms.co.jp/news/20260520-01
- https://microcms.io/pricing/
- https://kuroco.app/ja/
- https://piyocms.webcolor.jp/
- https://www.ppc.go.jp/personalinfo/legal/guidelines_offshore/
- https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering
