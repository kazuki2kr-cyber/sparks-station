import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, BadgeCheck, Database, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Products | Sparks Station',
    description: 'Sparks Stationのプロダクトとメンバーシップ。',
    alternates: {
        canonical: '/products',
    },
};

export default function ProductsPage() {
    return (
        <div className="space-y-10">
            <header className="max-w-3xl space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    Products
                </p>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white">
                    海外SaaSの成功パターンを、日本で試せる形にする。
                </h1>
                <p className="text-base leading-8 text-neutral-400">
                    Sparks Station は、事例を読む場所から、検証テンプレート・ツール選定・収益化の型まで持ち帰れる場所へ広げていきます。
                </p>
            </header>

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

                    <div className="mt-6 space-y-4 text-neutral-300">
                        <p className="text-lg leading-8">
                            月額の小さなメンバーシップとして、海外Micro-SaaS / AI SaaSの事例を「日本で再現するならどう動くか」まで分解します。
                        </p>
                    </div>

                    <div className="mt-7 grid gap-3 md:grid-cols-3">
                        {[
                            '週次の海外SaaS事例メモ',
                            '価格・GTM・初期顧客の分解',
                            '検証テンプレートとツール選定',
                        ].map((item) => (
                            <div key={item} className="flex gap-2 rounded-md border border-white/10 bg-neutral-950/40 p-3 text-sm text-neutral-300">
                                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-emerald-300"
                        >
                            先行案内を受け取る
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <span className="text-sm text-neutral-500">初期価格は月額980円から検証予定</span>
                    </div>
                </div>

                <aside className="rounded-lg border border-white/10 bg-neutral-900 p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-neutral-950 text-neutral-300">
                        <Database className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-white">買い切りデータベース</h2>
                    <p className="mt-3 text-sm leading-7 text-neutral-400">
                        海外SaaSの収益モデル、価格、買収、GTMを整理したデータベースも準備します。Proの入口商品として、まずは小さく販売検証します。
                    </p>
                    <div className="mt-5 rounded-md border border-white/10 bg-neutral-950/60 p-3 text-sm text-neutral-400">
                        想定価格: 2,980円から
                    </div>
                </aside>
            </section>
        </div>
    );
}
