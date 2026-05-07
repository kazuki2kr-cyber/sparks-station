import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, BadgeCheck, Database, FileText, Wrench } from 'lucide-react';
import { getSortedPostsData } from '@/lib/content';
import { CATEGORIES, classifyPosts } from '@/lib/classifier';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import SidebarNav from './components/SidebarNav';

export const metadata: Metadata = {
    alternates: {
        canonical: '/',
    },
};

export default async function PortalPage() {
    const allPosts = getSortedPostsData();

    if (allPosts.length === 0) {
        return <div className="text-center py-20 text-neutral-500">No posts found.</div>;
    }

    const latestPost = allPosts[0];
    const classified = classifyPosts(allPosts);

    return (
        <div className="space-y-16 pb-20">
            <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-white/10 bg-neutral-950">
                <div className="absolute inset-0">
                    <Image
                        src="/sparks-station-kv.png"
                        alt="Sparks Station"
                        fill
                        priority
                        className="object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-neutral-950/80" />
                    <div className="absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(16,185,129,0.18))]" />
                </div>

                <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-screen-xl content-center gap-10 px-6 py-16 md:py-20">
                    <div className="max-w-4xl space-y-7">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                            Sparks Station
                        </p>
                        <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-6xl">
                            海外SaaSの成功パターンを、日本で試せる形に翻訳する。
                        </h1>
                        <p className="max-w-2xl text-base leading-8 text-neutral-300 md:text-lg">
                            AIで作れる時代に残る壁は、何を誰にどう売るか。Sparks Station は海外Micro-SaaS / AI SaaSの事例を、価格・GTM・初期顧客・使うツールまで分解します。
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href="#latest"
                                className="inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-emerald-300"
                            >
                                最新事例を読む
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-emerald-300/60 hover:text-emerald-200"
                            >
                                Proを見る
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-3 border-t border-white/10 pt-6 text-sm text-neutral-400 md:grid-cols-3">
                        {[
                            ['Case', '収益・売却・成長事例を読む'],
                            ['Translate', '日本で再現する仮説に変える'],
                            ['Build', 'ツールと検証手順へ接続する'],
                        ].map(([label, text]) => (
                            <div key={label} className="flex items-center gap-3">
                                <span className="font-semibold text-emerald-300">{label}</span>
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_16rem]">
                <div className="space-y-14">
                    <section className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                                What this is
                            </p>
                            <h2 className="text-2xl font-bold leading-tight text-white md:text-3xl">
                                記事を読むだけで終わらせない。
                            </h2>
                        </div>
                        <div className="grid gap-4 text-neutral-300">
                            {[
                                {
                                    icon: FileText,
                                    title: '事例を分解する',
                                    body: '売れた理由、価格、顧客獲得、買収背景を拾い、作り手の意思決定として読む。',
                                },
                                {
                                    icon: Wrench,
                                    title: '実行手順へ翻訳する',
                                    body: '日本の個人開発者・小規模事業者が試せる検証手順とツール選定に落とす。',
                                },
                                {
                                    icon: Database,
                                    title: '再利用できる資産にする',
                                    body: '記事、Pro、買い切りDBとして蓄積し、次のプロダクト判断に使える形で残す。',
                                },
                            ].map((item) => (
                                <div key={item.title} className="grid grid-cols-[2rem_1fr] gap-4 border-b border-white/10 pb-4">
                                    <item.icon className="mt-1 h-5 w-5 text-emerald-300" />
                                    <div>
                                        <h3 className="font-semibold text-white">{item.title}</h3>
                                        <p className="mt-1 text-sm leading-6 text-neutral-400">{item.body}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="latest" className="space-y-5 scroll-mt-24">
                        <div className="flex flex-col gap-3 border-b border-neutral-800 pb-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                                    Latest Spark
                                </p>
                                <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                                    最新の海外SaaS事例
                                </h2>
                            </div>
                            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
                                Sparks Station Pro
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <HeroSection post={latestPost} />
                    </section>

                    <section className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-6 md:p-8">
                        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                            <div className="space-y-3">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                                    Sparks Station Pro
                                </p>
                                <h2 className="text-2xl font-bold text-white">
                                    事例を、毎週使える判断材料にする。
                                </h2>
                                <p className="max-w-2xl text-sm leading-7 text-neutral-400">
                                    Proでは海外Micro-SaaS / AI SaaSを、価格・GTM・初期顧客・日本での再現仮説まで整理して届けます。
                                </p>
                            </div>
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-emerald-300"
                            >
                                詳細を見る
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="mt-6 grid gap-3 md:grid-cols-3">
                            {['週次事例メモ', '検証テンプレート', '買い切りDB'].map((item) => (
                                <div key={item} className="flex items-center gap-2 text-sm text-neutral-300">
                                    <BadgeCheck className="h-4 w-4 text-emerald-300" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="space-y-12">
                        <CategorySection
                            title={CATEGORIES.success.title}
                            description={CATEGORIES.success.description}
                            posts={classified.success}
                            theme={CATEGORIES.success.theme}
                            limit={6}
                            viewAllLink={`/categories/${CATEGORIES.success.slug}`}
                        />

                        <CategorySection
                            title={CATEGORIES.thought.title}
                            description={CATEGORIES.thought.description}
                            posts={classified.thought}
                            theme={CATEGORIES.thought.theme}
                            limit={6}
                            viewAllLink={`/categories/${CATEGORIES.thought.slug}`}
                        />

                        <CategorySection
                            title={CATEGORIES.failure.title}
                            description={CATEGORIES.failure.description}
                            posts={classified.failure}
                            theme={CATEGORIES.failure.theme}
                            limit={6}
                            viewAllLink={`/categories/${CATEGORIES.failure.slug}`}
                        />
                    </div>
                </div>

                <aside className="hidden xl:block sticky top-24 self-start">
                    <SidebarNav />
                </aside>
            </div>
        </div>
    );
}
