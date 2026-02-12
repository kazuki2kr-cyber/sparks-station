import { getSortedPostsData } from '@/lib/content';
import { CATEGORIES, classifyPosts } from '@/lib/classifier';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import SidebarNav from './components/SidebarNav';
import { Metadata } from 'next';

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

    // 1. Latest Post (Hero)
    const latestPost = allPosts[0];

    // 2. Classify ALL posts (including latest, as requested)
    const classified = classifyPosts(allPosts);


    return (
        <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 space-y-12 pb-20">
                {/* Hero Section */}
                <div className="space-y-4">
                    <section className="text-center space-y-6 py-8 mb-6 relative">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 uppercase mb-2">
                            Sparks Station
                        </h2>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
                            最新の<span className="text-emerald-400">「開発事例」</span>と<br className="hidden md:block" />
                            先進的な<span className="text-emerald-400">「思想」</span>を<br className="hidden md:block" />
                            <span className="text-emerald-400">「プロダクト」</span>へ。
                        </h1>
                        <p className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
                            海の向こうの開発事例と、AI時代の新たな思想。<br />
                            2つの知見を種火（Sparks）に変えて、<br />
                            次世代のプロダクトを創り出す。
                        </p>
                    </section>

                    <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-neutral-100">
                        <span className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                        Latest Spark
                    </h2>
                    <HeroSection post={latestPost} />
                </div>

                {/* Category Sections */}
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

            {/* Sidebar - Only visible on XL screens */}
            <aside className="hidden xl:block w-64 sticky top-24 self-start">
                <SidebarNav />
            </aside>
        </div>
    );
}
