
import { Metadata } from 'next';
import { Lightbulb, Database, Code2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About | Sparks Station - 知見と実装の交差点',
    description: 'Sparks Stationは、世界の最先端SaaSビジネスの成功事例を解剖し、その知見を自らのプロダクト開発へと昇華させる「SaaS Analysis & Studio」です。',
};

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-16">
            {/* Hero Section */}
            <section className="text-center space-y-6 py-12">
                <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                    <span className="text-emerald-400">Sparks Station</span><br />
                    知見と実装の交差点
                </h1>
                <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
                    Sparks Stationは、世界の最先端SaaSビジネスの成功事例を解剖し、<br className="hidden md:inline" />その知見を自らのプロダクト開発へと昇華させる<br className="hidden md:inline" /><span className="text-white font-bold">「SaaS Analysis & Studio」</span>です。
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
                        世界中で日々生まれる革新的なSaaSプロダクト。<br />
                        私たちは、それらが「なぜ成功したのか（Why）」「どのように作られたのか（How）」を、技術スタック、収益モデル、売却規模といった定量・定性の両面から徹底的に分析します。
                    </p>
                    <p>
                        しかし、私たちは単なる情報発信者（メディア）ではありません。<br />
                        得られたグローバルな知見をただの知識で終わらせず、実際に手を動かし、コードを書き、自らも市場にプロダクトを問いかける<span className="text-white font-bold">「実践者（ビルダー）」</span>であり続けます。
                    </p>
                </div>
            </section>

            {/* What we do Section */}
            <section className="space-y-8">
                <h2 className="text-2xl font-bold text-white text-center">What we do</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Card 1 */}
                    <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl hover:border-emerald-500/50 transition-colors group">
                        <div className="bg-emerald-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                            <Database className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Global SaaS Analysis</h3>
                        <p className="text-neutral-400 leading-relaxed">
                            海外の成功事例、技術選定、Exit戦略のデータベース化。
                            定量的なデータに基づき、成功の法則を導き出します。
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl hover:border-emerald-500/50 transition-colors group">
                        <div className="bg-emerald-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                            <Code2 className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Product Development</h3>
                        <p className="text-neutral-400 leading-relaxed">
                            最新のトレンドと技術を反映した自社プロダクトの開発・運営。
                            分析で得たインサイトを、実際のプロダクトに落とし込みます。
                        </p>
                    </div>
                </div>
            </section>

            {/* Closing */}
            <section className="text-center py-12 border-t border-neutral-800">
                <p className="text-lg text-neutral-300 leading-relaxed max-w-3xl mx-auto">
                    理論（Analysis）と実践（Development）。<br />
                    この2つのサイクルを高速で回し、次世代のビジネスと技術の<span className="text-amber-400 font-bold">種火（Sparks）</span>をここから生み出していきます。
                </p>
            </section>
        </div>
    );
}
