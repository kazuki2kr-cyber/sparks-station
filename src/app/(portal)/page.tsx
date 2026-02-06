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
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-neutral-100">
                    <span className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                    Latest Spark
                </h2>
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
