import { Metadata } from "next";
import { SITE_CONTACT_EMAIL, SITE_OWNER_NAME, getMailtoHref } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | Sparks Station",
  alternates: {
    canonical: "/commerce-disclosure",
  },
};

const rows = [
  ["販売事業者", SITE_OWNER_NAME],
  ["運営責任者", SITE_OWNER_NAME],
  [
    "所在地",
    "請求があった場合、法令に基づき遅滞なく電子メールで開示します。",
  ],
  [
    "電話番号",
    "請求があった場合、法令に基づき遅滞なく電子メールで開示します。",
  ],
  ["メールアドレス", SITE_CONTACT_EMAIL],
  ["販売URL", "https://sparks-station.com/products"],
  ["販売価格", "各商品ページに税込価格を表示します。"],
  [
    "商品代金以外の必要料金",
    "インターネット接続料金、通信料金はお客様のご負担となります。",
  ],
  ["支払方法", "Stripe Checkoutによるクレジットカード決済など。"],
  ["支払時期", "購入手続き完了時に決済されます。"],
  [
    "商品の引き渡し時期",
    "決済完了後、購入時に利用したGoogleアカウントで購入者専用ページから利用できます。",
  ],
  [
    "返品・キャンセル",
    "デジタル商品の性質上、購入後のお客様都合による返品・キャンセルはお受けしていません。重複決済、アクセス不具合などがある場合はお問い合わせください。",
  ],
  [
    "動作環境",
    "最新版の主要ブラウザでの利用を想定しています。CSV/JSONの閲覧には対応アプリケーションが必要です。",
  ],
];

export default function CommercialTransactionsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-4 border-b border-neutral-800 pb-8">
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          特定商取引法に基づく表記
        </h1>
        <p className="text-sm text-neutral-400">最終更新日: 2026年5月8日</p>
      </header>

      <section className="overflow-hidden rounded-lg border border-white/10 bg-neutral-900">
        <dl className="divide-y divide-white/10">
          {rows.map(([label, value]) => (
            <div key={label} className="grid gap-2 p-4 md:grid-cols-[180px_1fr] md:gap-6">
              <dt className="text-sm font-semibold text-neutral-200">{label}</dt>
              <dd className="text-sm leading-7 text-neutral-400">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
        <p className="text-sm leading-7 text-neutral-300">
          所在地・電話番号の開示をご希望の場合は、購入前に
          <a
            href={getMailtoHref("特定商取引法に基づく表示事項の開示請求")}
            className="text-emerald-300 underline"
          >
            {SITE_CONTACT_EMAIL}
          </a>
          までご連絡ください。
        </p>
      </div>
    </div>
  );
}
