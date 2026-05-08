import { Metadata } from "next";
import { SITE_CONTACT_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Sparks Station",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12">
      <header className="space-y-4 border-b border-neutral-800 pb-8">
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          プライバシーポリシー
        </h1>
        <p className="text-neutral-400">最終更新日: 2026年5月8日</p>
      </header>

      <div className="prose prose-invert prose-emerald max-w-none text-neutral-300">
        <h2>1. はじめに</h2>
        <p>Sparks Stationは、利用者の個人情報を適切に取り扱うため、本ポリシーを定めます。</p>

        <h2>2. 取得する情報</h2>
        <p>
          お問い合わせフォーム、Googleログイン、デジタル商品の購入、アクセス解析などに関連して、氏名、メールアドレス、ログイン識別子、購入情報、問い合わせ内容、Cookie、アクセスログなどを取得する場合があります。
        </p>

        <h2>3. 利用目的</h2>
        <ul>
          <li>お問い合わせへの回答</li>
          <li>購入商品の提供、購入者確認、サポート</li>
          <li>不正利用の防止、セキュリティ確保</li>
          <li>サイト改善、記事や商品の品質向上</li>
          <li>法令または規約に基づく対応</li>
        </ul>

        <h2>4. 決済情報</h2>
        <p>
          決済はStripe Checkoutを利用します。カード番号などの決済情報はStripeが管理し、本サイトでは保持しません。本サイトでは、購入者のメールアドレス、StripeのセッションID、購入商品、購入状態など、商品提供に必要な情報を保存します。
        </p>

        <h2>5. 広告・アクセス解析</h2>
        <p>
          本サイトでは、Google AdSenseやGoogle Analyticsなどの外部サービスを利用する場合があります。これらのサービスはCookie等を使用して、広告配信やアクセス解析に必要な情報を取得することがあります。
        </p>
        <p>
          Googleの広告に関する情報の取り扱いについては、
          <a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank" rel="noopener noreferrer">
            Googleのポリシーと規約
          </a>
          をご確認ください。
        </p>

        <h2>6. 第三者提供</h2>
        <p>
          法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供しません。ただし、決済、認証、アクセス解析、ホスティングなど、本サービスの提供に必要な範囲で外部サービスを利用します。
        </p>

        <h2>7. 開示・訂正・削除</h2>
        <p>
          個人情報の開示、訂正、削除、利用停止を希望される場合は、お問い合わせフォームまたは
          <a href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a>
          までご連絡ください。本人確認のうえ、法令に従って対応します。
        </p>

        <h2>8. ポリシーの変更</h2>
        <p>本ポリシーは、必要に応じて変更することがあります。変更後の内容は、本サイト上に掲載した時点で効力を生じます。</p>
      </div>
    </div>
  );
}
