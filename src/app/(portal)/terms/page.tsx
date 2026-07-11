import { Metadata } from "next";
import { SITE_CONTACT_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "利用規約",
  description: "Sparks Stationが提供する記事、デジタル商品、関連サービスの利用条件です。",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12">
      <header className="space-y-4 border-b border-neutral-800 pb-8">
        <h1 className="text-3xl font-bold text-white md:text-4xl">利用規約</h1>
        <p className="text-neutral-400">最終更新日: 2026年5月8日</p>
      </header>

      <div className="prose prose-invert prose-emerald max-w-none text-neutral-300">
        <h2>1. はじめに</h2>
        <p>
          この利用規約は、Sparks Stationが提供するWebサイト、記事、デジタル商品、関連サービスの利用条件を定めるものです。利用者は本規約に同意したうえで本サービスを利用するものとします。
        </p>

        <h2>2. 提供内容</h2>
        <p>
          本サービスでは、海外SaaS、AI SaaS、個人開発、GTM、収益化に関する記事、データベース、テンプレート、その他のデジタルコンテンツを提供します。
        </p>

        <h2>3. 購入商品</h2>
        <p>
          有料商品は、各商品ページに表示された内容、価格、提供形式に従って提供されます。決済完了後、購入時に指定されたアカウントまたはメールアドレスに紐づけてアクセス権を付与します。
        </p>

        <h2>4. 禁止事項</h2>
        <ul>
          <li>法令または公序良俗に反する行為</li>
          <li>本サービスの運営、サーバー、ネットワークを妨害する行為</li>
          <li>不正アクセス、脆弱性の探索、権限のないデータ取得</li>
          <li>購入者専用コンテンツの無断転載、再配布、第三者への共有</li>
          <li>他者になりすます行為</li>
          <li>その他、運営者が不適切と判断する行為</li>
        </ul>

        <h2>5. 返品・キャンセル</h2>
        <p>
          デジタル商品の性質上、購入後のお客様都合による返品・キャンセルはお受けしていません。ただし、重複決済、アクセス不具合、商品説明と著しく異なる状態が確認された場合は、個別に対応します。
        </p>

        <h2>6. 免責事項</h2>
        <p>
          本サービスの情報は、できる限り正確性を保つよう努めますが、内容の完全性、正確性、最新性、有用性を保証するものではありません。本サービスの利用により生じた損害について、運営者は法令上認められる範囲で責任を負いません。
        </p>

        <h2>7. 規約の変更</h2>
        <p>
          運営者は、必要に応じて本規約を変更できるものとします。変更後の規約は、本サイト上に掲載した時点で効力を生じます。
        </p>

        <h2>8. 準拠法・管轄</h2>
        <p>
          本規約は日本法に準拠します。本サービスに関して紛争が生じた場合は、運営者の所在地を管轄する裁判所を専属的合意管轄とします。
        </p>

        <h2>9. お問い合わせ</h2>
        <p>
          本規約に関するお問い合わせは、問い合わせフォームまたは
          <a href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a>
          までお願いします。
        </p>
      </div>
    </div>
  );
}
