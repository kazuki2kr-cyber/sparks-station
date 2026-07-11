import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, BadgeCheck, Database, Lightbulb, Wrench } from 'lucide-react';

export const metadata: Metadata = {
    title: 'AIアップデートとSaaS事例について',
    description: 'Sparks Stationは、AIの最新アップデートと海外SaaS事例を、日本の個人開発者・小規模事業者が試せる形に翻訳するメディア兼プロダクトスタジオです。',
    alternates: {
        canonical: '/about',
    },
};

export default function AboutPage() {
    return (
        <div className="mx-auto max-w-5xl space-y-16">
            <section className="grid gap-8 py-10 md:grid-cols-[0.95fr_1.05fr] md:items-end">
                <div className="space-y-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                        About Sparks Station
                    </p>
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
                        AIの変化と海外SaaS事例を、日本で実行できる形へ。
                    </h1>
                </div>
                <p className="text-base leading-8 text-neutral-300 md:text-lg">
                    Sparks Stationは、AIの最新アップデートと海外Micro-SaaS / AI SaaSの事例を追い、日本語で要点を整理します。新機能の活用方法から、価格・GTM・初期顧客・ツール選定まで、次の検証に使える形で届けます。
                </p>
            </section>

            <section className="border-y border-white/10 py-10">
                <div className="grid gap-8 md:grid-cols-3">
                    {[
                        {
                            icon: Database,
                            title: 'AI Updates',
                            body: 'モデル、開発者ツール、エージェント機能の更新を、公式情報から読み解く。',
                        },
                        {
                            icon: Lightbulb,
                            title: 'Case Studies',
                            body: '売上、売却、顧客獲得、価格変更。数字と一次情報から、事例の構造を読む。',
                        },
                        {
                            icon: Wrench,
                            title: 'Build',
                            body: '記事、Pro、データベース、テンプレートとして、実行に使える資産にする。',
                        },
                    ].map((item) => (
                        <div key={item.title} className="space-y-3">
                            <item.icon className="h-6 w-6 text-emerald-300" />
                            <h2 className="text-xl font-bold text-white">{item.title}</h2>
                            <p className="text-sm leading-7 text-neutral-400">{item.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="grid gap-10 md:grid-cols-[0.75fr_1.25fr]">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                        Editorial stance
                    </p>
                    <h2 className="mt-3 text-2xl font-bold text-white">
                        紹介ではなく、再現可能性を見る。
                    </h2>
                </div>
                <div className="space-y-4">
                    {[
                        '何を作ったかより、誰がなぜ払ったかを優先して読む。',
                        'PVや話題性より、価格・継続利用・販売チャネルを重視する。',
                        'AIの更新は、機能紹介だけでなく具体的な活用方法まで整理する。',
                        '事例は成功だけでなく、売れなかった理由と撤退パターンも扱う。',
                        '記事の最後には、日本で試すなら何から始めるかを残す。',
                    ].map((item) => (
                        <div key={item} className="flex gap-3 border-b border-white/10 pb-4 text-neutral-300">
                            <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />
                            <p className="leading-7">{item}</p>
                        </div>
                    ))}
                </div>
            </section>

            <nav aria-label="記事カテゴリ" className="grid gap-4 md:grid-cols-2">
                <Link href="/categories/ai" className="group border-t border-cyan-400/30 py-5 transition-colors hover:border-cyan-300">
                    <span className="text-sm font-semibold text-cyan-300">AI Updates</span>
                    <span className="mt-2 flex items-center justify-between text-lg font-bold text-white">
                        最新AIの解説と活用方法を読む
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                </Link>
                <Link href="/categories/cases" className="group border-t border-amber-400/30 py-5 transition-colors hover:border-amber-300">
                    <span className="text-sm font-semibold text-amber-300">Case Studies</span>
                    <span className="mt-2 flex items-center justify-between text-lg font-bold text-white">
                        海外SaaSの事例分析を読む
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                </Link>
            </nav>

            <section className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-white">Sparks Station Pro</h2>
                        <p className="max-w-2xl text-sm leading-7 text-neutral-400">
                            無料記事で公開するAI活用とSaaS事例を、より深く、より実行寄りに整理するメンバーシップを準備しています。買い切りDBと合わせて、小さく検証していきます。
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-emerald-300"
                    >
                        Productsを見る
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            <section className="border-t border-neutral-800 pt-12 text-sm text-neutral-500">
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                        <h3 className="font-bold uppercase tracking-wider text-neutral-300">運営者情報</h3>
                        <dl className="grid grid-cols-[100px_1fr] gap-y-2 border-l-2 border-emerald-500/20 pl-4">
                            <dt>名称</dt>
                            <dd>Sparks Station 運営事務局</dd>
                            <dt>開設</dt>
                            <dd>2026年1月</dd>
                            <dt>事業内容</dt>
                            <dd>AIアップデート・SaaS事例の調査と情報発信、Webアプリケーション開発</dd>
                            <dt>URL</dt>
                            <dd>https://sparks-station.com</dd>
                            <dt>お問い合わせ</dt>
                            <dd>Contactページよりお願いいたします</dd>
                        </dl>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-bold uppercase tracking-wider text-neutral-300">免責事項</h3>
                        <p className="leading-7">
                            当サイトのコンテンツ・情報について、可能な限り正確な情報を掲載するよう努めておりますが、正確性や安全性を保証するものではありません。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
