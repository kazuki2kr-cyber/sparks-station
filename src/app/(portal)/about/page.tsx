
import { Metadata } from 'next';
import { Lightbulb, Database, Code2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About | Sparks Station - 知見と実装の交差点',
    description: 'Sparks Stationは、世界の最先端SaaSビジネスの成功事例を解剖し、その知見を自らのプロダクト開発へと昇華させる「SaaS Analysis & Studio」です。',
    alternates: {
        canonical: '/about',
    },
};

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-16">
            {/* Hero Section */}
            <section className="text-center space-y-6 py-12">
                <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                    <span className="text-emerald-400">Curiosity & Creation</span><br />
                    知見と思想を、実装する。
                </h1>
                <p className="text-lg md:text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
                    Sparks Stationは、世界の「開発事例」と「先進思想」を蓄積し、<br className="hidden md:inline" />
                    プロダクトとして形にしていくための<br className="hidden md:inline" />
                    <span className="text-white font-bold">「SaaS Analysis & Studio」</span>です。
                </p>
            </section>

            {/* Mission Section */}
            <section className="bg-neutral-800/30 border border-neutral-800 rounded-2xl p-8 md:p-12 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 bg-emerald-500/10 w-64 h-64 rounded-full blur-3xl"></div>

                <div className="flex items-center gap-3 text-emerald-400">
                    <Lightbulb className="w-6 h-6" />
                    <h2 className="text-xl font-bold uppercase tracking-wider">Mission</h2>
                </div>

                <div className="space-y-6 text-neutral-300 leading-relaxed text-lg">
                    <p>
                        「なぜ、そのサービスは成功したのか？（Case Studies）」<br />
                        「これからの時代、世界はどう変わるのか？（Advanced Thoughts）」
                    </p>
                    <p>
                        この2つの問いは、プロダクト開発における両輪です。<br />
                        世界中の事例にみられる成功のロジックと、シンギュラリティを見据えた未来への視座。<br />
                        私たちはこれらを収集・分析し、実際の<span className="text-white font-bold">「開発（Build）」</span>につなげていくことを目指します。
                    </p>
                </div>
            </section>

            {/* What we do Section */}
            <section className="space-y-8">
                <h2 className="text-2xl font-bold text-white text-center">What we do</h2>

                <div className="grid gap-6">
                    {/* Card 1: Global Case Studies */}
                    <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl hover:border-emerald-500/50 transition-colors group flex flex-col md:flex-row gap-6 items-start">
                        <div className="bg-emerald-500/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                            <Database className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-bold text-white">Global Case Studies <span className="text-emerald-500 text-sm font-normal ml-2">/ 事例</span></h3>
                            <p className="text-neutral-400 leading-relaxed">
                                海外で急成長・売却されたSaaS/Micro-SaaSの事例研究。<br />
                                「どのような課題を、どう技術で解決し、どう収益化したか」を紐解く、実践的なデータベース。
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Advanced Thoughts */}
                    <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl hover:border-emerald-500/50 transition-colors group flex flex-col md:flex-row gap-6 items-start">
                        <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                            <Lightbulb className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-bold text-white">Advanced Thoughts <span className="text-purple-400 text-sm font-normal ml-2">/ 思想</span></h3>
                            <p className="text-neutral-400 leading-relaxed">
                                テクノロジーと社会の未来を定義する、先進的な概念の探求。<br />
                                「Service-as-a-Software」や「Agent-First」など、既存の枠組みを超えた新しいナラティブを実装するための思考実験。
                            </p>
                        </div>
                    </div>

                    {/* Card 3: Product Studio */}
                    <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl hover:border-emerald-500/50 transition-colors group flex flex-col md:flex-row gap-6 items-start">
                        <div className="bg-amber-500/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                            <Code2 className="w-6 h-6 text-amber-400" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-bold text-white">Product Studio <span className="text-amber-400 text-sm font-normal ml-2">/ 創造</span></h3>
                            <p className="text-neutral-400 leading-relaxed">
                                得られた知見と思想を「種火」としたプロダクト開発（Build）。<br />
                                事例や概念を盛り込んだプロダクト開発の実践の場所。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Closing */}
            <section className="text-center py-12 border-t border-neutral-800">
                <p className="text-lg text-neutral-300 leading-relaxed max-w-3xl mx-auto">
                    学び（Input）と創造（Output）のサイクルを回し、<br />
                    次世代のビジネスと技術の<span className="text-amber-400 font-bold">種火（Sparks）</span>をここから生み出していきます。
                </p>
            </section>

            {/* Operator Info & Disclaimer */}
            <section className="border-t border-neutral-800 pt-12 text-sm text-neutral-500 space-y-8">
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="space-y-4">
                        <h3 className="font-bold text-neutral-300 uppercase tracking-wider">運営者情報</h3>
                        <dl className="grid grid-cols-[100px_1fr] gap-y-2 border-l-2 border-emerald-500/20 pl-4">
                            <dt>名称</dt>
                            <dd>Sparks Station 運営事務局</dd>
                            <dt>開設</dt>
                            <dd>2026年1月</dd>
                            <dt>事業内容</dt>
                            <dd>SaaSビジネスの事例研究・情報発信、Webアプリケーション開発</dd>
                            <dt>URL</dt>
                            <dd>https://sparks-station.com</dd>
                            <dt>お問い合わせ</dt>
                            <dd>Contactページよりお願いいたします</dd>
                        </dl>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-bold text-neutral-300 uppercase tracking-wider">免責事項</h3>
                        <p className="leading-relaxed">
                            当サイトのコンテンツ・情報について、可能な限り正確な情報を掲載するよう努めておりますが、正確性や安全性を保証するものではありません。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
