# Sparks Station — マネタイズ方針

## 基本方針

Sparks Station は、海外SaaSの成功パターンを日本の個人開発者・小規模事業者が使える形に翻訳する場所として収益化する。

AdSense は床収益として残すが、記事の主導線にはしない。主導線は以下に置く。

- 記事ごとの推奨ツール
- Sparks Station Pro
- 買い切りテンプレート・事例データベース
- ニュースレター登録
- スポンサー・タイアップ

## アフィリエイト導入候補

### 一括で探しやすいネットワーク

| サービス | 位置づけ | Sparks Station との相性 |
|---|---|---|
| PartnerStack | B2B SaaS系の提携プログラムが多い | 最優先。SaaS、開発、マーケツールとの相性が高い |
| impact.com | 大手ブランド・SaaS・パートナー施策 | 中〜大手ツールの案件探しに使う |
| Awin | グローバル affiliate network | SaaS以外も含めた補完枠 |
| Rewardful / FirstPromoter | SaaS各社の直運用 affiliate で使われがち | 個別ツール申請時に遭遇しやすい |

### 優先ツール候補

| ツール | 用途 | 状態メモ |
|---|---|---|
| beehiiv | ニュースレター、メディア収益化 | 公式パートナーページあり。最大60%/12か月の継続報酬表記あり |
| Webflow | SaaS LP、検証用サイト | 公式ヘルプで50% commission on first paid plan と説明 |
| Framer | LP、テンプレ、AIサイト制作 | 公式 affiliate terms / Creator Program 系の導線あり |
| Make | 業務自動化、AIワークフロー | 公式 affiliate ページあり。継続報酬型 |
| Lovable | AIアプリ生成、vibe coding | 公式ページでは新プログラム準備中。メール登録・申請待ち候補 |
| Cursor | AI coding | 公式以外のディレクトリ情報はあるが、直接確認が必要。優先度は高いが慎重に扱う |
| Notion | テンプレ、ナレッジ管理 | 公式ページでは新規受付停止の表記あり。再開待ち |

## 実装方針

記事下に「この事例を日本で試すなら」という推奨ツール枠を置く。初期状態では通常URLを使い、承認済みアフィリエイトURLは環境変数で差し替える。

想定環境変数:

```text
AFFILIATE_BEEHIIV_URL=
AFFILIATE_WEBFLOW_URL=
AFFILIATE_FRAMER_URL=
AFFILIATE_MAKE_URL=
AFFILIATE_LOVABLE_URL=
AFFILIATE_CURSOR_URL=
```

アフィリエイトリンクを入れる場合は、記事・ページ上に広告/提携リンクであることが分かる表記を残す。

## 参照先

- PartnerStack: https://partnerstack.com/
- PartnerStack Marketplace help: https://support.partnerstack.com/hc/en-us/articles/360009185034-What-is-the-marketplace-
- impact.com: https://impact.com/
- Awin: https://www.awin.com/
- beehiiv Partner Program: https://www.beehiiv.com/partners/affiliate
- Webflow Affiliate Program overview: https://help.webflow.com/hc/en-us/articles/33961372613011
- Framer Affiliate terms: https://www.framer.com/legal/affiliates-terms-and-conditions/
- Make Affiliate: https://www.make.com/en/affiliate
- Lovable Affiliate: https://lovable.dev/affiliates
- Notion Affiliates: https://www.notion.com/affiliates
