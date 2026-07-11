import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, BadgeCheck, Database, Sparkles } from "lucide-react";
import { SAAS_CASE_DB_BETA_PRICE_JPY } from "@/lib/saas-case-db";
import { SaasCaseDbCheckoutButton } from "./components/SaasCaseDbCheckoutButton";
import { ProWaitlistButton } from "./components/ProWaitlistButton";

export const metadata: Metadata = {
  title: "Sparks Stationのプロダクト",
  description:
    "AIの活用方法と海外SaaS事例を、日本で試せる判断材料やデータベースとして提供します。",
  alternates: {
    canonical: "/products",
  },
};

const betaFeatures = [
  "既存記事から抽出した海外SaaS事例15件",
  "価格、GTM、初期顧客、収益化パターンを整理",
  "購入後のWeb閲覧とCSV/JSONダウンロードに対応",
];

export default function ProductsPage() {
  return (
    <div className="space-y-10">
      <header className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Products
        </p>
        <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
          海外SaaSの成功パターンを、日本で試せる判断材料にする。
        </h1>
        <p className="text-base leading-8 text-neutral-400">
          Sparks Stationは、AIの活用方法と記事で読んだ事例を「読むだけ」で終わらせず、価格、GTM、顧客獲得、検証手順まで持ち帰れる形に整えていきます。
        </p>
      </header>

      <Link href="/categories/cases" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
        無料の事例分析を読む
        <ArrowRight className="h-4 w-4" />
      </Link>

      <section className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Coming soon
              </p>
              <h2 className="text-2xl font-bold text-white">Sparks Station Pro</h2>
            </div>
          </div>

          <p className="mt-6 text-lg leading-8 text-neutral-300">
            月額の小さなメンバーシップとして、海外Micro-SaaS / AI SaaSの事例を「日本で再現するならどう動くか」まで分解します。買い切りDBの反応を見ながら、無理のない頻度で準備します。
          </p>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {[
              "月1から2本の海外SaaS事例メモ",
              "価格、GTM、初期顧客の分解",
              "検証テンプレートとツール選定",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-2 rounded-md border border-white/10 bg-neutral-950/40 p-3 text-sm text-neutral-300"
              >
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ProWaitlistButton />
            <span className="text-sm text-neutral-500">
              Googleログインだけで登録できます。初期価格は月額980円から検証予定です。
            </span>
          </div>
        </div>

        <aside className="rounded-lg border border-white/10 bg-neutral-900 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-neutral-950 text-neutral-300">
            <Database className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Beta
          </p>
          <h2 className="mt-1 text-xl font-bold text-white">
            買い切り事例データベース
          </h2>
          <p className="mt-3 text-sm leading-7 text-neutral-400">
            海外SaaSの収益モデル、価格、買収、GTM、日本での再現仮説を整理したデータベースです。まずは15件収録のベータ版として販売します。
          </p>
          <div className="mt-5 space-y-2 rounded-md border border-white/10 bg-neutral-950/60 p-3 text-sm text-neutral-400">
            <div className="flex items-center justify-between gap-3">
              <span>ベータ価格</span>
              <span className="font-semibold text-white">
                {SAAS_CASE_DB_BETA_PRICE_JPY.toLocaleString("ja-JP")}円
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>収録件数</span>
              <span className="font-semibold text-white">15件</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>正式版v1</span>
              <span className="font-semibold text-white">準備中</span>
            </div>
          </div>
          <div className="mt-5">
            <SaasCaseDbCheckoutButton />
          </div>
          <Link
            href="/products/saas-case-db/access"
            className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-white/10 bg-neutral-950 px-4 py-2 text-sm font-semibold text-neutral-200 transition-colors hover:bg-neutral-800"
          >
            購入済みの方はこちら
          </Link>
          <p className="mt-4 text-xs leading-5 text-neutral-500">
            決済はStripe Checkoutで処理されます。購入前に
            <Link href="/commerce-disclosure" className="text-emerald-300 underline">
              特定商取引法に基づく表記
            </Link>
            をご確認ください。
          </p>
        </aside>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-neutral-900 p-6">
          <h2 className="text-lg font-bold text-white">ベータ版と正式版</h2>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-neutral-400">
            <div className="rounded-md border border-white/10 bg-neutral-950/50 p-3">
              <p className="font-semibold text-white">
                ベータ版: {SAAS_CASE_DB_BETA_PRICE_JPY.toLocaleString("ja-JP")}円
              </p>
              <p className="mt-1">
                15件収録、Web閲覧、CSV/JSONダウンロードに対応します。正式版v1まで追加料金なしで更新予定です。
              </p>
            </div>
            <div className="rounded-md border border-white/10 bg-neutral-950/50 p-3">
              <p className="font-semibold text-white">正式版: 準備中</p>
              <p className="mt-1">
                30件以上を目安に、主要URL、価格、売上情報、GTM仮説を確認してから公開します。
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-neutral-900 p-6">
          <h2 className="text-lg font-bold text-white">含まれるもの</h2>
          <div className="mt-4 grid gap-3">
            {betaFeatures.map((feature) => (
              <div key={feature} className="flex gap-2 text-sm leading-6 text-neutral-300">
                <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-neutral-500">
            個別相談、添削、優先リサーチ、DMサポートは含みません。Proでは、継続的な事例更新と検証テンプレートを中心に設計予定です。
          </p>
        </div>
      </section>
    </div>
  );
}
