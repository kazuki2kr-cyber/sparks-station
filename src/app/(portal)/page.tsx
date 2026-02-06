import { getSortedPostsData } from '@/lib/content';
import { CATEGORIES, classifyPosts } from '@/lib/classifier';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
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
        <div className="space-y-24 pb-20">
            {/* Hero Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 px-1">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></span>
                    <span className="text-xs font-mono text-emerald-400/80 tracking-widest uppercase">Latest Spark</span>
                </div>
                <HeroSection post={latestPost} />
            </div>

            {/* Category Sections */}
            <div className="space-y-20">
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
    );
}
